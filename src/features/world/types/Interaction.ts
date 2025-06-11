export type InteractionType = 
  | 'chat'           // Basic conversation
  | 'delivery'       // Completing a delivery for them
  | 'gift'          // Giving them a liked item
  | 'help'          // Helping with their work
  | 'special';      // Special events/requests

export interface InteractionReward {
  relationshipPoints: number;
  description: string;
  bonusPoints?: {
    amount: number;
    reason: string;
  };
}

export interface Interaction {
  type: InteractionType;
  characterId: string;
  text: string;
  requirements?: {
    minRelationshipTier?: number;
    timeOfDay?: string[];      // e.g., ['morning', 'afternoon']
    locationId?: string;
    itemRequired?: string;
    questRequired?: string;
  };
  choices?: {
    text: string;
    reward: InteractionReward;
    unlockId?: string;         // ID of location/quest/item to unlock
  }[];
}

// Base relationship points for each interaction type
export const BASE_INTERACTION_POINTS = {
  chat: 2,
  delivery: 5,
  gift: 3,
  help: 8,
  special: 10
} as const;

// Relationship tiers and their benefits
export const RELATIONSHIP_TIERS = [
  { tier: 0, name: 'Stranger', requiredPoints: 0 },
  { tier: 1, name: 'Acquaintance', requiredPoints: 20 },
  { tier: 2, name: 'Friend', requiredPoints: 40 },
  { tier: 3, name: 'Good Friend', requiredPoints: 60 },
  { tier: 4, name: 'Close Friend', requiredPoints: 80 },
  { tier: 5, name: 'Best Friend', requiredPoints: 100 }
] as const;

// Time periods for interactions
export const TIME_PERIODS = {
  morning: { start: '06:00', end: '11:59' },
  afternoon: { start: '12:00', end: '16:59' },
  evening: { start: '17:00', end: '21:59' },
  night: { start: '22:00', end: '05:59' }
} as const; 