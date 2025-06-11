import { useEffect } from 'react';
import { useDeliveryStore } from '../stores/deliveryStore';
import { useLocationStore } from '../../location/stores/locationStore';
import { formatDistance, formatTime } from '../utils/distance';
import { DeliveryStatus } from '../types';

export const ActiveDelivery = () => {
  const { activeDelivery, deliveryProgress, updateDeliveryProgress } = useDeliveryStore();
  const currentLocation = useLocationStore(state => state.currentLocation);

  useEffect(() => {
    if (currentLocation && activeDelivery) {
      updateDeliveryProgress(currentLocation);
    }
  }, [currentLocation, activeDelivery, updateDeliveryProgress]);

  if (!activeDelivery || !deliveryProgress) {
    return null;
  }

  const getStatusText = () => {
    switch (activeDelivery.status) {
      case DeliveryStatus.ACCEPTED:
        return 'Head to pickup location';
      case DeliveryStatus.PICKED_UP:
        return 'Delivering to destination';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {activeDelivery.item.name}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDistance(deliveryProgress.currentDistance)} / {formatDistance(deliveryProgress.totalDistance)}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{
            width: `${(deliveryProgress.currentDistance / deliveryProgress.totalDistance) * 100}%`
          }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">
          {getStatusText()}
        </span>
        {deliveryProgress.estimatedTimeRemaining && (
          <span className="text-gray-600 dark:text-gray-300">
            ETA: {formatTime(deliveryProgress.estimatedTimeRemaining)}
          </span>
        )}
      </div>
    </div>
  );
}; 