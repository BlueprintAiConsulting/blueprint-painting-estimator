import { RoomTemplate } from '../types';

export const ROOM_TEMPLATES: RoomTemplate[] = [
  {
    type: 'kitchen',
    label: 'Kitchen',
    icon: 'ChefHat',
    defaultZones: ['walls', 'cabinets', 'trim', 'ceiling'],
    description: 'Kitchen walls, cabinets, trim, and ceiling paint.',
  },
  {
    type: 'bathroom',
    label: 'Bathroom',
    icon: 'Bath',
    defaultZones: ['walls', 'cabinets', 'trim', 'ceiling'],
    description: 'Bathroom walls, vanity cabinets, trim, and ceiling paint.',
  },
  {
    type: 'living-room',
    label: 'Living Room',
    icon: 'Sofa',
    defaultZones: ['walls', 'accent-wall', 'trim', 'ceiling'],
    description: 'Living room walls, accent wall, trim, and ceiling.',
  },
  {
    type: 'bedroom',
    label: 'Bedroom',
    icon: 'Bed',
    defaultZones: ['walls', 'accent-wall', 'trim', 'ceiling'],
    description: 'Bedroom walls, accent wall, trim, and ceiling.',
  },
];
