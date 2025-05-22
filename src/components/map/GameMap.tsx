import { useRef, useCallback } from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import { useGeolocation } from '../../features/location/hooks/useGeolocation';
import { PlayerMarker } from './PlayerMarker';
import { DeliveryMarkers } from '../../features/delivery/components/DeliveryMarkers';
import { ActiveDelivery } from '../../features/delivery/components/ActiveDelivery';

// Debug: Check Mapbox token
console.log('Mapbox token:', import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);

// Default map settings - these should come from environment variables in production
const DEFAULT_LATITUDE = 51.0447;
const DEFAULT_LONGITUDE = -114.0718;
const DEFAULT_ZOOM = 13;

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  padding: { top: number; bottom: number; left: number; right: number };
}

export const GameMap = () => {
  const mapRef = useRef<any>(null);
  const { latitude, longitude, accuracy, error } = useGeolocation();

  const initialViewState: ViewState = {
    latitude: latitude || DEFAULT_LATITUDE,
    longitude: longitude || DEFAULT_LONGITUDE,
    zoom: DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0,
    padding: { top: 40, bottom: 40, left: 40, right: 40 },
  };

  const onMapLoad = useCallback(() => {
    if (mapRef.current) {
      // Add any custom map styling or layers here
    }
  }, []);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-red-50 p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onLoad={onMapLoad}
      >
        <NavigationControl position="top-right" />
        
        {/* Player Location Marker */}
        {latitude && longitude && (
          <PlayerMarker
            latitude={latitude}
            longitude={longitude}
            accuracy={accuracy}
          />
        )}

        {/* Delivery Markers */}
        <DeliveryMarkers />
      </Map>

      {/* Active Delivery UI */}
      <ActiveDelivery />

      {/* Debug Info - remove in production */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded shadow text-sm">
        <p>Lat: {latitude?.toFixed(6)}</p>
        <p>Lng: {longitude?.toFixed(6)}</p>
        <p>Accuracy: {accuracy?.toFixed(2)}m</p>
      </div>
    </div>
  );
}; 