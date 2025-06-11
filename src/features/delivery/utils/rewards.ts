import { calculateDistance } from './distance';
import type { Coordinates } from './distance';

interface RewardFactors {
  baseValue: number;
  distanceMultiplier: number;
  timeMultiplier: number;
  maxTimeBonus: number;
}

const DEFAULT_REWARD_FACTORS: RewardFactors = {
  baseValue: 1.0,
  distanceMultiplier: 10, // coins per kilometer
  timeMultiplier: 2, // coins per minute under expected time
  maxTimeBonus: 100 // maximum time bonus possible
};

export function calculateDeliveryReward(
  pickupTime: number,
  origin: Coordinates,
  destination: Coordinates,
  baseValue: number,
  factors: Partial<RewardFactors> = {}
): number {
  const { 
    distanceMultiplier,
    timeMultiplier,
    maxTimeBonus
  } = { ...DEFAULT_REWARD_FACTORS, ...factors };

  // Calculate distance in kilometers
  const distanceMeters = calculateDistance(origin, destination);
  const distanceKm = distanceMeters / 1000;

  // Calculate time taken in minutes
  const now = Date.now();
  const durationMinutes = (now - pickupTime) / 60000;

  // Calculate distance bonus
  const distanceBonus = distanceKm * distanceMultiplier;

  // Calculate time bonus (only for fast deliveries)
  // Expected delivery time: 1 minute per 250 meters
  const expectedMinutes = (distanceMeters / 250);
  const timeUnderExpected = Math.max(0, expectedMinutes - durationMinutes); // Only positive values
  const timeBonus = Math.min(
    maxTimeBonus,
    Math.round(timeUnderExpected * timeMultiplier)
  );

  // Calculate final reward (base + bonuses, never less than base)
  const finalReward = Math.max(
    baseValue, // Minimum reward is the base value
    Math.round(baseValue + distanceBonus + timeBonus)
  );

  return finalReward;
} 