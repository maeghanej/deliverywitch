import { Marker } from 'react-map-gl';
import { useLocationStore } from '../../features/location/stores/locationStore';

interface PlayerMarkerProps {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export const PlayerMarker = ({ latitude, longitude, accuracy }: PlayerMarkerProps) => {
  const isTracking = useLocationStore(state => state.isTracking);

  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
      anchor="center"
    >
      <div className="relative">
        {/* Accuracy circle */}
        {accuracy && (
          <div
            className="absolute rounded-full bg-blue-500/20"
            style={{
              width: `${Math.min(accuracy * 2, 100)}px`,
              height: `${Math.min(accuracy * 2, 100)}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
        
        {/* Player dot */}
        <div className={`
          relative
          w-6 h-6 
          rounded-full 
          bg-blue-500 
          border-2 
          border-white 
          shadow-lg
          ${isTracking ? 'animate-pulse' : ''}
        `} />

        {/* Pulsing effect */}
        <div className={`
          absolute 
          top-0 
          left-0
          w-6 h-6 
          rounded-full 
          bg-blue-500/50
          animate-ping
        `} />
      </div>
    </Marker>
  );
}; 