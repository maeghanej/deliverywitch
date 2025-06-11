import { SPEED_THRESHOLDS, PATTERN_DETECTION_WINDOW } from '../types/MovementValidation';
import type { 
  MovementDataPoint, 
  MovementValidationResult, 
  MovementIssue 
} from '../types/MovementValidation';
import { MovementIssueType } from '../types/MovementValidation';
import type { TransportMode } from '../../transport/stores/transportStore';
import { lineString, point, distance, length, bearing } from '@turf/turf';
import type { Feature, Point, LineString } from '@turf/turf';

const MAX_TELEPORT_DISTANCE = 200; // meters - more lenient teleport detection
const MIN_GPS_ACCURACY = 50; // meters - more forgiving GPS accuracy requirement

export function validateMovement(
  currentPoint: MovementDataPoint,
  recentPoints: MovementDataPoint[],
  declaredMode: TransportMode
): MovementValidationResult {
  const issues: MovementIssue[] = [];
  
  // Validate GPS accuracy
  if (currentPoint.accuracy && currentPoint.accuracy > MIN_GPS_ACCURACY) {
    issues.push({
      type: MovementIssueType.GPS_ACCURACY,
      message: `Low GPS accuracy: ${currentPoint.accuracy.toFixed(1)}m`,
      severity: 'WARNING'
    });
  }

  // Get the most recent point for comparison
  const previousPoint = recentPoints[recentPoints.length - 1];
  
  if (previousPoint) {
    // Check for teleporting (unrealistic instant movement)
    const dist = calculateDistance(previousPoint, currentPoint);
    const timeDiff = currentPoint.timestamp - previousPoint.timestamp;
    const speed = dist / (timeDiff / 1000); // meters per second

    if (dist > MAX_TELEPORT_DISTANCE && timeDiff < 1000) {
      issues.push({
        type: MovementIssueType.TELEPORT,
        message: `Unrealistic movement detected: ${dist.toFixed(1)}m in ${(timeDiff/1000).toFixed(1)}s`,
        severity: 'ERROR'
      });
    }

    // Validate speed against declared mode
    const thresholds = SPEED_THRESHOLDS[declaredMode];
    if (speed < thresholds.MIN) {
      issues.push({
        type: MovementIssueType.SPEED_TOO_LOW,
        message: `Moving too slowly for ${declaredMode}: ${(speed * 3.6).toFixed(1)} km/h`,
        severity: 'WARNING'
      });
    } else if (speed > thresholds.SUSPICIOUS) {
      issues.push({
        type: MovementIssueType.SPEED_TOO_HIGH,
        message: `Moving too fast for ${declaredMode}: ${(speed * 3.6).toFixed(1)} km/h`,
        severity: 'ERROR'
      });
    }
  }

  // Detect movement patterns using recent history
  const detectedMode = detectTransportMode(recentPoints);
  if (detectedMode && detectedMode !== declaredMode) {
    issues.push({
      type: MovementIssueType.MODE_MISMATCH,
      message: `Movement pattern suggests ${detectedMode} rather than ${declaredMode}`,
      severity: 'WARNING'
    });
  }

  // Check for suspicious patterns
  if (detectSuspiciousPattern(recentPoints)) {
    issues.push({
      type: MovementIssueType.SUSPICIOUS_PATTERN,
      message: 'Suspicious movement pattern detected',
      severity: 'WARNING'
    });
  }

  return {
    isValid: !issues.some(issue => issue.severity === 'ERROR'),
    detectedMode,
    issues
  };
}

function detectTransportMode(points: MovementDataPoint[]): TransportMode | null {
  if (points.length < 2) return null;

  // Calculate average speed over recent points
  let totalSpeed = 0;
  let count = 0;

  for (let i = 1; i < points.length; i++) {
    const dist = calculateDistance(points[i-1], points[i]);
    const timeDiff = points[i].timestamp - points[i-1].timestamp;
    const speed = dist / (timeDiff / 1000);
    
    if (speed > 0) {
      totalSpeed += speed;
      count++;
    }
  }

  const avgSpeed = count > 0 ? totalSpeed / count : 0;

  // Determine mode based on average speed
  if (avgSpeed <= SPEED_THRESHOLDS.WALKING.MAX) {
    return 'WALKING';
  } else if (avgSpeed <= SPEED_THRESHOLDS.BIKING.MAX) {
    return 'BIKING';
  }
  
  return null;
}

function detectSuspiciousPattern(points: MovementDataPoint[]): boolean {
  if (points.length < 3) return false;

  // Convert points to GeoJSON LineString
  const line = lineString(points.map(p => [p.longitude, p.latitude]));
  
  // Calculate sinuosity (ratio of actual distance to straight-line distance)
  const pathLength = length(line, { units: 'kilometers' });
  const start = point([points[0].longitude, points[0].latitude]);
  const end = point([points[points.length-1].longitude, points[points.length-1].latitude]);
  const straightDistance = distance(start, end, { units: 'kilometers' });
  
  // More lenient sinuosity threshold (was 2.5)
  const sinuosity = pathLength / straightDistance;
  
  // More forgiving direction change detection
  let directionChanges = 0;
  for (let i = 2; i < points.length; i++) {
    const bearing1 = bearing(
      [points[i-2].longitude, points[i-2].latitude],
      [points[i-1].longitude, points[i-1].latitude]
    );
    const bearing2 = bearing(
      [points[i-1].longitude, points[i-1].latitude],
      [points[i].longitude, points[i].latitude]
    );
    
    const bearingDiff = Math.abs(bearing1 - bearing2);
    // More lenient angle threshold (was 90)
    if (bearingDiff > 120) {
      directionChanges++;
    }
  }

  // More forgiving thresholds (was 2.5 and 0.5)
  return sinuosity > 4.0 || (directionChanges / points.length) > 0.7;
}

function calculateDistance(point1: MovementDataPoint, point2: MovementDataPoint): number {
  const from = point([point1.longitude, point1.latitude]);
  const to = point([point2.longitude, point2.latitude]);
  return distance(from, to, { units: 'kilometers' }) * 1000; // Convert to meters
} 