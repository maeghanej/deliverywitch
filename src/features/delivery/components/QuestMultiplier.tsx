import { useDeliveryStore } from '../stores/deliveryStore';
import { getMultiplierMessage } from '../utils/questMultiplier';

export const QuestMultiplier = () => {
  const multiplierInfo = useDeliveryStore(state => state.multiplierInfo);
  const message = getMultiplierMessage(multiplierInfo);
  const { streak } = multiplierInfo;

  return (
    <div className="fixed top-20 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
      {/* Header with total multiplier */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-2">⚡</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Delivery Streaks
          </h3>
        </div>
        <span className="text-xl font-bold text-primary">
          {Math.round((multiplierInfo.currentMultiplier - 1) * 100)}%
        </span>
      </div>
      
      {/* Daily Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-300">Daily</span>
          <span className="text-gray-600 dark:text-gray-300">
            {multiplierInfo.dailyQuestsCompleted}/10
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min((multiplierInfo.dailyQuestsCompleted / 10) * 100, 100)}%`
            }}
          />
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-300">Weekly</span>
          <span className="text-gray-600 dark:text-gray-300">
            {streak.daysThisWeek}/7 days
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(streak.daysThisWeek / 7) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Monthly Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-300">Monthly</span>
          <span className="text-gray-600 dark:text-gray-300">
            {streak.weeksThisMonth}/4 weeks
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(streak.weeksThisMonth / 4) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Next milestone message */}
      <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line mt-2">
        {message.split('\n').slice(-1)[0]} {/* Show only the next milestone message */}
      </p>
    </div>
  );
}; 