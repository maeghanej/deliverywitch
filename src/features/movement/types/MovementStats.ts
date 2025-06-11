import type { TransportMode } from '../../transport/stores/transportStore';

export interface MovementStats {
  session: SessionStats;
  daily: DailyStats;
  allTime: AllTimeStats;
}

export interface SessionStats {
  startTime: number;
  endTime: number | null;
  totalDistance: number;      // meters
  activeTime: number;         // seconds
  pauseTime: number;         // seconds
  averageSpeed: number;      // meters/second
  topSpeed: number;          // meters/second
  currentSpeed: number;      // meters/second
  speedHistory: SpeedRecord[];
  transportMode: 'WALKING' | 'BIKING';
}

export interface DailyStats {
  date: string;              // YYYY-MM-DD
  totalDistance: number;     // meters
  activeTime: number;        // seconds
  deliveriesCompleted: number;
  byTransportMode: {
    WALKING: { distance: number; activeTime: number };
    BIKING: { distance: number; activeTime: number };
  };
}

export interface AllTimeStats {
  totalDistance: number;     // meters
  totalActiveTime: number;   // seconds
  totalDeliveries: number;
  byTransportMode: {
    WALKING: { distance: number; activeTime: number; deliveries: number };
    BIKING: { distance: number; activeTime: number; deliveries: number };
  };
  achievements: Achievement[];
}

export interface SpeedRecord {
  timestamp: number;
  speed: number;            // meters/second
  latitude: number;
  longitude: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;       // timestamp
  type: AchievementType;
}

export enum AchievementType {
  DISTANCE = 'DISTANCE',           // Total distance milestones
  SPEED = 'SPEED',                // Speed records
  DELIVERIES = 'DELIVERIES',      // Delivery count milestones
  STREAK = 'STREAK',              // Daily activity streaks
  SPECIAL = 'SPECIAL'             // Special achievements
} 