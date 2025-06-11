import { useEffect } from 'react';
import { useGeolocation } from '../../location/hooks/useGeolocation';
import { useLocationEventStore } from '../../location/stores/locationEventStore';
import { useGameStore, getTestLocations } from '../stores/gameStore';
import { NearbyLocations } from '../../location/components/NearbyLocations';
import { MovementStats } from '../../movement/components/MovementStats';
import { GameMap } from '../../map/components/GameMap';

export const TestGame = () => {
  const { coordinates, error, status } = useGeolocation();
  const { addLocation, removeLocation } = useLocationEventStore();
  const { player, addExperience, addCoins } = useGameStore();

  // Set up test locations when we get player position
  useEffect(() => {
    if (coordinates) {
      // Clear existing locations
      useLocationEventStore.getState().activeLocations.forEach(loc => {
        removeLocation(loc.id);
      });

      // Add test locations around player
      const testLocations = getTestLocations(coordinates);
      testLocations.forEach(location => {
        addLocation(location);
      });
    }
  }, [coordinates, addLocation, removeLocation]);

  // Handle rewards from location interactions
  useEffect(() => {
    const lastInteraction = useLocationEventStore.getState().lastInteraction;
    if (lastInteraction?.result.rewards) {
      lastInteraction.result.rewards.forEach(reward => {
        switch (reward.type) {
          case 'EXPERIENCE':
            addExperience(reward.amount);
            break;
          case 'COINS':
            addCoins(reward.amount);
            break;
          // Handle other reward types as needed
        }
      });
    }
  }, [useLocationEventStore.getState().lastInteraction, addExperience, addCoins]);

  if (status === 'error' && error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Location Error
          </h2>
          <p className="text-red-700 dark:text-red-300">{error.message}</p>
        </div>
      </div>
    );
  }

  if (status === 'loading' || !coordinates) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold mb-2">Loading Game...</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Waiting for location access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Map */}
      <GameMap />

      {/* UI Overlay */}
      <div className="relative z-10">
        {/* Player Stats */}
        <div className="fixed top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Player Stats</h2>
          <div className="space-y-1">
            <div>Level: {player.level}</div>
            <div>XP: {player.experience}</div>
            <div>Coins: {player.coins}</div>
          </div>
        </div>

        {/* Debug Coordinates */}
        <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-sm font-mono">
          <div>Lat: {coordinates.latitude.toFixed(6)}</div>
          <div>Lng: {coordinates.longitude.toFixed(6)}</div>
        </div>

        {/* Movement Stats */}
        <MovementStats />

        {/* Nearby Locations */}
        <NearbyLocations />
      </div>
    </div>
  );
}; 