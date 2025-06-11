import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocationType } from '../../location/types/LocationEvents';
import type { LocationPoint } from '../../location/types/LocationEvents';

interface GameState {
  player: {
    level: number;
    experience: number;
    coins: number;
    inventory: string[];
  };
  activeQuests: string[];
  weather: string;
  
  // Game actions
  addExperience: (amount: number) => void;
  addCoins: (amount: number) => void;
  addToInventory: (itemId: string) => void;
  startQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  setWeather: (condition: string) => void;
}

// Test data for initial locations
const TEST_LOCATIONS: LocationPoint[] = [
  {
    id: 'pickup_1',
    type: LocationType.PICKUP,
    coordinates: { latitude: 0, longitude: 0 }, // Will be set dynamically
    radius: 50,
    name: 'Test Pickup Point',
    description: 'A test pickup location',
    isActive: true
  },
  {
    id: 'dropoff_1',
    type: LocationType.DROPOFF,
    coordinates: { latitude: 0, longitude: 0 }, // Will be set dynamically
    radius: 50,
    name: 'Test Dropoff Point',
    description: 'A test dropoff location',
    isActive: true
  },
  {
    id: 'character_1',
    type: LocationType.CHARACTER,
    coordinates: { latitude: 0, longitude: 0 }, // Will be set dynamically
    radius: 30,
    name: 'Test NPC',
    description: 'A test character to interact with',
    isActive: true
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      player: {
        level: 1,
        experience: 0,
        coins: 0,
        inventory: []
      },
      activeQuests: [],
      weather: 'CLEAR',

      addExperience: (amount: number) => set(state => {
        const newExperience = state.player.experience + amount;
        const experiencePerLevel = 1000;
        const newLevel = Math.floor(newExperience / experiencePerLevel) + 1;
        
        return {
          player: {
            ...state.player,
            experience: newExperience,
            level: newLevel
          }
        };
      }),

      addCoins: (amount: number) => set(state => ({
        player: {
          ...state.player,
          coins: state.player.coins + amount
        }
      })),

      addToInventory: (itemId: string) => set(state => ({
        player: {
          ...state.player,
          inventory: [...state.player.inventory, itemId]
        }
      })),

      startQuest: (questId: string) => set(state => ({
        activeQuests: [...state.activeQuests, questId]
      })),

      completeQuest: (questId: string) => set(state => ({
        activeQuests: state.activeQuests.filter(id => id !== questId)
      })),

      setWeather: (condition: string) => set({
        weather: condition
      })
    }),
    {
      name: 'game-state',
      partialize: (state) => ({
        player: state.player,
        activeQuests: state.activeQuests
      })
    }
  )
);

// Export test data for use in development
export const getTestLocations = (playerPosition: { latitude: number; longitude: number }) => {
  // Create locations around the player's position
  return TEST_LOCATIONS.map((location, index) => ({
    ...location,
    coordinates: {
      latitude: playerPosition.latitude + (index * 0.001), // Roughly 100m apart
      longitude: playerPosition.longitude + (index * 0.001)
    }
  }));
}; 