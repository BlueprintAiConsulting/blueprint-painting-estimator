/**
 * Blueprint Painting Estimator — Pricing Configuration
 * Default pricing based on York County, PA market averages.
 */
export const PRICING = {
  laborPerSqFt: {
    walls: 3.00,
    'accent-wall': 3.50,
    trim: 4.50,
    ceiling: 3.00,
  } as Record<string, number>,
  cabinetDoorPrice: 120, // $120 per cabinet door/drawer
  coverageSqFtPerGallon: 350,
  defaultCoats: 2,
  minimumJobCharge: 500,
  paintMarkup: 1.0,
  gallonPrices: {
    'sw-duration-neutrals': 76,
    'sw-duration-cool': 76,
    'sw-duration-bold': 76,
    'sw-emerald-neutrals': 94,
    'sw-emerald-signature': 94,
    'sw-proclassic-trim': 82,
    'sw-ceiling-paint': 58,
  } as Record<string, number>,
  doorDeductionSqFt: 21,
  windowDeductionSqFt: 15,
  roomPresets: [
    { label: 'Small Room', length: 10, width: 10, height: 8, doors: 1, windows: 1 },
    { label: 'Medium Room', length: 12, width: 14, height: 8, doors: 1, windows: 2 },
    { label: 'Large Room', length: 14, width: 18, height: 9, doors: 2, windows: 3 },
    { label: 'Great Room', length: 18, width: 24, height: 10, doors: 2, windows: 4 },
  ],
};
