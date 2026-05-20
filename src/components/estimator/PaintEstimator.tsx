import React, { useState, useMemo } from 'react';
import { Calculator, Ruler, DoorOpen, Square, ChevronDown } from 'lucide-react';
import { RoomZone, RoomDimensions, PaintEstimateResult } from '../../types';
import { calculatePaintEstimate } from '../../utils/paintEstimator';
import { PRICING } from '../../constants/pricingConfig';

interface PaintEstimatorProps {
  zones: RoomZone[];
  onRequestQuote: (estimate: PaintEstimateResult, dimensions: RoomDimensions) => void;
  initialDimensions?: RoomDimensions;
}

const PaintEstimator: React.FC<PaintEstimatorProps> = ({ zones, onRequestQuote, initialDimensions }) => {
  const [dimensions, setDimensions] = useState<RoomDimensions>(initialDimensions ? {
    length: Number(initialDimensions.length) || 12,
    width: Number(initialDimensions.width) || 12,
    height: Number(initialDimensions.height) || 8,
    doors: 1,
    windows: 2,
    cabinets: 15,
  } : {
    length: 12, width: 14, height: 8, doors: 1, windows: 2, cabinets: 15,
  });
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [activePreset, setActivePreset] = useState<number>(initialDimensions ? -1 : 1);

  const estimate = useMemo(
    () => calculatePaintEstimate(zones, dimensions),
    [zones, dimensions]
  );

  const applyPreset = (idx: number) => {
    const p = PRICING.roomPresets[idx];
    setDimensions({ length: p.length, width: p.width, height: p.height, doors: p.doors, windows: p.windows, cabinets: 15 });
    setActivePreset(idx);
  };

  const updateDim = (key: keyof RoomDimensions, val: string) => {
    const num = Math.max(0, Number(val) || 0);
    setDimensions(d => ({ ...d, [key]: num }));
    setActivePreset(-1);
  };

  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#111827] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-[#0F172A] border-b border-[#1E293B]">
        <div className="w-7 h-7 bg-[#7C3AED]/20 rounded-lg flex items-center justify-center">
          <Calculator className="w-4 h-4 text-[#A78BFA]" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">Paint Estimate</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Room Presets */}
        <div>
          <label className="text-[9px] text-[#64748B] font-bold uppercase tracking-widest mb-2 block">Quick Select</label>
          <div className="grid grid-cols-4 gap-1">
            {PRICING.roomPresets.map((p, i) => (
              <button key={i} onClick={() => applyPreset(i)}
                className={`px-2 py-1.5 rounded text-[8px] font-bold uppercase tracking-wider transition-colors ${
                  activePreset === i
                    ? 'bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/40'
                    : 'bg-[#1E293B] text-[#64748B] hover:text-[#94A3B8] border border-transparent'
                }`}
              >{p.label}</button>
            ))}
          </div>
        </div>

        {/* Dimension Inputs */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'length' as const, label: 'Length (ft)', icon: Ruler },
            { key: 'width' as const, label: 'Width (ft)', icon: Ruler },
            { key: 'height' as const, label: 'Height (ft)', icon: Square },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <label className="text-[8px] text-[#475569] uppercase tracking-wider flex items-center gap-1 mb-1">
                <Icon className="w-2.5 h-2.5" />{label}
              </label>
              <input type="number" value={dimensions[key]} min={1} max={99}
                onChange={e => updateDim(key, e.target.value)}
                className="w-full bg-[#0A0E17] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:border-[#7C3AED] focus:outline-none transition-colors text-center"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'doors' as const, label: 'Doors', icon: DoorOpen },
            { key: 'windows' as const, label: 'Windows', icon: Square },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <label className="text-[8px] text-[#475569] uppercase tracking-wider flex items-center gap-1 mb-1">
                <Icon className="w-2.5 h-2.5" />{label}
              </label>
              <input type="number" value={dimensions[key]} min={0} max={20}
                onChange={e => updateDim(key, e.target.value)}
                className="w-full bg-[#0A0E17] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:border-[#7C3AED] focus:outline-none transition-colors text-center"
              />
            </div>
          ))}
        </div>

        {zones.some(z => z.enabled && z.category === 'cabinets') && (
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="text-[8px] text-[#475569] uppercase tracking-wider flex items-center gap-1 mb-1">
                <Square className="w-2.5 h-2.5" />Cabinet Doors & Drawers
              </label>
              <input type="number" value={dimensions.cabinets || 0} min={0} max={100}
                onChange={e => updateDim('cabinets', e.target.value)}
                className="w-full bg-[#0A0E17] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:border-[#7C3AED] focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* Estimate Total */}
        <div className="bg-gradient-to-br from-[#3B82F6]/10 to-[#10B981]/10 border border-[#3B82F6]/30 rounded-xl p-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[9px] text-[#A78BFA] uppercase tracking-widest font-bold">Estimated Total</span>
            <span className="text-[9px] text-[#64748B]">{estimate.coats} coats · {estimate.totalGallons} gal</span>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            ${estimate.totalEstimate.toLocaleString()}
          </div>
          <p className="text-[8px] text-[#64748B] mt-1">Materials + Labor · Sherwin-Williams paints</p>
        </div>

        {/* Breakdown Toggle */}
        <button onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between text-[9px] text-[#64748B] hover:text-[#94A3B8] transition-colors py-1"
        >
          <span className="font-bold uppercase tracking-widest">View Breakdown</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
        </button>

        {showBreakdown && (
          <div className="space-y-2 border-t border-[#1E293B] pt-3">
            {estimate.zones.map((z, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#1E293B]/50 last:border-0">
                <div>
                  <p className="text-[10px] text-[#E2E8F0] font-semibold">{z.name}</p>
                  <p className="text-[8px] text-[#64748B]">
                    {z.areaSqFt} sqft · {z.gallonsNeeded} gal {z.lineName} "{z.colorName}"
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white font-bold">${(z.paintCost + z.laborCost).toLocaleString()}</p>
                  <p className="text-[8px] text-[#475569]">paint ${z.paintCost} + labor ${z.laborCost}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-[#334155]">
              <span className="text-[9px] text-[#94A3B8] font-bold">Materials</span>
              <span className="text-[10px] text-white font-bold">${estimate.totalPaintCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] text-[#94A3B8] font-bold">Labor</span>
              <span className="text-[10px] text-white font-bold">${estimate.totalLaborCost.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <button onClick={() => onRequestQuote(estimate, dimensions)}
          className="w-full py-3.5 rounded-lg font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all uppercase tracking-wider text-[11px] flex items-center justify-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          Request This Quote
        </button>
      </div>
    </div>
  );
};

export default PaintEstimator;
