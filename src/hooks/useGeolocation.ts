import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  speed: number | null;
  heading: number | null;
  error: string | null;
  timestamp: number | null;
}

const defaultState: GeolocationState = {
  latitude: null,
  longitude: null,
  accuracy: null,
  speed: null,
  heading: null,
  error: null,
  timestamp: null,
};

export const useGeolocation = (options: PositionOptions = {}) => {
  const [state, setState] = useState<GeolocationState>(defaultState);
  const updateLocation = useGameStore(state => state.updateLocation);
  const isPlaying = useGameStore(state => state.isPlaying);

  const onEvent = useCallback(
    (event: GeolocationPosition) => {
      const { latitude, longitude, accuracy, speed, heading } = event.coords;
      
      setState({
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
        timestamp: event.timestamp,
        error: null,
      });

      // Only update game location if actively playing
      if (isPlaying) {
        updateLocation({
          id: 'current',
          name: 'Current Location',
          type: 'CURRENT',
          coordinates: { latitude, longitude },
          characters: [],
          sprite: ''
        });
      }
    },
    [isPlaying, updateLocation]
  );

  const onError = useCallback((error: GeolocationPositionError) => {
    setState(prev => ({
      ...prev,
      error: error.message,
    }));
  }, []);

  useEffect(() => {
    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    };

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported',
      }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      onEvent,
      onError,
      { ...defaultOptions, ...options }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [onEvent, onError, options]);

  return state;
}; 