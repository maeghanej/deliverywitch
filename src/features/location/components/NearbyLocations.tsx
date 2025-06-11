import { useLocationEventStore } from '../stores/locationEventStore';
import { LocationType } from '../types/LocationEvents';
import { formatDistance } from '../../delivery/utils/distance';

const locationIcons = {
  [LocationType.PICKUP]: '📦',
  [LocationType.DROPOFF]: '🎯',
  [LocationType.CHARACTER]: '👤',
  [LocationType.DISCOVERY]: '🔍',
  [LocationType.SHOP]: '🏪',
  [LocationType.QUEST]: '❗'
};

export const NearbyLocations = () => {
  const { nearbyLocations, interactWithLocation } = useLocationEventStore();

  if (nearbyLocations.length === 0) {
    return null;
  }

  const handleInteraction = async (locationId: string) => {
    const result = await interactWithLocation(locationId);
    if (result.success && result.rewards) {
      // TODO: Handle rewards (integrate with reward/inventory system)
      console.log('Rewards:', result.rewards);
    }
  };

  const getLocationColor = (type: LocationType) => {
    switch (type) {
      case LocationType.PICKUP:
        return 'text-blue-500 dark:text-blue-400';
      case LocationType.DROPOFF:
        return 'text-green-500 dark:text-green-400';
      case LocationType.CHARACTER:
        return 'text-purple-500 dark:text-purple-400';
      case LocationType.DISCOVERY:
        return 'text-yellow-500 dark:text-yellow-400';
      case LocationType.SHOP:
        return 'text-orange-500 dark:text-orange-400';
      case LocationType.QUEST:
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="text-lg font-semibold mb-2">Nearby Locations</h3>
      <div className="space-y-2">
        {nearbyLocations.map(location => (
          <button
            key={location.id}
            onClick={() => handleInteraction(location.id)}
            className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              location.isActive ? '' : 'opacity-50'
            }`}
            disabled={!location.isActive}
          >
            <span className="text-2xl mr-2">
              {location.icon || locationIcons[location.type]}
            </span>
            <div className="flex-1 text-left">
              <div className={`font-medium ${getLocationColor(location.type)}`}>
                {location.name}
              </div>
              {location.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {location.description}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistance(location.radius)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 