import React from 'react';
import { Loader2 } from 'lucide-react';
import { RenderPhase } from '../../types';

interface VisualizerCanvasProps {
  selectedImage: string | null;
  resultImage: string | null;
  isProcessing: boolean;
  isQuickGenerating: boolean;
  sliderPos: number;
  setSliderPos: (pos: number) => void;
  elapsedSecs: number;
  renderPhase: RenderPhase;
  swatchPreviewHex: string | null;
  swatchPreviewName: string | null;
  pixelsPerFoot?: number | null;
  setPixelsPerFoot?: (val: number | null) => void;
}

const PHASE_LABELS: Record<string, string> = {
  painting: 'Applying Paint Colors...',
  done: 'Paint Applied!',
};

const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  selectedImage,
  resultImage,
  isProcessing,
  isQuickGenerating,
  sliderPos,
  setSliderPos,
  elapsedSecs,
  renderPhase,
  swatchPreviewHex,
  swatchPreviewName,
  pixelsPerFoot,
  setPixelsPerFoot,
}) => {
  const isGenerating = isProcessing || isQuickGenerating;
  const hasResult = !!resultImage;

  // Calibration state
  const [isCalibrating, setIsCalibrating] = React.useState(false);
  const [pt1, setPt1] = React.useState<{x: number, y: number} | null>(null);
  const [pt2, setPt2] = React.useState<{x: number, y: number} | null>(null);

  const startCalibration = () => {
    setIsCalibrating(true);
    setPt1(null);
    setPt2(null);
  };

  // Cancel calibration if window resizes (points become invalid)
  React.useEffect(() => {
    if (!isCalibrating) return;
    const handleResize = () => {
      setIsCalibrating(false);
      setPt1(null);
      setPt2(null);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCalibrating]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCalibrating) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!pt1) {
      setPt1({ x, y });
    } else if (!pt2) {
      setPt2({ x, y });
      
      // We have both points, ask for distance
      const distancePixels = Math.sqrt(Math.pow(x - pt1.x, 2) + Math.pow(y - pt1.y, 2));
      
      if (distancePixels < 10) {
        alert("Line too short. Please draw a longer reference line.");
        setPt1(null);
        setPt2(null);
        return;
      }

      setTimeout(() => {
        const feetStr = window.prompt("Enter the length of this line in feet. Tip: Standard ceilings are usually 8 or 9 feet.", "8");
        if (feetStr && !isNaN(Number(feetStr)) && Number(feetStr) > 0) {
          const feet = Number(feetStr);
          if (setPixelsPerFoot) {
            setPixelsPerFoot(distancePixels / feet);
          }
        }
        setIsCalibrating(false);
        setPt1(null);
        setPt2(null);
      }, 50);
    }
  };

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasResult) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setSliderPos(x * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!hasResult || e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
    setSliderPos(x * 100);
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-[#0A0E17] rounded-b-xl">
      {/* Empty state */}
      {!selectedImage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1E293B] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[#475569]">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <p className="text-[11px] text-[#475569] font-medium">Upload a room photo to begin</p>
          </div>
        </div>
      )}

      {/* Image display - before/after slider */}
      {selectedImage && (
        <div
          className={`absolute inset-0 ${isCalibrating ? 'cursor-crosshair' : 'cursor-col-resize'} select-none`}
          onMouseMove={(hasResult && !isCalibrating) ? handleSliderMove : undefined}
          onTouchMove={(hasResult && !isCalibrating) ? handleTouchMove : undefined}
          onClick={handleCanvasClick}
        >
          {/* Original image (full width) */}
          <img
            src={selectedImage}
            alt="Original room"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />

          {/* Result image (clipped by slider) */}
          {hasResult && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src={resultImage}
                alt="Visualized result"
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />
            </div>
          )}

          {/* Slider line */}
          {hasResult && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)] z-10"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" className="w-4 h-4">
                  <path d="M8 18l-6-6 6-6M16 6l6 6-6 6"/>
                </svg>
              </div>
            </div>
          )}

          {/* Calibration drawing overlay */}
          {isCalibrating && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              {pt1 && (
                <div className="absolute w-3 h-3 rounded-full bg-blue-500 border-2 border-white -translate-x-1.5 -translate-y-1.5 shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ left: pt1.x, top: pt1.y }} />
              )}
              {pt2 && (
                <div className="absolute w-3 h-3 rounded-full bg-blue-500 border-2 border-white -translate-x-1.5 -translate-y-1.5 shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ left: pt2.x, top: pt2.y }} />
              )}
              {pt1 && pt2 && (
                <svg className="absolute inset-0 w-full h-full">
                  <line x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y} stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              )}
            </div>
          )}

          {/* Before/After labels */}
          {hasResult && !isCalibrating && (
            <>
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded text-[9px] font-bold text-white/80 uppercase tracking-wider backdrop-blur-sm">
                Before
              </div>
              <div className="absolute top-3 right-3 px-2 py-1 bg-[#10B981]/80 rounded text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                After
              </div>
            </>
          )}

          {/* Calibration helper text */}
          {isCalibrating && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#0F172A]/95 backdrop-blur-md border border-[#3B82F6] rounded-full shadow-2xl z-30">
              <p className="text-[11px] font-bold text-white tracking-wide">
                {!pt1 ? "Click the floor, then the ceiling (Standard ceilings are 8ft)" : "Click the second point"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Set Scale Button */}
      {hasResult && !isGenerating && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={isCalibrating ? () => setIsCalibrating(false) : startCalibration}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors border shadow-md backdrop-blur-sm ${
              isCalibrating 
                ? 'bg-red-500/80 border-red-400 text-white hover:bg-red-600/80' 
                : pixelsPerFoot
                  ? 'bg-[#10B981]/80 border-[#059669] text-white hover:bg-[#059669]/90'
                  : 'bg-[#1E293B]/80 border-[#334155] text-[#E2E8F0] hover:bg-[#334155]/90'
            }`}
          >
            {isCalibrating ? 'Cancel' : pixelsPerFoot ? 'Scale Set' : 'Set Scale (Draw)'}
          </button>
        </div>
      )}

      {/* Swatch preview overlay */}
      {swatchPreviewHex && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#0F172A]/90 backdrop-blur-sm border border-[#334155] rounded-lg px-3 py-2 z-20">
          <div className="w-6 h-6 rounded-md border border-white/20" style={{ backgroundColor: swatchPreviewHex }} />
          <span className="text-[10px] text-[#E2E8F0] font-medium">{swatchPreviewName}</span>
        </div>
      )}

      {/* Generation overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-[#0A0E17]/80 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#E2E8F0]">
                {PHASE_LABELS[renderPhase] || 'Generating Visualization...'}
              </p>
              <p className="text-[10px] text-[#64748B]">
                {elapsedSecs}s elapsed — AI is applying your paint colors
              </p>
            </div>
            <div className="w-48 h-1 bg-[#1E293B] rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-[#5B21B6] to-[#3B82F6] rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizerCanvas;
