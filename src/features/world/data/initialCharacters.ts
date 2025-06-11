import type { Character } from '../types/Character';

export const initialCharacters: { [id: string]: Character } = {
  'luna': {
    id: 'luna',
    name: 'Luna Mooncaster',
    role: 'barista',
    locationId: 'cafe-mocha',
    description: 'A cheerful witch who brews the most enchanting coffee in town.',
    personality: ['Cheerful', 'Creative', 'Morning Person'],
    likes: ['Coffee Art', 'Moon Phases', 'Jazz Music'],
    dislikes: ['Rushed Orders', 'Bitter Ingredients', 'Rainy Days'],
    schedule: {
      '0': { start: '08:00', end: '16:00', locationId: 'cafe-mocha' },
      '1': { start: '07:00', end: '15:00', locationId: 'cafe-mocha' },
      '2': { start: '07:00', end: '15:00', locationId: 'cafe-mocha' },
      '3': { start: '07:00', end: '15:00', locationId: 'cafe-mocha' },
      '4': { start: '07:00', end: '15:00', locationId: 'cafe-mocha' },
      '5': { start: '15:00', end: '22:00', locationId: 'cafe-mocha' }
    },
    unlocked: true,
    relationshipLevel: 0,
    relationshipTier: 0
  },

  'sage': {
    id: 'sage',
    name: 'Sage Herbweaver',
    role: 'merchant',
    locationId: 'mystic-market',
    description: 'A wise merchant who knows everything about magical herbs and ingredients.',
    personality: ['Wise', 'Patient', 'Nature-loving'],
    likes: ['Fresh Herbs', 'Traditional Recipes', 'Early Mornings'],
    dislikes: ['Waste', 'Synthetic Materials', 'Rush Hours'],
    schedule: {
      '0': { start: '06:00', end: '14:00', locationId: 'mystic-market' },
      '3': { start: '06:00', end: '14:00', locationId: 'mystic-market' },
      '6': { start: '06:00', end: '16:00', locationId: 'mystic-market' }
    },
    unlocked: false,
    relationshipLevel: 0,
    relationshipTier: 0
  },

  'hazel': {
    id: 'hazel',
    name: 'Hazel Sweetspell',
    role: 'baker',
    locationId: 'spellbound-bakery',
    description: 'A talented witch baker who infuses her creations with magical effects.',
    personality: ['Warm', 'Perfectionist', 'Nurturing'],
    likes: ['Baking', 'Sharing Recipes', 'Sweet Scents'],
    dislikes: ['Burnt Food', 'Shortcuts', 'Cold Kitchens'],
    schedule: {
      '1': { start: '06:00', end: '14:00', locationId: 'spellbound-bakery' },
      '2': { start: '06:00', end: '14:00', locationId: 'spellbound-bakery' },
      '3': { start: '06:00', end: '14:00', locationId: 'spellbound-bakery' },
      '4': { start: '06:00', end: '14:00', locationId: 'spellbound-bakery' },
      '5': { start: '06:00', end: '14:00', locationId: 'spellbound-bakery' }
    },
    unlocked: false,
    relationshipLevel: 0,
    relationshipTier: 0
  },

  'minerva': {
    id: 'minerva',
    name: 'Minerva Scrollkeeper',
    role: 'librarian',
    locationId: 'grimoire-library',
    description: 'A knowledgeable librarian with a passion for magical history and lore.',
    personality: ['Scholarly', 'Organized', 'Quiet'],
    likes: ['Ancient Texts', 'Tea', 'Quiet Study'],
    dislikes: ['Loud Noises', 'Damaged Books', 'Disorganization'],
    schedule: {
      '1': { start: '09:00', end: '17:00', locationId: 'grimoire-library' },
      '2': { start: '13:00', end: '21:00', locationId: 'grimoire-library' },
      '3': { start: '09:00', end: '17:00', locationId: 'grimoire-library' },
      '4': { start: '13:00', end: '21:00', locationId: 'grimoire-library' },
      '5': { start: '09:00', end: '17:00', locationId: 'grimoire-library' }
    },
    unlocked: false,
    relationshipLevel: 0,
    relationshipTier: 0
  }
}; 