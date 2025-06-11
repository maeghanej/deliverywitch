export interface Villager {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];  // [longitude, latitude]
  deliveryMessage: string;        // What they say when receiving delivery
  thankYouMessage: string;        // What they say after delivery
  imageUrl?: string;
}

export interface DeliveryItem {
  id: string;
  name: string;
  description: string;
  originLocationId: string;      // Where to pick up the item
  specialEffect?: string;        // Any magical effects
  timeLimit?: number;           // Time limit in minutes (optional)
}

export interface DeliveryRequest {
  id: string;
  villager: Villager;
  item: DeliveryItem;
  reward: number;               // Base reward points
  active: boolean;              // Whether request is currently active
  accepted: boolean;            // Whether player has accepted the request
  completed: boolean;           // Whether delivery is completed
  expiresAt?: Date;            // When the request expires (optional)
  createdAt: Date;             // When the request was created
}

// Villager name generator components for creating random villagers
export const VILLAGER_NAME_PARTS = {
  firstNames: [
    'Maple', 'Willow', 'Rowan', 'Sage', 'Jasper', 'Hazel', 'Ivy', 'Juniper',
    'Ash', 'Cedar', 'Elm', 'Fern', 'Holly', 'Iris', 'Laurel', 'Moss'
  ],
  lastNames: [
    'Moonwhisper', 'Stardust', 'Nightbreeze', 'Sunweaver', 'Mistwalker',
    'Spellwind', 'Dewkeeper', 'Cloudweaver', 'Lightbringer', 'Shadowdancer'
  ]
} as const;

// Possible delivery items for each location
export const LOCATION_DELIVERY_ITEMS: { [locationId: string]: DeliveryItem[] } = {
  'cafe-mocha': [
    {
      id: 'levitating-latte',
      name: 'Levitating Latte',
      description: 'A coffee that makes you feel light as air',
      originLocationId: 'cafe-mocha',
      specialEffect: 'Temporary floating sensation',
      timeLimit: 15 // Must deliver within 15 minutes
    },
    {
      id: 'prophecy-pastry',
      name: 'Prophecy Pastry',
      description: 'A pastry that gives glimpses of the near future',
      originLocationId: 'cafe-mocha',
      specialEffect: 'Brief future visions'
    }
  ],
  'mystic-market': [
    {
      id: 'enchanted-herbs',
      name: 'Enchanted Herb Bundle',
      description: 'Fresh magical herbs with potent properties',
      originLocationId: 'mystic-market',
      timeLimit: 30
    },
    {
      id: 'crystal-essence',
      name: 'Crystal Essence',
      description: 'Distilled magical energy in crystal form',
      originLocationId: 'mystic-market'
    }
  ],
  'spellbound-bakery': [
    {
      id: 'witch-cookies',
      name: 'Witch Cookies',
      description: 'Cookies that grant minor magical abilities',
      originLocationId: 'spellbound-bakery',
      specialEffect: 'Random magical effect'
    },
    {
      id: 'enchanted-bread',
      name: 'Enchanted Bread',
      description: 'Bread that stays warm and fresh for days',
      originLocationId: 'spellbound-bakery'
    }
  ]
}; 