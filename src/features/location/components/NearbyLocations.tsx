import { useLocationEventStore } from '../stores/locationEventStore';
import { LocationType } from '../types/LocationEvents';
import { formatDistance } from '../../delivery/utils/distance';
import { calculateDistance } from '../../delivery/utils/distance';

const locationIcons = {
  [LocationType.PICKUP]: '📦',
  [LocationType.DROPOFF]: '🎯',
  [LocationType.CHARACTER]: '👤',
  [LocationType.DISCOVERY]: '🔍',
  [LocationType.SHOP]: '🏪',
  [LocationType.QUEST]: '❗'
};

const DEFAULT_INTERACTION_RADIUS = 20; // meters

export const NearbyLocations = () => {
  const { nearbyLocations, interactWithLocation, currentLocation } = useLocationEventStore();

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

  const isWithinInteractionRange = (location: typeof nearbyLocations[0]) => {
    if (!currentLocation) return false;
    const distance = calculateDistance(currentLocation, location.coordinates);
    return distance <= DEFAULT_INTERACTION_RADIUS;
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm z-20">
      <h3 className="text-lg font-semibold mb-2">Nearby Locations</h3>
      <div className="space-y-2">
        {nearbyLocations.map(location => {
          const withinRange = isWithinInteractionRange(location);
          
          return (
            <button
              key={location.id}
              onClick={() => handleInteraction(location.id)}
              className={`
                w-full flex items-center p-2 rounded-lg 
                transition-all duration-200
                ${withinRange 
                  ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${location.isActive ? '' : 'opacity-50'}
              `}
              disabled={!location.isActive || !withinRange}
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
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistance(calculateDistance(currentLocation!, location.coordinates))}
                </div>
                {withinRange && (
                  <div className="text-xs text-green-600 dark:text-green-400 animate-pulse">
                    In Range
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}; 