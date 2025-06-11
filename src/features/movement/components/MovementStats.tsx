import { useMovementStatsStore } from '../stores/movementStatsStore';
import { formatDistance } from '../../delivery/utils/distance';

export const MovementStats = () => {
  const {
    daysThisWeek,
    totalDistance,
    weeklyDistance,
    monthlyDistance,
    currentStreak,
    bestStreak
  } = useMovementStatsStore();

  return (
    <div className="fixed top-20 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="text-lg font-semibold mb-2">Movement Stats</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Today:</span>
          <span className="font-medium">
            {formatDistance(daysThisWeek[new Date().getDay()])}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">This Week:</span>
          <span className="font-medium">{formatDistance(weeklyDistance)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">This Month:</span>
          <span className="font-medium">{formatDistance(monthlyDistance)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">All Time:</span>
          <span className="font-medium">{formatDistance(totalDistance)}</span>
        </div>

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Current Streak:</span>
            <span className="font-medium">{currentStreak} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Best Streak:</span>
            <span className="font-medium">{bestStreak} days</span>
          </div>
        </div>

        {/* Weekly Progress Bar */}
        <div className="mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekly Progress</div>
          <div className="grid grid-cols-7 gap-1">
            {daysThisWeek.map((distance, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-full bg-blue-200 dark:bg-blue-800 rounded-t-sm transition-all ${
                    distance > 0 ? 'bg-blue-500 dark:bg-blue-400' : ''
                  }`}
                  style={{
                    height: `${Math.min((distance / 5000) * 100, 100)}%`,
                    minHeight: '4px'
                  }}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 