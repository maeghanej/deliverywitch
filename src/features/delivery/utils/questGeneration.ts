import type { Quest, Delivery, QuestReward } from '../types';
import type { Location } from '../../../types';
import { calculateDistance } from './distance';
import { v4 as uuidv4 } from 'uuid';

// Distance ranges in meters
const TRANSPORT_RANGES = {
  WALKING: {
    MIN: 1000,  // 1km
    MAX: 5000   // 5km
  },
  BIKING: {
    MIN: 3000,  // 3km
    MAX: 15000  // 15km
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

// Generate a random point within distance range
function generateDestination(origin: Location, minDistance: number, maxDistance: number): Location {
  // Convert distances to degrees (approximate)
  const metersPerDegree = 111000; // roughly 111km per degree
  const maxDegrees = maxDistance / metersPerDegree;
  
  // Generate random angle and distance within range
  const angle = Math.random() * 2 * Math.PI;
  const distance = minDistance + Math.random() * (maxDistance - minDistance);
  const distanceDegrees = distance / metersPerDegree;

  // Calculate new coordinates
  const lat = origin.coordinates.latitude + (distanceDegrees * Math.cos(angle));
  const lng = origin.coordinates.longitude + (distanceDegrees * Math.sin(angle));

  return {
    id: uuidv4(),
    name: 'Delivery Location',
    type: 'DELIVERY',
    coordinates: { latitude: lat, longitude: lng },
    characters: [],
    sprite: ''
  };
}

// Calculate reward based on distance and mode
function calculateReward(distance: number, transportMode: 'WALKING' | 'BIKING'): QuestReward {
  const baseMultiplier = transportMode === 'WALKING' ? 2 : 1; // Walking pays more per meter
  const baseReward = Math.round((distance / 100) * baseMultiplier); // 1 gold per 100m base rate

  return {
    gold: baseReward,
    relationshipPoints: {}, // To be implemented with character system
  };
}

export function generateQuests(
  playerLocation: Location,
  transportMode: 'WALKING' | 'BIKING',
  count: number = 3
): Quest[] {
  const { MIN, MAX } = TRANSPORT_RANGES[transportMode];
  
  return Array.from({ length: count }, (): Quest => {
    // Pick a random quest template
    const template = QUEST_TEMPLATES[Math.floor(Math.random() * QUEST_TEMPLATES.length)];
    
    // Generate pickup and dropoff locations
    const pickupLocation = generateDestination(playerLocation, MIN * 0.2, MIN * 0.5);
    const dropoffLocation = generateDestination(playerLocation, MIN, MAX);
    
    // Calculate actual distances
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