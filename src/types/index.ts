// ─── ROOM TYPES ───
export type RoomType = 'kitchen' | 'bathroom' | 'bedroom' | 'living-room' | 'dining-room' | 'office';

// ─── SURFACE CATEGORIES (paint-only) ───
export type SurfaceCategory = 'walls' | 'accent-wall' | 'trim' | 'ceiling' | 'cabinets';

// ─── MATERIAL INTERFACES ───
export interface MaterialColor {
  id: string;
  name: string;
  hex: string;
  hue: string;        // human-readable description for AI prompt
  swCode?: string;     // Sherwin-Williams color code (e.g. "SW 7029")
  swatchUrl?: string;  // optional real swatch image
}

export interface MaterialLine {
  id: string;
  brand: string;        // "Sherwin-Williams"
  line: string;         // "Duration", "Emerald", etc.
  material: string;     // "Interior Latex Paint"
  category: SurfaceCategory;
  tier: 'premium' | 'ultra-premium' | 'trim';
  profileLabel: string; // "Eggshell / Satin Finish"
  textureImage?: string;
  description: string;
  colors: MaterialColor[];
}

// ─── ROOM ZONE (paint surfaces) ───
export interface RoomZone {
  id: string;
  name: string;            // "Wall Color", "Accent Wall", etc.
  category: SurfaceCategory;
  enabled: boolean;
  selectedLine: MaterialLine;
  selectedColor: MaterialColor;
  maskTarget?: string;     // AI segmentation instruction
}

// ─── ROOM TEMPLATE ───
export interface RoomTemplate {
  type: RoomType;
  label: string;
  icon: string;
  defaultZones: SurfaceCategory[];
  description: string;
}

// ─── RENDER PHASE ───
export type RenderPhase = 'idle' | 'painting' | 'done';

// ─── PIPELINE ZONE PAYLOAD (sent to server) ───
export interface PaintZonePayload {
  name: string;
  category: SurfaceCategory;
  brand: string;
  lineName: string;
  colorName: string;
  colorHex: string;
  hue: string;
  swCode?: string;
  finish: string;
}

// ─── PAINT ESTIMATE ───
export interface PaintEstimateResult {
  zones: {
    name: string;
    category: SurfaceCategory;
    areaSqFt: number;
    colorName: string;
    lineName: string;
    gallonsNeeded: number;
    paintCost: number;
    laborCost: number;
  }[];
  totalPaintCost: number;
  totalLaborCost: number;
  totalEstimate: number;
  totalGallons: number;
  coats: number;
}

// ─── ROOM DIMENSIONS ───
export interface RoomDimensions {
  length: number;  // feet
  width: number;   // feet
  height: number;  // feet
  doors: number;
  windows: number;
  cabinets?: number; // number of cabinet doors/drawers
}

// ─── BRANDING CONFIG ───
export interface BrandConfig {
  name: string;
  tagline: string;
  presenter: string;
  primaryColor: string;
  logoUrl: string;
  accentGradient: string;
}
