import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Player, TransportMode, Delivery, Location, Item } from '../types'
import type { StateCreator } from 'zustand'

interface GameState {
  player: Player | null;
  transportMode: TransportMode | null;
  activeDeliveries: Delivery[];
  availableDeliveries: Delivery[];
  currentLocation: Location | null;
  isPlaying: boolean;
  
  // Actions
  setPlayer: (player: Player) => void;
  setTransportMode: (mode: TransportMode) => void;
  startPlaying: () => void;
  stopPlaying: () => void;
  updateLocation: (location: Location) => void;
  addToInventory: (item: Item) => void;
  removeFromInventory: (itemId: string) => void;
  updatePlayerStats: (distance: number, deliveryCompleted?: boolean) => void;
  updateRelationship: (characterId: string, points: number) => void;
}

type GameStateCreator = StateCreator<
  GameState,
  [["zustand/devtools", never], ["zustand/persist", unknown]]
>;

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      ((set) => ({
        player: null,
        transportMode: null,
        activeDeliveries: [],
        availableDeliveries: [],
        currentLocation: null,
        isPlaying: false,

        setPlayer: (player: Player) => set({ player }),
        
        setTransportMode: (mode: TransportMode) => set({ 
          transportMode: mode,
          availableDeliveries: [] 
        }),

        startPlaying: () => set({ isPlaying: true }),
        
        stopPlaying: () => set({ isPlaying: false }),

        updateLocation: (location: Location) => set({ currentLocation: location }),

        addToInventory: (item: Item) => set((state) => ({
          player: state.player ? {
            ...state.player,
            inventory: [...state.player.inventory, item]
          } : null
        })),

        removeFromInventory: (itemId: string) => set((state) => ({
          player: state.player ? {
            ...state.player,
            inventory: state.player.inventory.filter(item => item.id !== itemId)
          } : null
        })),

        updatePlayerStats: (distance: number, deliveryCompleted = false) => set((state) => ({
          player: state.player ? {
            ...state.player,
            stats: {
              ...state.player.stats,
              totalDistance: {
                daily: state.player.stats.totalDistance.daily + distance,
                weekly: state.player.stats.totalDistance.weekly + distance,
                allTime: state.player.stats.totalDistance.allTime + distance,
              },
              totalDeliveries: deliveryCompleted ? {
                daily: state.player.stats.totalDeliveries.daily + 1,
                weekly: state.player.stats.totalDeliveries.weekly + 1,
                allTime: state.player.stats.totalDeliveries.allTime + 1,
              } : state.player.stats.totalDeliveries
            }
          } : null
        })),

        updateRelationship: (characterId: string, points: number) => set((state) => ({
          player: state.player ? {
            ...state.player,
            relationships: {
              ...state.player.relationships,
              [characterId]: (state.player.relationships[characterId] || 0) + points
            }
          } : null
        })),
      })) as GameStateCreator,
      {
        name: 'delivery-witch-storage',
        partialize: (state) => ({
          player: state.player,
          activeDeliveries: state.activeDeliveries,
        }),
      }
    )
  )
) 