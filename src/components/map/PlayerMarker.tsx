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
      <div className={`
        w-6 h-6 
        rounded-full 
        bg-blue-500 
        border-2 
        border-white 
        shadow-lg
        ${isTracking ? 'animate-pulse' : ''}
      `}>
        {accuracy && (
          <div
            className="absolute -inset-4 rounded-full bg-blue-500/20"
            style={{
              transform: `scale(${Math.min(accuracy / 20, 3)})`,
            }}
          />
        )}
      </div>
    </Marker>
  );
}; 