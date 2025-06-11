import { BrowserRouter as Router } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Navbar } from './components/layout/Navbar'
import { GameMap } from './components/map/GameMap'
import { useLocationStore } from './features/location/stores/locationStore'
import { TransportModeSelect } from './features/transport/components/TransportModeSelect'
import { useTransportStore } from './features/transport/stores/transportStore'
import { QuestMultiplier } from './features/delivery/components/QuestMultiplier'
import { MovementValidation } from './features/movement/components/MovementValidation'
import { useDeliveryStore } from './features/delivery/stores/deliveryStore'
import { useLocationEventStore } from './features/location/stores/locationEventStore'
import { getTestLocations } from './features/game/stores/gameStore'

function App() {
  const { isTracking, startTracking, stopTracking, currentLocation } = useLocationStore();
  const { mode } = useTransportStore();
  const { generateNewQuests } = useDeliveryStore();
  const { addLocation, removeLocation } = useLocationEventStore();

  const handleStartTracking = () => {
    if (!currentLocation || !mode) return;
    
    // Clear existing locations
    useLocationEventStore.getState().activeLocations.forEach(loc => {
      removeLocation(loc.id);
    });

    // Add test locations around player
    const testLocations = getTestLocations({
      latitude: currentLocation.coordinates.latitude,
      longitude: currentLocation.coordinates.longitude
    });
    testLocations.forEach(location => {
      addLocation(location);
    });

    // Start tracking and generate quests
    startTracking();
    generateNewQuests(currentLocation, mode);
  };

  return (
    <MantineProvider>
      <Router>
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="flex-1 relative">
            <GameMap />
            
            {/* Transport Mode Selection */}
            <TransportModeSelect />
            
            {/* Quest Multiplier */}
            {mode && <QuestMultiplier />}
            
            {/* Movement Validation */}
            {mode && <MovementValidation />}
            
            {/* Only show tracking button if transport mode is selected */}
            {mode && (
              <button
                onClick={() => isTracking ? stopTracking() : handleStartTracking()}
                className={`
                  fixed bottom-8 right-8 
                  z-10 p-4 rounded-full 
                  shadow-lg transition-colors
                  ${isTracking 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                  }
                  text-white font-semibold
                `}
              >
                {isTracking ? 'Stop Deliveries' : 'Begin Deliveries'}
              </button>
            )}
          </main>
        </div>
      </Router>
    </MantineProvider>
  )
}

export default App
