import { create } from 'zustand';
import { calculateDistance } from '../../delivery/utils/distance';
import type { Coordinates } from '../../delivery/utils/distance';
import { useDeliveryStore } from '../../delivery/stores/deliveryStore';
import { DeliveryStatus } from '../../delivery/types';
import {
  LocationType,
  ProximityEventType,
  RewardType
} from '../types/LocationEvents';
import type {
  LocationPoint,
  ProximityEvent,
  LocationInteraction,
  InteractionResult
} from '../types/LocationEvents';

interface LocationEventState {
  activeLocations: LocationPoint[];
  nearbyLocations: LocationPoint[];
  currentLocation: Coordinates | null;
  lastInteraction: LocationInteraction | null;
  
  // Location Management
  addLocation: (location: LocationPoint) => void;
  removeLocation: (locationId: string) => void;
  updateLocation: (locationId: string, updates: Partial<LocationPoint>) => void;
  
  // Proximity Detection
  updatePlayerPosition: (coordinates: Coordinates) => void;
  getNearbyLocations: (radius?: number) => LocationPoint[];
  
  // Interaction Handling
  interactWithLocation: (locationId: string) => Promise<InteractionResult>;
  validatePickupDropoff: (pickupId: string, dropoffId: string) => boolean;
}

const DEFAULT_INTERACTION_RADIUS = 20; // meters

// Helper function to handle location interactions
async function handleLocationInteraction(location: LocationPoint): Promise<InteractionResult> {
  const deliveryStore = useDeliveryStore.getState();
  const activeDelivery = deliveryStore.activeDelivery;

  switch (location.type) {
    case LocationType.PICKUP:
      if (!activeDelivery || activeDelivery.status !== DeliveryStatus.ACCEPTED) {
        return {
          success: false,
          message: 'No active delivery to pick up'
        };
      }

      if (location.id !== activeDelivery.pickupLocation.id) {
        return {
          success: false,
          message: 'This is not the correct pickup location'
        };
      }

      // Update delivery status
      deliveryStore.updateDeliveryStatus(activeDelivery.id, DeliveryStatus.PICKED_UP);

      return {
        success: true,
        message: `Picked up delivery from ${location.name}`,
        nextLocationId: activeDelivery.dropoffLocation.id
      };
    
    case LocationType.DROPOFF:
      if (!activeDelivery || activeDelivery.status !== DeliveryStatus.PICKED_UP) {
        return {
          success: false,
          message: 'No active delivery to drop off'
        };
      }

      if (location.id !== activeDelivery.dropoffLocation.id) {
        return {
          success: false,
          message: 'This is not the correct dropoff location'
        };
      }

      // Complete the delivery
      deliveryStore.updateDeliveryStatus(activeDelivery.id, DeliveryStatus.COMPLETED);

      return {
        success: true,
        message: `Delivered to ${location.name}`,
        rewards: [
          { type: RewardType.EXPERIENCE, amount: 100, description: 'Delivery completed' },
          { type: RewardType.COINS, amount: activeDelivery.reward, description: 'Delivery fee' }
        ]
      };
    
    case LocationType.CHARACTER:
      return {
        success: true,
        message: `Talking to ${location.name}`,
        // TODO: Implement dialogue system
      };
    
    case LocationType.DISCOVERY:
      return {
        success: true,
        message: `Discovered ${location.name}`,
        rewards: [
          { type: RewardType.EXPERIENCE, amount: 50, description: 'New location discovered' }
        ]
      };
    
    default:
      return {
        success: true,
        message: `Interacted with ${location.name}`
      };
  }
}

export const useLocationEventStore = create<LocationEventState>()((set, get) => ({
  activeLocations: [],
  nearbyLocations: [],
  currentLocation: null,
  lastInteraction: null,

  addLocation: (location) => set(state => ({
    activeLocations: [...state.activeLocations, location]
  })),

  removeLocation: (locationId) => set(state => ({
    activeLocations: state.activeLocations.filter(loc => loc.id !== locationId)
  })),

  updateLocation: (locationId, updates) => set(state => ({
    activeLocations: state.activeLocations.map(loc =>
      loc.id === locationId ? { ...loc, ...updates } : loc
    )
  })),

  updatePlayerPosition: (coordinates) => {
    const state = get();
    const NEARBY_RADIUS = 100; // meters

    // Update current location
    set({ currentLocation: coordinates });

    // Update nearby locations
    const nearby = state.activeLocations.filter(location => {
      const distance = calculateDistance(coordinates, location.coordinates);
      return distance <= NEARBY_RADIUS;
    });

    set({ nearbyLocations: nearby });

    // Check for proximity events
    nearby.forEach(location => {
      const distance = calculateDistance(coordinates, location.coordinates);
      if (distance <= DEFAULT_INTERACTION_RADIUS) {
        // Trigger proximity event
        const event: ProximityEvent = {
          type: ProximityEventType.ENTER,
          locationId: location.id,
          distance,
          timestamp: Date.now(),
          coordinates
        };
        // TODO: Handle proximity event
      }
    });
  },

  getNearbyLocations: (radius = 100) => {
    const state = get();
    if (!state.currentLocation) return [];

    return state.activeLocations.filter(location => {
      const distance = calculateDistance(state.currentLocation!, location.coordinates);
      return distance <= radius;
    });
  },

  interactWithLocation: async (locationId) => {
    const state = get();
    const location = state.activeLocations.find(loc => loc.id === locationId);
    
    if (!location) {
      return {
        success: false,
        message: 'Location not found'
      };
    }

    const result = await handleLocationInteraction(location);
    
    if (result.success) {
      set({ lastInteraction: { 
        locationId, 
        timestamp: Date.now(),
        type: location.type,
        result
      }});
    }

    return result;
  },

  validatePickupDropoff: (pickupId, dropoffId) => {
    const state = get();
    const pickup = state.activeLocations.find(loc => loc.id === pickupId);
    const dropoff = state.activeLocations.find(loc => loc.id === dropoffId);

    if (!pickup || !dropoff) return false;

    // Add any additional validation logic here
    return true;
  }
}));

// Helper function to emit proximity events
function emitProximityEvent(event: ProximityEvent) {
  // TODO: Implement event system (could use browser events, websockets, or a pub/sub system)
  console.log('Proximity Event:', event);
} 