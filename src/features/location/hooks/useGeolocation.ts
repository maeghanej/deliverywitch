import { useState, useEffect } from 'react';
import type { Coordinates } from '../../delivery/utils/distance';
import { useLocationEventStore } from '../stores/locationEventStore';

interface GeolocationState {
  coordinates: Coordinates | null;
  error: GeolocationError | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

type GeolocationError = {
  code: number;
  message: string;
};

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    status: 'idle'
  });

  const updatePlayerPosition = useLocationEventStore(state => state.updatePlayerPosition);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        error: {
          code: 0,
          message: 'Geolocation is not supported by your browser'
        },
        status: 'error'
      });
      return;
    }

    setState(prev => ({ ...prev, status: 'loading' }));

    // Get initial position immediately
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setState({
          coordinates,
          error: null,
          status: 'success'
        });
        updatePlayerPosition(coordinates);
      },
      (error) => {
        setState({
          coordinates: null,
          error: {
            code: error.code,
            message: error.message
          },
          status: 'error'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    // Then watch for position updates
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setState({
          coordinates,
          error: null,
          status: 'success'
        });
        updatePlayerPosition(coordinates);
      },
      (error) => {
        setState({
          coordinates: null,
          error: {
            code: error.code,
            message: error.message
          },
          status: 'error'
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000, // Use cached position if less than 1 second old
        timeout: 5000 // Time to wait for position
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [updatePlayerPosition]);

  return state;
}; 