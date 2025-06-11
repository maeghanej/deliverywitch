import type { Quest, Delivery, QuestReward } from '../types';
import type { Location } from '../../../types';
import type { LocationPoint } from '../../location/types/LocationEvents';
import { calculateDistance } from './distance';
import { v4 as uuidv4 } from 'uuid';
import { useLocationEventStore } from '../../location/stores/locationEventStore';
import { LocationType } from '../../location/types/LocationEvents';

// Distance ranges in meters
const TRANSPORT_RANGES = {
  WALKING: {
    MIN: 100,  // 100m
    MAX: 1000  // 1km
  },
  BIKING: {
    MIN: 300,  // 300m
    MAX: 3000  // 3km
  }
} as const;

// Quest templates for variety
const QUEST_TEMPLATES = [
  {
    title: "Urgent Package Delivery",
    description: "A mysterious package needs to be delivered quickly!",
    baseReward: 100
  },
  {
    title: "Special Potion Run",
    description: "Deliver these volatile potions with care.",
    baseReward: 150
  },
  {
    title: "Lost Letter",
    description: "This enchanted letter must reach its recipient.",
    baseReward: 80
  },
  {
    title: "Magical Ingredients",
    description: "These fresh magical ingredients need swift delivery!",
    baseReward: 120
  }
] as const;

// Calculate reward based on distance and mode
function calculateReward(distance: number, transportMode: 'WALKING' | 'BIKING'): QuestReward {
  const baseMultiplier = transportMode === 'WALKING' ? 2 : 1; // Walking pays more per meter
  const baseReward = Math.round((distance / 100) * baseMultiplier); // 1 gold per 100m base rate

  return {
    gold: baseReward,
    relationshipPoints: {}, // To be implemented with character system
  };
}

// Convert LocationPoint to Location
function convertToLocation(point: LocationPoint): Location {
  // Map LocationType from LocationEvents to LocationType from types/index
  let locationType: Location['type'];
  switch (point.type) {
    case LocationType.PICKUP:
    case LocationType.DROPOFF:
      locationType = 'DELIVERY';
      break;
    case LocationType.CHARACTER:
      locationType = 'CHARACTER';
      break;
    case LocationType.QUEST:
      locationType = 'QUEST';
      break;
    default:
      locationType = 'DELIVERY'; // Default to DELIVERY for other types
  }

  return {
    id: point.id,
    name: point.name,
    type: locationType,
    coordinates: point.coordinates,
    characters: [],
    sprite: point.icon || 'default'
  };
}

export function generateQuests(
  playerLocation: Location,
  transportMode: 'WALKING' | 'BIKING',
  count: number = 3
): Quest[] {
  const { MIN, MAX } = TRANSPORT_RANGES[transportMode];
  const activeLocations = useLocationEventStore.getState().activeLocations;
  
  // Filter locations by distance
  const validLocations = activeLocations.filter(location => {
    const distance = calculateDistance(playerLocation.coordinates, location.coordinates);
    return distance >= MIN && distance <= MAX;
  });

  if (validLocations.length < 2) {
    console.warn('Not enough valid locations for quests');
    return [];
  }

  return Array.from({ length: Math.min(count, Math.floor(validLocations.length / 2)) }, (): Quest => {
    // Pick a random quest template
    const template = QUEST_TEMPLATES[Math.floor(Math.random() * QUEST_TEMPLATES.length)];
    
    // Pick random pickup and dropoff locations
    const pickupIndex = Math.floor(Math.random() * validLocations.length);
    const pickupLocation = convertToLocation(validLocations[pickupIndex]);
    
    // Remove pickup location from available locations for dropoff
    const remainingLocations = validLocations.filter((_, index) => index !== pickupIndex);
    const dropoffLocation = convertToLocation(remainingLocations[Math.floor(Math.random() * remainingLocations.length)]);
    
    // Calculate distances
    const toPickupDistance = calculateDistance(
      playerLocation.coordinates,
      pickupLocation.coordinates
    );
    const deliveryDistance = calculateDistance(
      pickupLocation.coordinates,
      dropoffLocation.coordinates
    );
    const totalDistance = toPickupDistance + deliveryDistance;

    // Create the delivery
    const delivery: Delivery = {
      id: uuidv4(),
      status: 'AVAILABLE',
      item: {
        id: uuidv4(),
        name: template.title.replace(' Delivery', '').replace(' Run', ''),
        type: 'QUEST_ITEM',
        value: template.baseReward
      },
      pickupLocation,
      dropoffLocation,
      distance: totalDistance,
      reward: template.baseReward
    };

    // Calculate time limit based on distance and mode
    const speedFactor = transportMode === 'WALKING' ? 1.4 : 4.17; // m/s
    const timeLimit = Math.ceil((totalDistance / speedFactor) / 60) + 10; // minutes, with 10min buffer

    return {
      id: uuidv4(),
      title: template.title,
      description: template.description,
      deliveries: [delivery],
      status: 'AVAILABLE',
      reward: calculateReward(totalDistance, transportMode),
      timeLimit
    };
  });
} 