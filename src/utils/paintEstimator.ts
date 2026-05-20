import { RoomZone, RoomDimensions, PaintEstimateResult } from '../types';
import { PRICING } from '../constants/pricingConfig';

/**
 * Calculate paint estimate based on room dimensions and selected zones.
 */
export function calculatePaintEstimate(
  zones: RoomZone[],
  dimensions: RoomDimensions,
): PaintEstimateResult {
  const { length, width, height, doors, windows, cabinets = 0 } = dimensions;
  const { coverageSqFtPerGallon, defaultCoats, minimumJobCharge, paintMarkup, gallonPrices, laborPerSqFt, doorDeductionSqFt, windowDeductionSqFt } = PRICING;

  const enabledZones = zones.filter(z => z.enabled);
  const totalWallArea = 2 * (length + width) * height;
  const deductions = (doors * doorDeductionSqFt) + (windows * windowDeductionSqFt);
  const netWallArea = Math.max(0, totalWallArea - deductions);
  const ceilingArea = length * width;

  const zoneEstimates = enabledZones.map(zone => {
    let areaSqFt: number;
    if (zone.category === 'ceiling') {
      areaSqFt = ceilingArea;
    } else if (zone.category === 'accent-wall') {
      areaSqFt = Math.max(length, width) * height;
    } else if (zone.category === 'trim') {
      const perimeterFt = 2 * (length + width);
      areaSqFt = perimeterFt * 0.5; // ~6" baseboard
    } else {
      areaSqFt = netWallArea;
    }

    let gallonsNeeded = Math.ceil((areaSqFt * defaultCoats) / coverageSqFtPerGallon);
    let pricePerGallon = (gallonPrices[zone.selectedLine.id] || 76) * paintMarkup;
    let paintCost = gallonsNeeded * pricePerGallon;
    let laborRate = laborPerSqFt[zone.category] || laborPerSqFt.walls;
    let laborCost = areaSqFt * laborRate;

    if (zone.category === 'cabinets') {
      areaSqFt = cabinets * 3; // Rough approximation: 3 sqft per door
      gallonsNeeded = Math.ceil((areaSqFt * defaultCoats) / coverageSqFtPerGallon);
      const totalCabinetCost = cabinets * (PRICING.cabinetDoorPrice || 120);
      paintCost = totalCabinetCost * 0.2; // Allocate 20% to paint
      laborCost = totalCabinetCost * 0.8; // Allocate 80% to labor
    }

    return {
      name: zone.name,
      category: zone.category,
      areaSqFt: Math.round(areaSqFt),
      colorName: zone.selectedColor.name,
      lineName: zone.selectedLine.line,
      gallonsNeeded,
      paintCost: Math.round(paintCost),
      laborCost: Math.round(laborCost),
    };
  });

  const totalPaintCost = zoneEstimates.reduce((s, z) => s + z.paintCost, 0);
  const totalLaborCost = zoneEstimates.reduce((s, z) => s + z.laborCost, 0);
  const rawTotal = totalPaintCost + totalLaborCost;
  const totalEstimate = Math.max(rawTotal, minimumJobCharge);
  const totalGallons = zoneEstimates.reduce((s, z) => s + z.gallonsNeeded, 0);

  return {
    zones: zoneEstimates,
    totalPaintCost,
    totalLaborCost,
    totalEstimate,
    totalGallons,
    coats: defaultCoats,
  };
}
