import type { TransportMode } from '../../transport/stores/transportStore';

// Speed thresholds in meters per second
export const SPEED_THRESHOLDS = {
  WALKING: {
    MIN: 0.3,     // ~1.1 km/h (very slow walk)
    MAX: 3.0,     // ~11 km/h (fast jog)
    SUSPICIOUS: 4.2 // ~15 km/h (running)
  },
  BIKING: {
    MIN: 1.4,     // ~5 km/h (very casual)
    MAX: 11.1,    // ~40 km/h (fast but reasonable)
    SUSPICIOUS: 13.9 // ~50 km/h (very fast but possible)
  }
} as const;

// Time window for pattern detection (in milliseconds)
export const PATTERN_DETECTION_WINDOW = 60000; // 1 minute

export interface MovementDataPoint {
  timestamp: number;
  latitude: number;
  longitude: number;
  speed: number | null;
  accuracy: number | null;
}

export interface MovementValidationResult {
  isValid: boolean;
  detectedMode: TransportMode | null;
  issues: MovementIssue[];
}

export interface MovementIssue {
  type: MovementIssueType;
  message: string;
  severity: 'WARNING' | 'ERROR';
}

export enum MovementIssueType {
  SPEED_TOO_LOW = 'SPEED_TOO_LOW',
  SPEED_TOO_HIGH = 'SPEED_TOO_HIGH',
  SUSPICIOUS_PATTERN = 'SUSPICIOUS_PATTERN',
  MODE_MISMATCH = 'MODE_MISMATCH',
  TELEPORT = 'TELEPORT',
  GPS_ACCURACY = 'GPS_ACCURACY'
} 