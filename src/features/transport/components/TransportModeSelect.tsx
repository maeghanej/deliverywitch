import { useTransportStore } from '../stores/transportStore';
import { useMovementStore } from '../../movement/stores/movementStore';
import type { TransportMode } from '../stores/transportStore';

export const TransportModeSelect = () => {
  const { mode, setMode } = useTransportStore();
  const initializeValidation = useMovementStore(state => state.initializeValidation);

  if (mode) return null; // Don't show if mode is already selected

  const handleModeSelect = (selectedMode: TransportMode) => {
    setMode(selectedMode);
    initializeValidation(selectedMode);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          How are you traveling today?
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleModeSelect('WALKING')}
            className="flex flex-col items-center justify-center p-4 bg-primary/10 hover:bg-primary/20 
                     rounded-lg transition-colors border-2 border-transparent hover:border-primary"
          >
            <span className="text-4xl mb-2">🚶‍♂️</span>
            <span className="text-lg font-medium text-gray-900 dark:text-white">Walking</span>
          </button>

          <button
            onClick={() => handleModeSelect('BIKING')}
            className="flex flex-col items-center justify-center p-4 bg-primary/10 hover:bg-primary/20 
                     rounded-lg transition-colors border-2 border-transparent hover:border-primary"
          >
            <span className="text-4xl mb-2">🚲</span>
            <span className="text-lg font-medium text-gray-900 dark:text-white">Biking</span>
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          This helps us find suitable deliveries for you
        </p>
      </div>
    </div>
  );
}; 