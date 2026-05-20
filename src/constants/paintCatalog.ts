import { MaterialLine } from '../types';

/**
 * Sherwin-Williams Interior Paint Catalog
 * Organized by product line — Duration (Premium) & Emerald (Ultra-Premium)
 * Official SW color names and codes.
 */

// ─── DURATION — Premium Interior Paint ───
export const DURATION_NEUTRALS: MaterialLine = {
  id: 'sw-duration-neutrals',
  brand: 'Sherwin-Williams',
  line: 'Duration — Neutrals',
  material: 'Duration Interior Acrylic Latex',
  category: 'walls',
  tier: 'premium',
  profileLabel: 'Eggshell / Satin Finish',
  description: 'SW Duration — advanced acrylic, one-coat coverage, exceptional durability.',
  colors: [
    { id: 'dn-agreeable-gray',   name: 'Agreeable Gray',   hex: '#D0C8B8', hue: 'Warm greige with beige undertone',    swCode: 'SW 7029' },
    { id: 'dn-accessible-beige', name: 'Accessible Beige',  hex: '#D2C6AD', hue: 'Soft warm beige with gray undertone', swCode: 'SW 7036' },
    { id: 'dn-repose-gray',      name: 'Repose Gray',      hex: '#C2BDB5', hue: 'True balanced warm gray',             swCode: 'SW 7015' },
    { id: 'dn-pale-oak',         name: 'Pale Oak',         hex: '#D6CCBB', hue: 'Soft putty with warm pink undertone',  swCode: 'SW 7625' },
    { id: 'dn-revere-pewter',    name: 'Revere Pewter',    hex: '#C5BAA5', hue: 'Warm pewter gray-beige',              swCode: 'SW 0243' },
    { id: 'dn-worldly-gray',     name: 'Worldly Gray',     hex: '#C2BAA8', hue: 'Medium warm gray with green undertone',swCode: 'SW 7043' },
    { id: 'dn-balanced-beige',   name: 'Balanced Beige',   hex: '#C4B59C', hue: 'Rich warm beige with golden cast',    swCode: 'SW 7037' },
    { id: 'dn-anew-gray',        name: 'Anew Gray',        hex: '#BDB5A8', hue: 'Medium warm taupe gray',              swCode: 'SW 7030' },
    { id: 'dn-mindful-gray',     name: 'Mindful Gray',     hex: '#B5AFA5', hue: 'True greige — perfectly balanced',     swCode: 'SW 7016' },
    { id: 'dn-mega-greige',      name: 'Mega Greige',      hex: '#B0A795', hue: 'Deep warm greige',                    swCode: 'SW 7031' },
    { id: 'dn-alabaster',        name: 'Alabaster',        hex: '#EDEADE', hue: 'Warm soft white with creamy cast',     swCode: 'SW 7008' },
    { id: 'dn-snowbound',        name: 'Snowbound',        hex: '#EDE8DF', hue: 'Crisp warm white',                    swCode: 'SW 7004' },
  ]
};

export const DURATION_COOL: MaterialLine = {
  id: 'sw-duration-cool',
  brand: 'Sherwin-Williams',
  line: 'Duration — Cool Tones',
  material: 'Duration Interior Acrylic Latex',
  category: 'walls',
  tier: 'premium',
  profileLabel: 'Eggshell / Satin Finish',
  description: 'Cool blue-gray and sage-green tones for modern, spa-inspired interiors.',
  colors: [
    { id: 'dc-sea-salt',         name: 'Sea Salt',         hex: '#C6D0C4', hue: 'Soft green-gray coastal',            swCode: 'SW 6204' },
    { id: 'dc-silver-strand',    name: 'Silver Strand',    hex: '#C1C5BD', hue: 'Cool silver-green-gray',             swCode: 'SW 7057' },
    { id: 'dc-rainwashed',       name: 'Rainwashed',       hex: '#C4D4CA', hue: 'Light blue-green spa',               swCode: 'SW 6211' },
    { id: 'dc-comfort-gray',     name: 'Comfort Gray',     hex: '#B8BEB1', hue: 'Muted sage green-gray',              swCode: 'SW 6205' },
    { id: 'dc-oyster-bay',       name: 'Oyster Bay',       hex: '#B4C6C4', hue: 'Ocean blue-green-gray',              swCode: 'SW 6206' },
    { id: 'dc-network-gray',     name: 'Network Gray',     hex: '#A3A59E', hue: 'Cool balanced mid-gray',             swCode: 'SW 7073' },
    { id: 'dc-reflection',       name: 'Reflection',       hex: '#CDD4D0', hue: 'Very light cool gray-blue',          swCode: 'SW 7661' },
    { id: 'dc-mountain-air',     name: 'Mountain Air',     hex: '#C8CCBE', hue: 'Cool sage gray-green',               swCode: 'SW 6224' },
    { id: 'dc-misty',            name: 'Misty',            hex: '#C7CCC8', hue: 'Soft cool gray with blue',            swCode: 'SW 6232' },
    { id: 'dc-ellie-gray',       name: 'Ellie Gray',       hex: '#B8BDB5', hue: 'Light-medium cool green-gray',       swCode: 'SW 7650' },
  ]
};

export const DURATION_BOLD: MaterialLine = {
  id: 'sw-duration-bold',
  brand: 'Sherwin-Williams',
  line: 'Duration — Bold & Deep',
  material: 'Duration Interior Acrylic Latex',
  category: 'walls',
  tier: 'premium',
  profileLabel: 'Eggshell / Satin Finish',
  description: 'Deep dramatic accent colors — perfect for feature walls and statement rooms.',
  colors: [
    { id: 'db-naval',            name: 'Naval',            hex: '#2F3D4F', hue: 'Deep classic navy blue',              swCode: 'SW 6244' },
    { id: 'db-peppercorn',       name: 'Peppercorn',       hex: '#5D5C58', hue: 'Warm dark charcoal-brown',            swCode: 'SW 7674' },
    { id: 'db-urbane-bronze',    name: 'Urbane Bronze',    hex: '#5E5549', hue: 'Warm dark bronze-brown',              swCode: 'SW 7048' },
    { id: 'db-evergreen-fog',    name: 'Evergreen Fog',    hex: '#8E9585', hue: 'Moody sage green-gray',               swCode: 'SW 9130' },
    { id: 'db-pewter-green',     name: 'Pewter Green',     hex: '#707C72', hue: 'Dark muted green-gray',               swCode: 'SW 6208' },
    { id: 'db-cyberspace',       name: 'Cyberspace',       hex: '#3C4148', hue: 'Near-black blue-charcoal',            swCode: 'SW 7076' },
    { id: 'db-cascades',         name: 'Cascades',         hex: '#4B6358', hue: 'Deep forest green',                   swCode: 'SW 7623' },
    { id: 'db-iron-ore',         name: 'Iron Ore',         hex: '#4A4845', hue: 'Very dark warm charcoal',             swCode: 'SW 7069' },
    { id: 'db-tricorn-black',    name: 'Tricorn Black',    hex: '#2E2E2E', hue: 'True deep matte black',               swCode: 'SW 6258' },
    { id: 'db-dark-night',       name: 'Dark Night',       hex: '#3B4758', hue: 'Deep navy with teal undertone',       swCode: 'SW 6237' },
  ]
};

// ─── EMERALD — Ultra-Premium Interior Paint ───
export const EMERALD_NEUTRALS: MaterialLine = {
  id: 'sw-emerald-neutrals',
  brand: 'Sherwin-Williams',
  line: 'Emerald — Curated Neutrals',
  material: 'Emerald Interior Acrylic Latex',
  category: 'walls',
  tier: 'ultra-premium',
  profileLabel: 'Matte / Satin Finish',
  description: 'SW Emerald — zero VOC, washable matte, ultimate color richness and coverage.',
  colors: [
    { id: 'en-pure-white',       name: 'Pure White',       hex: '#EDEBE2', hue: 'Warm crisp white',                    swCode: 'SW 7005' },
    { id: 'en-extra-white',      name: 'Extra White',      hex: '#F0EDE7', hue: 'Clean true white',                    swCode: 'SW 7006' },
    { id: 'en-greek-villa',      name: 'Greek Villa',      hex: '#EFE8D6', hue: 'Warm creamy ivory',                   swCode: 'SW 7551' },
    { id: 'en-shoji-white',      name: 'Shoji White',      hex: '#E5DBC9', hue: 'Warm beige-cream with depth',         swCode: 'SW 7042' },
    { id: 'en-drift-of-mist',    name: 'Drift of Mist',    hex: '#E0DDD2', hue: 'Cool light gray-green',               swCode: 'SW 9166' },
    { id: 'en-dover-white',      name: 'Dover White',      hex: '#E8DFC9', hue: 'Classic warm cream',                  swCode: 'SW 6385' },
    { id: 'en-popular-gray',     name: 'Popular Gray',     hex: '#C5BCAB', hue: 'Light warm gray-beige',               swCode: 'SW 6071' },
    { id: 'en-tony-taupe',       name: 'Tony Taupe',       hex: '#A59B89', hue: 'Rich warm taupe',                     swCode: 'SW 7038' },
    { id: 'en-amazing-gray',     name: 'Amazing Gray',     hex: '#C0B9A8', hue: 'Warm balanced gray',                  swCode: 'SW 7044' },
    { id: 'en-colonnade-gray',   name: 'Colonnade Gray',   hex: '#BBB3A1', hue: 'Warm greige with golden undertone',   swCode: 'SW 7641' },
  ]
};

export const EMERALD_SIGNATURE: MaterialLine = {
  id: 'sw-emerald-signature',
  brand: 'Sherwin-Williams',
  line: 'Emerald — Signature Colors',
  material: 'Emerald Interior Acrylic Latex',
  category: 'walls',
  tier: 'ultra-premium',
  profileLabel: 'Matte / Satin Finish',
  description: 'Designer-curated statement colors in SW\'s finest paint formula.',
  colors: [
    { id: 'es-inkwell',          name: 'Inkwell',          hex: '#31353D', hue: 'Deep inky blue-black',                 swCode: 'SW 6992' },
    { id: 'es-jasper',           name: 'Jasper',           hex: '#8B6545', hue: 'Rich warm terracotta brown',           swCode: 'SW 6216' },
    { id: 'es-commodore',        name: 'Commodore',        hex: '#39536B', hue: 'Deep marine navy-blue',               swCode: 'SW 6524' },
    { id: 'es-basil',            name: 'Basil',            hex: '#556B52', hue: 'Earthy green herb',                    swCode: 'SW 6194' },
    { id: 'es-rojo-dust',        name: 'Rojo Dust',        hex: '#8F5A47', hue: 'Warm burnt sienna-red',               swCode: 'SW 9006' },
    { id: 'es-studio-blue-green',name: 'Studio Blue Green',hex: '#4D7070', hue: 'Deep teal blue-green',                swCode: 'SW 0047' },
    { id: 'es-black-magic',      name: 'Black Magic',      hex: '#2F2F31', hue: 'Ultra-deep warm black',               swCode: 'SW 6991' },
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
  DURATION_NEUTRALS,
  DURATION_COOL,
  DURATION_BOLD,
  EMERALD_NEUTRALS,
  EMERALD_SIGNATURE,
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
