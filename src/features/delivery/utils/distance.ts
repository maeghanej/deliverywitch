export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = from.latitude * Math.PI / 180;
  const φ2 = to.latitude * Math.PI / 180;
  const Δφ = (to.latitude - from.latitude) * Math.PI / 180;
  const Δλ = (to.longitude - from.longitude) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

/**
 * Formats a distance in meters to a human-readable string
 * @param meters Distance in meters
 * @returns Formatted distance string (e.g., "1.2 km" or "800 m")
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

export function estimateWalkingTime(meters: number): number {
  const walkingSpeedMPS = 1.4; // Average walking speed in meters per second
  return meters / walkingSpeedMPS; // Time in seconds
}

export function estimateBikingTime(meters: number): number {
  const bikingSpeedMPS = 4.17; // Average biking speed (15 km/h) in meters per second
  return meters / bikingSpeedMPS; // Time in seconds
}

/**
 * Formats a duration in seconds to a human-readable string
 * @param seconds Duration in seconds
 * @returns Formatted duration string (e.g., "1h 30m" or "45m")
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
} 