import { create } from 'zustand';
import { calculateDistance } from '../../delivery/utils/distance';
import type { Coordinates } from '../../delivery/utils/distance';
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

const DEFAULT_NEARBY_RADIUS = 100; // meters
const DEFAULT_INTERACTION_RADIUS = 20; // meters

export const useLocationEventStore = create<LocationEventState>()((set, get) => ({
  activeLocations: [],
  nearbyLocations: [],
  currentLocation: null,
  lastInteraction: null,

  addLocation: (location: LocationPoint) => {
    set(state => ({
      activeLocations: [...state.activeLocations, location]
    }));
  },

  removeLocation: (locationId: string) => {
    set(state => ({
      activeLocations: state.activeLocations.filter(loc => loc.id !== locationId),
      nearbyLocations: state.nearbyLocations.filter(loc => loc.id !== locationId)
    }));
  },

  updateLocation: (locationId: string, updates: Partial<LocationPoint>) => {
    set(state => ({
      activeLocations: state.activeLocations.map(loc =>
        loc.id === locationId ? { ...loc, ...updates } : loc
      )
    }));
  },

  updatePlayerPosition: (coordinates: Coordinates) => {
    const { activeLocations } = get();
    const nearbyLocations = activeLocations.filter(location => {
      const distance = calculateDistance(coordinates, location.coordinates);
      
      // Check if we've entered or exited the location's radius
      const wasNearby = get().nearbyLocations.some(loc => loc.id === location.id);
      const isNearby = distance <= (location.radius || DEFAULT_NEARBY_RADIUS);
      
      // Emit proximity events
      if (!wasNearby && isNearby) {
        emitProximityEvent({
          locationId: location.id,
          type: ProximityEventType.ENTER,
          timestamp: Date.now(),
          distance,
          coordinates
        });
      } else if (wasNearby && !isNearby) {
        emitProximityEvent({
          locationId: location.id,
          type: ProximityEventType.EXIT,
          timestamp: Date.now(),
          distance,
          coordinates
        });
      }
      
      return isNearby;
    });

    set({
      currentLocation: coordinates,
      nearbyLocations
    });
  },

  getNearbyLocations: (radius = DEFAULT_NEARBY_RADIUS) => {
    const { currentLocation, activeLocations } = get();
    if (!currentLocation) return [];

    return activeLocations.filter(location => {
      const distance = calculateDistance(currentLocation, location.coordinates);
      return distance <= radius;
    });
  },

  interactWithLocation: async (locationId: string) => {
    const { currentLocation, activeLocations } = get();
    const location = activeLocations.find(loc => loc.id === locationId);
    
    if (!location || !currentLocation) {
      return {
        success: false,
        message: 'Location not found or player position unknown'
      };
    }

    const distance = calculateDistance(currentLocation, location.coordinates);
    if (distance > (location.radius || DEFAULT_INTERACTION_RADIUS)) {
      return {
        success: false,
        message: 'Too far from location to interact'
      };
    }

    // Check location requirements
    if (location.requirements) {
      // TODO: Implement requirement checking (quest status, level, time, weather)
    }

    // Handle interaction based on location type
    const result = await handleLocationInteraction(location);
    
    // Record interaction
    const interaction: LocationInteraction = {
      locationId,
      type: location.type,
      timestamp: Date.now(),
      result
    };

    set({ lastInteraction: interaction });
    
    // Emit interaction event
    emitProximityEvent({
      locationId,
      type: ProximityEventType.INTERACT,
      timestamp: Date.now(),
      distance,
      coordinates: currentLocation
    });

    return result;
  },

  validatePickupDropoff: (pickupId: string, dropoffId: string) => {
    const { activeLocations, lastInteraction } = get();
    const pickup = activeLocations.find(loc => loc.id === pickupId);
    const dropoff = activeLocations.find(loc => loc.id === dropoffId);

    if (!pickup || !dropoff) return false;
    if (pickup.type !== LocationType.PICKUP || dropoff.type !== LocationType.DROPOFF) return false;

    // Ensure we've interacted with the pickup location first
    if (!lastInteraction || lastInteraction.locationId !== pickupId) return false;

    return true;
  }
}));

// Helper function to handle location interactions
async function handleLocationInteraction(location: LocationPoint): Promise<InteractionResult> {
  switch (location.type) {
    case LocationType.PICKUP:
      return {
        success: true,
        message: `Picked up delivery from ${location.name}`,
        nextLocationId: 'DROPOFF_ID' // TODO: Get actual dropoff ID
      };
    
    case LocationType.DROPOFF:
      return {
        success: true,
        message: `Delivered to ${location.name}`,
        rewards: [
          { type: RewardType.EXPERIENCE, amount: 100, description: 'Delivery completed' },
          { type: RewardType.COINS, amount: 50, description: 'Delivery fee' }
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

// Helper function to emit proximity events
function emitProximityEvent(event: ProximityEvent) {
  // TODO: Implement event system (could use browser events, websockets, or a pub/sub system)
  console.log('Proximity Event:', event);
} 