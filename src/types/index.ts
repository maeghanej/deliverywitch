export interface Character {
  id: string;
  name: string;
  sprite: string;
  location: Location;
  relationshipLevel: number;
  availableItems: Item[];
  requiredItems: Item[];
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  characters: Character[];
  sprite: string;
}

export enum LocationType {
  SHOP = 'SHOP',
  HOME = 'HOME',
  MARKET = 'MARKET',
  CAFE = 'CAFE',
  LIBRARY = 'LIBRARY',
  CURRENT = 'CURRENT',
}

export interface Item {
  id: string;
  name: string;
  description: string;
  value: number;
  sprite: string;
  season?: Season;
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