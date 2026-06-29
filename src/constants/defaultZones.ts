import { RoomZone, RoomType } from '../types';
import { CURATED_WALL_COLORS, TRIM_PAINT, CEILING_PAINT, CABINET_PAINT } from './paintCatalog';

/**
 * Default paint zone configurations per room type.
 * Paint-only: Walls, Accent Wall, Trim, Ceiling, Cabinets
 */

export const DEFAULT_KITCHEN_ZONES: RoomZone[] = [
  { id: 'kz-walls',   name: 'Wall Color',        category: 'walls',       enabled: true,  selectedLine: CURATED_WALL_COLORS, selectedColor: CURATED_WALL_COLORS.colors[0] },
  { id: 'kz-cabinets',name: 'Cabinets',          category: 'cabinets',    enabled: true,  selectedLine: CABINET_PAINT,     selectedColor: CABINET_PAINT.colors[0], maskTarget: 'kitchen cabinets, drawers, cabinet doors' },
  { id: 'kz-trim',    name: 'Trim & Baseboards',  category: 'trim',        enabled: true,  selectedLine: TRIM_PAINT,        selectedColor: TRIM_PAINT.colors[0] },
  { id: 'kz-ceiling', name: 'Ceiling',            category: 'ceiling',     enabled: false, selectedLine: CEILING_PAINT,     selectedColor: CEILING_PAINT.colors[0] },
];

export const DEFAULT_BATHROOM_ZONES: RoomZone[] = [
  { id: 'bz-walls',   name: 'Wall Color',        category: 'walls',       enabled: true,  selectedLine: CURATED_WALL_COLORS,     selectedColor: CURATED_WALL_COLORS.colors[5] },
  { id: 'bz-cabinets',name: 'Vanity Cabinet',    category: 'cabinets',    enabled: true,  selectedLine: CABINET_PAINT,     selectedColor: CABINET_PAINT.colors[0], maskTarget: 'bathroom vanity cabinet, vanity drawers, bathroom cabinet doors' },
  { id: 'bz-trim',    name: 'Trim & Baseboards',  category: 'trim',        enabled: true,  selectedLine: TRIM_PAINT,        selectedColor: TRIM_PAINT.colors[0] },
  { id: 'bz-ceiling', name: 'Ceiling',            category: 'ceiling',     enabled: false, selectedLine: CEILING_PAINT,     selectedColor: CEILING_PAINT.colors[0] },
];

export const DEFAULT_LIVINGROOM_ZONES: RoomZone[] = [
  { id: 'lz-walls',   name: 'Wall Color',        category: 'walls',       enabled: true,  selectedLine: CURATED_WALL_COLORS, selectedColor: CURATED_WALL_COLORS.colors[4] },
  { id: 'lz-accent',  name: 'Accent Wall',        category: 'accent-wall', enabled: false, selectedLine: CURATED_WALL_COLORS,     selectedColor: CURATED_WALL_COLORS.colors[8] },
  { id: 'lz-trim',    name: 'Trim & Baseboards',  category: 'trim',        enabled: true,  selectedLine: TRIM_PAINT,        selectedColor: TRIM_PAINT.colors[0] },
  { id: 'lz-ceiling', name: 'Ceiling',            category: 'ceiling',     enabled: false, selectedLine: CEILING_PAINT,     selectedColor: CEILING_PAINT.colors[0] },
];

export const DEFAULT_BEDROOM_ZONES: RoomZone[] = [
  { id: 'br-walls',   name: 'Wall Color',        category: 'walls',       enabled: true,  selectedLine: CURATED_WALL_COLORS, selectedColor: CURATED_WALL_COLORS.colors[2] },
  { id: 'br-accent',  name: 'Accent Wall',        category: 'accent-wall', enabled: false, selectedLine: CURATED_WALL_COLORS,     selectedColor: CURATED_WALL_COLORS.colors[11] },
  { id: 'br-trim',    name: 'Trim & Baseboards',  category: 'trim',        enabled: true,  selectedLine: TRIM_PAINT,        selectedColor: TRIM_PAINT.colors[0] },
  { id: 'br-ceiling', name: 'Ceiling',            category: 'ceiling',     enabled: false, selectedLine: CEILING_PAINT,     selectedColor: CEILING_PAINT.colors[0] },
];

export function getDefaultZonesForRoom(roomType: RoomType): RoomZone[] {
  switch (roomType) {
    case 'kitchen':     return DEFAULT_KITCHEN_ZONES.map(z => ({ ...z }));
    case 'bathroom':    return DEFAULT_BATHROOM_ZONES.map(z => ({ ...z }));
    case 'living-room': return DEFAULT_LIVINGROOM_ZONES.map(z => ({ ...z }));
    case 'bedroom':     return DEFAULT_BEDROOM_ZONES.map(z => ({ ...z }));
    default:            return DEFAULT_LIVINGROOM_ZONES.map(z => ({ ...z }));
  }
}
