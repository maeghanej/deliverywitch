import { Link } from 'react-router-dom';
import { useLocationStore } from '../../features/location/stores/locationStore';
import { useTransportStore } from '../../features/transport/stores/transportStore';
import type { TransportMode } from '../../features/transport/stores/transportStore';

export const Navbar = () => {
  const isTracking = useLocationStore(state => state.isTracking);
  const { mode, setMode } = useTransportStore();

  const toggleTransportMode = () => {
    if (mode === 'WALKING') {
      setMode('BIKING');
    } else if (mode === 'BIKING') {
      setMode('WALKING');
    }
  };

  return (
    <nav className="bg-white shadow-lg dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            DeliveryWitch
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Transport Mode Toggle */}
            {mode && (
              <button
                onClick={toggleTransportMode}
                className="flex items-center space-x-2 px-3 py-1 rounded-full 
                         bg-primary/10 hover:bg-primary/20 transition-colors"
                title="Click to change transport mode"
              >
                <span className="text-xl">
                  {mode === 'WALKING' ? '🚶‍♂️' : '🚲'}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'WALKING' ? 'Walking' : 'Biking'}
                </span>
              </button>
            )}

            {/* Tracking Indicator */}
            <div className={`
              w-2 h-2 rounded-full
              ${isTracking ? 'bg-green-500' : 'bg-gray-400'}
            `} />
            
            <Link
              to="/quests"
              className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Quests
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}; 