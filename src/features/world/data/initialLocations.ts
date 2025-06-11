import type { Location } from '../types/Location';

export const initialLocations: { [id: string]: Location } = {
  'cafe-mocha': {
    id: 'cafe-mocha',
    name: 'Café Mocha',
    type: 'cafe',
    description: 'A cozy café known for its magical brews and enchanted pastries.',
    coordinates: [-122.4194, 37.7749], // Example coordinates
    openingHours: {
      '0': { open: '08:00', close: '18:00' }, // Sunday
      '1': { open: '07:00', close: '20:00' }, // Monday
      '2': { open: '07:00', close: '20:00' },
      '3': { open: '07:00', close: '20:00' },
      '4': { open: '07:00', close: '20:00' },
      '5': { open: '07:00', close: '22:00' },
      '6': { open: '08:00', close: '22:00' }  // Saturday
    },
    specialties: ['Magic Coffee', 'Levitating Latte', 'Prophecy Pastries'],
    unlocked: true // First location is unlocked by default
  },
  
  'mystic-market': {
    id: 'mystic-market',
    name: 'Mystic Market',
    type: 'market',
    description: 'An open-air market where magical ingredients and curiosities are traded.',
    coordinates: [-122.4184, 37.7739],
    openingHours: {
      '0': { open: '06:00', close: '14:00' }, // Sunday market
      '3': { open: '06:00', close: '14:00' }, // Wednesday market
      '6': { open: '06:00', close: '16:00' }  // Saturday market
    },
    specialties: ['Fresh Ingredients', 'Magical Herbs', 'Potion Components'],
    unlocked: false
  },

  'spellbound-bakery': {
    id: 'spellbound-bakery',
    name: 'Spellbound Bakery',
    type: 'bakery',
    description: 'A charming bakery where each treat is made with a touch of magic.',
    coordinates: [-122.4174, 37.7759],
    openingHours: {
      '0': { open: '07:00', close: '17:00' },
      '1': { open: '06:00', close: '18:00' },
      '2': { open: '06:00', close: '18:00' },
      '3': { open: '06:00', close: '18:00' },
      '4': { open: '06:00', close: '18:00' },
      '5': { open: '06:00', close: '18:00' },
      '6': { open: '07:00', close: '17:00' }
    },
    specialties: ['Enchanted Bread', 'Witch Cookies', 'Magic Muffins'],
    unlocked: false
  },

  'grimoire-library': {
    id: 'grimoire-library',
    name: 'Grimoire Library',
    type: 'library',
    description: 'A vast collection of magical tomes and scrolls, perfect for studying spells.',
    coordinates: [-122.4164, 37.7769],
    openingHours: {
      '1': { open: '09:00', close: '21:00' },
      '2': { open: '09:00', close: '21:00' },
      '3': { open: '09:00', close: '21:00' },
      '4': { open: '09:00', close: '21:00' },
      '5': { open: '09:00', close: '18:00' },
      '6': { open: '10:00', close: '17:00' }
    },
    unlocked: false
  }
}; 