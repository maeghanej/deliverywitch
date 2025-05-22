import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Location } from '../../../types';

interface LocationState {
  currentLocation: Location | null;
  lastKnownLocations: Location[];
  isTracking: boolean;
  
  // Actions
  updateCurrentLocation: (location: Location) => void;
  startTracking: () => void;
  stopTracking: () => void;
  addLocationToHistory: (location: Location) => void;
}

export const useLocationStore = create<LocationState>()(
  devtools(
    (set) => ({
      currentLocation: null,
      lastKnownLocations: [],
      isTracking: false,

      updateCurrentLocation: (location) => 
        set((state) => ({
          currentLocation: location,
          lastKnownLocations: state.isTracking 
            ? [...state.lastKnownLocations, location].slice(-50) // Keep last 50 locations
            : state.lastKnownLocations
        })),

      startTracking: () => set({ isTracking: true }),
      
      stopTracking: () => set({ isTracking: false }),
      
      addLocationToHistory: (location) =>
        set((state) => ({
          lastKnownLocations: [...state.lastKnownLocations, location].slice(-50)
        })),
    }),
    {
      name: 'location-store',
    }
  )
); 