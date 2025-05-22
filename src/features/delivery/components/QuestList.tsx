import { useDeliveryStore } from '../stores/deliveryStore';
import { formatDistance, formatTime, estimateWalkingTime, estimateBikingTime } from '../utils/distance';

export const QuestList = () => {
  const { availableQuests, startQuest } = useDeliveryStore();

  if (availableQuests.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No quests available at the moment.
        <br />
        Try moving to a different area!
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {availableQuests.map(quest => {
        const totalDistance = quest.deliveries.reduce((acc, delivery) => acc + delivery.distance, 0);
        const walkingTime = estimateWalkingTime(totalDistance);
        const bikingTime = estimateBikingTime(totalDistance);

        return (
          <div
            key={quest.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {quest.title}
              </h3>
              <span className="text-sm font-medium text-primary">
                {quest.reward.gold} 🪙
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              {quest.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {quest.deliveries.map((delivery, index) => (
                <div
                  key={delivery.id}
                  className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1"
                >
                  {delivery.item.name}
                  {index < quest.deliveries.length - 1 ? ' →' : ''}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <div>
                <span>🚶‍♂️ {formatTime(walkingTime)}</span>
                <span className="mx-2">|</span>
                <span>🚲 {formatTime(bikingTime)}</span>
              </div>
              <span>{formatDistance(totalDistance)}</span>
            </div>

            <button
              onClick={() => startQuest(quest)}
              className="mt-3 w-full bg-primary text-white rounded-lg py-2 px-4 hover:bg-primary-dark transition-colors"
            >
              Accept Quest
            </button>
          </div>
        );
      })}
    </div>
  );
}; 