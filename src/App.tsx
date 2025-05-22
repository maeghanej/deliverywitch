import { BrowserRouter as Router } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Navbar } from './components/layout/Navbar'
import { GameMap } from './components/map/GameMap'
import { useLocationStore } from './features/location/stores/locationStore'

function App() {
  const { isTracking, startTracking, stopTracking } = useLocationStore();

  return (
    <MantineProvider>
      <Router>
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="flex-1 relative">
            <GameMap />
            
            {/* Floating Action Button */}
            <button
              onClick={() => isTracking ? stopTracking() : startTracking()}
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
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </button>
          </main>
        </div>
      </Router>
    </MantineProvider>
  )
}

export default App
