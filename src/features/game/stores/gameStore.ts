import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Location } from '../../../types';
import type { LocationPoint } from '../../location/types/LocationEvents';
import { LocationType } from '../../location/types/LocationEvents';

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
    name: 'Witch\'s Cottage',
    description: 'A cozy cottage where magical deliveries originate',
    isActive: true
  },
  {
    id: 'pickup_2',
    type: LocationType.PICKUP,
    coordinates: { latitude: 0, longitude: 0 }, // Will be set dynamically
    radius: 50,
    name: 'Potion Shop',
    description: 'A bustling shop filled with bubbling concoctions',
    isActive: true
  },
  {
    id: 'pickup_3',
    type: LocationType.PICKUP,
    coordinates: { latitude: 0, longitude: 0 }, // Will be set dynamically
    radius: 50,
    name: 'Magic Market',
    description: 'An open-air market for magical goods',
    isActive: true
  },
  {
    id: 'dropoff_1',
    type: LocationType.DROPOFF,
    coordinates: { latitude: 0, longitude: 0 }, // Will be set dynamically
    radius: 50,
    name: 'Wizard Tower',
    description: 'A tall tower where a wise wizard awaits deliveries',
    isActive: true
  },
  {
    id: 'dropoff_2',
    type: LocationType.DROPOFF,
    coordinates: { latitude: 0, longitude: 0 }, // Will be set dynamically
    radius: 50,
    name: 'Enchanted Library',
    description: 'A library filled with magical tomes',
    isActive: true
  },
  {
    id: 'dropoff_3',
    type: LocationType.DROPOFF,
    coordinates: { latitude: 0, longitude: 0 }, // Will be set dynamically
    radius: 50,
    name: 'Familiar Farm',
    description: 'A farm where magical creatures roam',
    isActive: true
  },
  {
    id: 'character_1',
    type: LocationType.CHARACTER,
    coordinates: { latitude: 0, longitude: 0 }, // Will be set dynamically
    radius: 30,
    name: 'Elder Witch',
    description: 'A wise witch who offers guidance and quests',
    isActive: true
  },
  {
    id: 'quest_1',
    type: LocationType.QUEST,
    coordinates: { latitude: 0, longitude: 0 }, // Will be set dynamically
    radius: 40,
    name: 'Quest Board',
    description: 'A magical bulletin board with various delivery requests',
    isActive: true,
    icon: '❗'
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
  // Create locations in a circle around the player
  return TEST_LOCATIONS.map((location, index) => {
    const angle = (index * 2 * Math.PI) / TEST_LOCATIONS.length;
    const radius = 0.002; // Roughly 200m at equator
    
    return {
      ...location,
      coordinates: {
        latitude: playerPosition.latitude + radius * Math.cos(angle),
        longitude: playerPosition.longitude + radius * Math.sin(angle)
      }
    };
  });
}; 