import type { Location, Item } from '../../../types';

export interface Delivery {
  id: string;
  status: DeliveryStatus;
  item: Item;
  pickupLocation: Location;
  dropoffLocation: Location;
  distance: number;
  timeStarted?: Date;
  timeCompleted?: Date;
  reward: number;
  expiresAt?: Date;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  deliveries: Delivery[];
  status: QuestStatus;
  reward: QuestReward;
  timeLimit?: number; // in minutes
  startedAt?: Date;
  completedAt?: Date;
}

export interface QuestReward {
  gold: number;
  relationshipPoints: Record<string, number>; // characterId -> points
  items?: Item[];
}

export const DeliveryStatus = {
  AVAILABLE: 'AVAILABLE',
  ACCEPTED: 'ACCEPTED',
  PICKED_UP: 'PICKED_UP',
  COMPLETED: 'COMPLETED'
} as const;

export type DeliveryStatus = typeof DeliveryStatus[keyof typeof DeliveryStatus];

export const QuestStatus = {
  AVAILABLE: 'AVAILABLE',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const;

export type QuestStatus = typeof QuestStatus[keyof typeof QuestStatus];

export interface DeliveryProgress {
  currentDistance: number;
  totalDistance: number;
  estimatedTimeRemaining?: number;
  startTime: Date;
  lastUpdateTime: Date;
  averageSpeed: number;
} 