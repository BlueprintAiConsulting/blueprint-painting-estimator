import { MaterialLine } from '../types';

/**
 * Sherwin-Williams Interior Paint Catalog
 * Organized by product line — Duration (Premium) & Emerald (Ultra-Premium)
 * Official SW color names and codes.
 */

// ─── CURATED WALL COLORS ───
export const CURATED_WALL_COLORS: MaterialLine = {
  id: 'sw-emerald-curated',
  brand: 'Sherwin-Williams',
  line: 'Emerald — Designer Curated',
  material: 'Emerald Interior Acrylic Latex',
  category: 'walls',
  tier: 'ultra-premium',
  profileLabel: 'Matte / Satin Finish',
  description: 'A curated selection of highly distinct, most popular Sherwin-Williams colors.',
  colors: [
    // Whites & Creams
    { id: 'en-pure-white',       name: 'Pure White',       hex: '#EDEBE2', hue: 'Warm crisp white',                    swCode: 'SW 7005' },
    { id: 'dn-alabaster',        name: 'Alabaster',        hex: '#EDEADE', hue: 'Warm soft white with creamy cast',     swCode: 'SW 7008' },
    
    // Greiges & Taupes
    { id: 'dn-agreeable-gray',   name: 'Agreeable Gray',   hex: '#D0C8B8', hue: 'Warm greige with beige undertone',    swCode: 'SW 7029' },
    { id: 'dn-accessible-beige', name: 'Accessible Beige',  hex: '#D2C6AD', hue: 'Soft warm beige with gray undertone', swCode: 'SW 7036' },
    { id: 'dn-repose-gray',      name: 'Repose Gray',      hex: '#C2BDB5', hue: 'True balanced warm gray',             swCode: 'SW 7015' },
    
    // Cool Tones
    { id: 'dc-sea-salt',         name: 'Sea Salt',         hex: '#C6D0C4', hue: 'Soft green-gray coastal',            swCode: 'SW 6204' },
    { id: 'es-waterloo',         name: 'Waterloo',         hex: '#5E6B73', hue: 'Rich muted denim blue',               swCode: 'SW 9141' },
    { id: 'dc-silver-strand',    name: 'Silver Strand',    hex: '#C1C5BD', hue: 'Cool silver-green-gray',             swCode: 'SW 7057' },

    // Bolds & Darks
    { id: 'db-naval',            name: 'Naval',            hex: '#2F3D4F', hue: 'Deep classic navy blue',              swCode: 'SW 6244' },
    { id: 'db-evergreen-fog',    name: 'Evergreen Fog',    hex: '#8E9585', hue: 'Moody sage green-gray',               swCode: 'SW 9130' },
    { id: 'db-iron-ore',         name: 'Iron Ore',         hex: '#4A4845', hue: 'Very dark warm charcoal',             swCode: 'SW 7069' },
    { id: 'db-tricorn-black',    name: 'Tricorn Black',    hex: '#2E2E2E', hue: 'True deep matte black',               swCode: 'SW 6258' },
    { id: 'es-pewter-cast',      name: 'Pewter Cast',      hex: '#6B6C65', hue: 'Medium dark green-gray',              swCode: 'SW 7673' },
  ]
};

// ─── TRIM & CEILING PAINT ───
export const TRIM_PAINT: MaterialLine = {
  id: 'sw-proclassic-trim',
  brand: 'Sherwin-Williams',
  line: 'ProClassic — Trim & Doors',
  material: 'ProClassic Interior Waterbased Acrylic-Alkyd',
  category: 'trim',
  tier: 'trim',
  profileLabel: 'Semi-Gloss / High-Gloss',
  description: 'Ultra-smooth, hard-drying enamel for trim, baseboards, crown molding, and doors.',
  colors: [
    { id: 'tp-extra-white',      name: 'Extra White',      hex: '#F0EDE7', hue: 'Clean true white',                    swCode: 'SW 7006' },
    { id: 'tp-pure-white',       name: 'Pure White',       hex: '#EDEBE2', hue: 'Warm crisp white',                    swCode: 'SW 7005' },
    { id: 'tp-snowbound',        name: 'Snowbound',        hex: '#EDE8DF', hue: 'Warm neutral white',                  swCode: 'SW 7004' },
    { id: 'tp-alabaster',        name: 'Alabaster',        hex: '#EDEADE', hue: 'Warm soft white with creamy cast',     swCode: 'SW 7008' },
    { id: 'tp-dover-white',      name: 'Dover White',      hex: '#E8DFC9', hue: 'Classic warm cream',                  swCode: 'SW 6385' },
    { id: 'tp-greek-villa',      name: 'Greek Villa',      hex: '#EFE8D6', hue: 'Warm creamy ivory',                   swCode: 'SW 7551' },
    { id: 'tp-high-reflective',  name: 'High Reflective White', hex: '#F5F5F2', hue: 'Brightest possible white',       swCode: 'SW 7757' },
    { id: 'tp-iron-ore',         name: 'Iron Ore',         hex: '#4A4845', hue: 'Dark charcoal — dramatic trim',        swCode: 'SW 7069' },
  ]
};

export const CEILING_PAINT: MaterialLine = {
  id: 'sw-ceiling-paint',
  brand: 'Sherwin-Williams',
  line: 'CHB Ceiling Paint',
  material: 'Ceiling Paint — Flat Latex',
  category: 'ceiling',
  tier: 'trim',
  profileLabel: 'Ultra-Flat',
  description: 'Spatter-resistant, ultra-flat ceiling paint that hides imperfections.',
  colors: [
    { id: 'cp-ceiling-white',    name: 'Ceiling Bright White', hex: '#F5F5F2', hue: 'Ultra-flat bright white',          swCode: 'SW 7007' },
    { id: 'cp-extra-white',      name: 'Extra White',          hex: '#F0EDE7', hue: 'Clean true white for ceilings',    swCode: 'SW 7006' },
  ]
};

// ─── CABINET PAINT ───
export const CABINET_PAINT: MaterialLine = {
  id: 'sw-emerald-urethanc',
  brand: 'Sherwin-Williams',
  line: 'Emerald Urethane Trim Enamel',
  material: 'Waterbased Urethane Enamel',
  category: 'cabinets',
  tier: 'ultra-premium',
  profileLabel: 'Satin / Semi-Gloss',
  description: 'Ultra-durable, factory-like finish perfect for high-traffic cabinets and doors.',
  colors: [
    { id: 'cb-extra-white',      name: 'Extra White',      hex: '#F0EDE7', hue: 'Clean true white',                    swCode: 'SW 7006' },
    { id: 'cb-pure-white',       name: 'Pure White',       hex: '#EDEBE2', hue: 'Warm crisp white',                    swCode: 'SW 7005' },
    { id: 'cb-snowbound',        name: 'Snowbound',        hex: '#EDE8DF', hue: 'Warm neutral white',                  swCode: 'SW 7004' },
    { id: 'cb-alabaster',        name: 'Alabaster',        hex: '#EDEADE', hue: 'Warm soft white with creamy cast',     swCode: 'SW 7008' },
    { id: 'cb-accessible-beige', name: 'Accessible Beige',  hex: '#D2C6AD', hue: 'Soft warm beige with gray undertone', swCode: 'SW 7036' },
    { id: 'cb-repose-gray',      name: 'Repose Gray',      hex: '#C2BDB5', hue: 'True balanced warm gray',             swCode: 'SW 7015' },
    { id: 'cb-naval',            name: 'Naval',            hex: '#2F3D4F', hue: 'Deep classic navy blue',              swCode: 'SW 6244' },
    { id: 'cb-peppercorn',       name: 'Peppercorn',       hex: '#5D5C58', hue: 'Warm dark charcoal-brown',            swCode: 'SW 7674' },
    { id: 'cb-iron-ore',         name: 'Iron Ore',         hex: '#4A4845', hue: 'Dark charcoal — dramatic contrast',    swCode: 'SW 7069' },
    { id: 'cb-tricorn-black',    name: 'Tricorn Black',    hex: '#2E2E2E', hue: 'True deep matte black',               swCode: 'SW 6258' },
  ]
};

// ─── EXPORTS ───
export const WALL_PAINT_OPTIONS: MaterialLine[] = [
  CURATED_WALL_COLORS,
];

export const TRIM_PAINT_OPTIONS: MaterialLine[] = [TRIM_PAINT];
export const CEILING_PAINT_OPTIONS: MaterialLine[] = [CEILING_PAINT];
export const CABINET_PAINT_OPTIONS: MaterialLine[] = [CABINET_PAINT];

export const ALL_PAINT_OPTIONS: MaterialLine[] = [
  ...WALL_PAINT_OPTIONS,
  ...TRIM_PAINT_OPTIONS,
  ...CEILING_PAINT_OPTIONS,
  ...CABINET_PAINT_OPTIONS,
];
