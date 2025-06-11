import { useMovementStatsStore } from '../stores/movementStatsStore';
import { formatDistance, formatDuration } from '../../delivery/utils/distance';

export const MovementStats = () => {
  const { stats } = useMovementStatsStore();
  const { session, daily } = stats;

  if (!session.startTime) return null;

  const formatSpeed = (speed: number) => {
    const kmh = speed * 3.6;
    return `${kmh.toFixed(1)} km/h`;
  };

  return (
    <div className="fixed top-20 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="text-lg font-semibold mb-2">Movement Stats</h3>
      
      {/* Current Session */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Current Speed:</span>
          <span className="font-medium">{formatSpeed(session.currentSpeed)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Average Speed:</span>
          <span className="font-medium">{formatSpeed(session.averageSpeed)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Top Speed:</span>
          <span className="font-medium">{formatSpeed(session.topSpeed)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Distance:</span>
          <span className="font-medium">{formatDistance(session.totalDistance)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Active Time:</span>
          <span className="font-medium">{formatDuration(session.activeTime)}</span>
        </div>
      </div>

      {/* Daily Stats */}
      <div className="border-t pt-2 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Today's Distance:</span>
          <span className="font-medium">{formatDistance(daily.totalDistance)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Today's Deliveries:</span>
          <span className="font-medium">{daily.deliveriesCompleted}</span>
        </div>
        
        {/* Transport Mode Breakdown */}
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            By Transport Mode:
          </h4>
          <div className="space-y-1 pl-2">
            <div className="flex justify-between items-center text-sm">
              <span>🚶‍♂️ Walking:</span>
              <span>{formatDistance(daily.byTransportMode.WALKING.distance)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>🚲 Biking:</span>
              <span>{formatDistance(daily.byTransportMode.BIKING.distance)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Speed Graph */}
      {session.speedHistory.length > 0 && (
        <div className="mt-4 h-20 w-full">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Speed History</div>
          <div className="relative h-16 w-full">
            {session.speedHistory.map((record, index) => {
              const maxSpeed = Math.max(...session.speedHistory.map(r => r.speed));
              const height = (record.speed / maxSpeed) * 100;
              const width = 100 / session.speedHistory.length;
              return (
                <div
                  key={record.timestamp}
                  className="absolute bottom-0 bg-blue-500 dark:bg-blue-400"
                  style={{
                    left: `${index * width}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                    opacity: 0.7
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}; 