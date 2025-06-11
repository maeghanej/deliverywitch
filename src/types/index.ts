export interface Character {
  id: string;
  name: string;
  sprite: string;
  location: Location;
  relationshipLevel: number;
  availableItems: Item[];
  requiredItems: Item[];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type LocationType = 'CURRENT' | 'DELIVERY' | 'QUEST' | 'CHARACTER';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  coordinates: Coordinates;
  characters: string[]; // character IDs
  sprite: string;
}

export interface Item {
  id: string;
  name: string;
  type: 'QUEST_ITEM' | 'REWARD_ITEM' | 'COLLECTIBLE';
  value: number;
  description?: string;
  sprite?: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: Avatar;
  inventory: Item[];
  stats: PlayerStats;
  relationships: Record<string, number>; // characterId -> relationship level
}

export interface Avatar {
  sprite: string;
  outfits: string[];
  currentOutfit: string;
}

export interface PlayerStats {
  gold: number;
  totalDistance: {
    daily: number;
    weekly: number;
    allTime: number;
  };
  totalDeliveries: {
    daily: number;
    weekly: number;
    allTime: number;
  };
}

export enum Season {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
  WINTER = 'WINTER',
}

export interface Delivery {
  id: string;
  item: Item;
  pickupLocation: Location;
  dropoffLocation: Location;
  distance: number;
  timeStarted?: Date;
  timeCompleted?: Date;
  reward: number;
  status: DeliveryStatus;
}

export enum DeliveryStatus {
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TransportMode {
  WALKING = 'WALKING',
  BIKING = 'BIKING',
} 