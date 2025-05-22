import { useState, useEffect, useCallback } from 'react';
import { useLocationStore } from '../stores/locationStore';
import type { LocationType } from '../../../types';

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
  const { updateCurrentLocation, isTracking } = useLocationStore();

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

      if (isTracking) {
        updateCurrentLocation({
          id: 'current',
          name: 'Current Location',
          type: 'CURRENT' as LocationType,
          coordinates: { latitude, longitude },
          characters: [],
          sprite: ''
        });
      }
    },
    [isTracking, updateCurrentLocation]
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