import { Link } from 'react-router-dom';
import { useLocationStore } from '../../features/location/stores/locationStore';

export const Navbar = () => {
  const isTracking = useLocationStore(state => state.isTracking);

  return (
    <nav className="bg-white shadow-lg dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            DeliveryWitch
          </Link>
          <div className="flex items-center space-x-4">
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