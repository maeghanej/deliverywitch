import type { Coordinates } from '../../delivery/utils/distance';

export interface LocationPoint {
  id: string;
  type: LocationType;
  coordinates: Coordinates;
  radius: number;           // Interaction radius in meters
  name: string;
  description?: string;
  icon?: string;           // Icon identifier or emoji
  isActive: boolean;       // Whether this point is currently interactive
  requirements?: LocationRequirements;
}

export enum LocationType {
  PICKUP = 'PICKUP',           // Delivery pickup point
  DROPOFF = 'DROPOFF',         // Delivery dropoff point
  CHARACTER = 'CHARACTER',      // NPC character location
  DISCOVERY = 'DISCOVERY',      // Points of interest/discoveries
  SHOP = 'SHOP',               // Shop/vendor location
  QUEST = 'QUEST'              // Quest-related location
}

export interface LocationRequirements {
  questId?: string;            // Required active quest
  level?: number;              // Minimum level required
  timeRange?: TimeRange;       // Time-based availability
  weatherConditions?: string[];// Required weather conditions
  transportModes?: string[];   // Allowed transport modes
}

export interface TimeRange {
  start: number;               // Hour of day (0-23)
  end: number;                 // Hour of day (0-23)
}

export interface ProximityEvent {
  locationId: string;
  type: ProximityEventType;
  timestamp: number;
  distance: number;           // Distance to location in meters
  coordinates: Coordinates;   // Player coordinates at event time
}

export enum ProximityEventType {
  ENTER = 'ENTER',           // Entered proximity radius
  EXIT = 'EXIT',             // Left proximity radius
  INTERACT = 'INTERACT'      // Actively interacted with location
}

export interface LocationInteraction {
  locationId: string;
  type: LocationType;
  timestamp: number;
  result: InteractionResult;
  data?: any;               // Additional interaction data
}

export interface InteractionResult {
  success: boolean;
  message: string;
  rewards?: Reward[];
  nextLocationId?: string;  // For chained locations (e.g., pickup → dropoff)
}

export interface Reward {
  type: RewardType;
  amount: number;
  description: string;
}

export enum RewardType {
  EXPERIENCE = 'EXPERIENCE',
  COINS = 'COINS',
  ITEM = 'ITEM',
  REPUTATION = 'REPUTATION'
} 