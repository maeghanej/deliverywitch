import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { DeliveryStatus, QuestStatus } from '../types';
import type { Quest, Delivery, DeliveryProgress } from '../types';
import type { Location } from '../../../types';
import { calculateDistance } from '../utils/distance';
import { generateQuests } from '../utils/questGeneration';
import { calculateQuestMultiplier, type QuestMultiplierInfo } from '../utils/questMultiplier';
import type { TransportMode } from '../../transport/stores/transportStore';

interface DeliveryState {
  activeQuest: Quest | null;
  availableQuests: Quest[];
  completedQuests: Quest[];
  activeDelivery: Delivery | null;
  deliveryProgress: DeliveryProgress | null;
  multiplierInfo: QuestMultiplierInfo;
  
  // Quest Actions
  startQuest: (quest: Quest) => void;
  completeQuest: (questId: string) => void;
  failQuest: (questId: string) => void;
  
  // Delivery Actions
  acceptDelivery: (delivery: Delivery) => void;
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus) => void;
  updateDeliveryProgress: (currentLocation: Location) => void;
  
  // Quest Generation
  generateNewQuests: (playerLocation: Location, transportMode: TransportMode) => void;
}

// Helper function to serialize dates for storage
function serializeDates<T>(obj: T): T {
  if (!obj) return obj;
  if (obj instanceof Date) return obj.toISOString() as any;
  if (Array.isArray(obj)) return obj.map(serializeDates) as any;
  if (typeof obj === 'object') {
    const newObj = { ...obj };
    for (const key in newObj) {
      newObj[key] = serializeDates(newObj[key]);
    }
    return newObj;
  }
  return obj;
}

// Helper function to deserialize dates from storage
function deserializeDates<T>(obj: T): T {
  if (!obj) return obj;
  if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
    return new Date(obj) as any;
  }
  if (Array.isArray(obj)) return obj.map(deserializeDates) as any;
  if (typeof obj === 'object') {
    const newObj = { ...obj };
    for (const key in newObj) {
      newObj[key] = deserializeDates(newObj[key]);
    }
    return newObj;
  }
  return obj;
}

export const useDeliveryStore = create<DeliveryState>()(
  devtools(
    persist(
      (set, get) => ({
        activeQuest: null,
        availableQuests: [],
        completedQuests: [],
        activeDelivery: null,
        deliveryProgress: null,
        multiplierInfo: {
          currentMultiplier: 1.0,
          questsToNextTier: 1,
          nextTierMultiplier: 1.2,
          dailyQuestsCompleted: 0,
          streak: {
            daysThisWeek: 0,
            weeksThisMonth: 0,
            weeklyBonus: 0,
            monthlyBonus: 0
          }
        },

        startQuest: (quest: Quest) => set(state => ({
          activeQuest: {
            ...quest,
            status: QuestStatus.IN_PROGRESS,
            startedAt: new Date()
          },
          availableQuests: state.availableQuests.filter(q => q.id !== quest.id)
        })),

        completeQuest: (questId: string) => set(state => {
          const quest = state.activeQuest;
          if (!quest || quest.id !== questId) return state;

          // Apply multiplier to rewards
          const multiplierInfo = calculateQuestMultiplier(state.completedQuests);
          const multipliedReward = {
            ...quest.reward,
            gold: Math.round(quest.reward.gold * multiplierInfo.currentMultiplier)
          };

          const completedQuest = {
            ...quest,
            status: QuestStatus.COMPLETED,
            completedAt: new Date(),
            reward: multipliedReward
          };

          // Update state with new multiplier info
          const newMultiplierInfo = calculateQuestMultiplier([
            ...state.completedQuests,
            completedQuest
          ]);

          return {
            activeQuest: null,
            completedQuests: [...state.completedQuests, completedQuest],
            multiplierInfo: newMultiplierInfo
          };
        }),

        failQuest: (questId: string) => set(state => {
          if (!state.activeQuest || state.activeQuest.id !== questId) return state;
          return { activeQuest: null };
        }),

        acceptDelivery: (delivery: Delivery) => set({
          activeDelivery: {
            ...delivery,
            status: DeliveryStatus.ACCEPTED
          }
        }),

        updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus) => set(state => {
          if (!state.activeDelivery || state.activeDelivery.id !== deliveryId) return state;
          return {
            activeDelivery: {
              ...state.activeDelivery,
              status
            }
          };
        }),

        updateDeliveryProgress: (currentLocation: Location) => set(state => {
          if (!state.activeDelivery) return state;

          const { pickupLocation, dropoffLocation } = state.activeDelivery;
          const toPickup = calculateDistance(currentLocation.coordinates, pickupLocation.coordinates);
          const toDropoff = calculateDistance(currentLocation.coordinates, dropoffLocation.coordinates);

          return {
            deliveryProgress: {
              distanceToPickup: toPickup,
              distanceToDropoff: toDropoff,
              lastUpdated: new Date()
            }
          };
        }),

        generateNewQuests: (playerLocation: Location, transportMode: TransportMode) => {
          if (!transportMode) return;
          
          const newQuests = generateQuests(playerLocation, transportMode);
          if (!Array.isArray(newQuests)) {
            console.error('Failed to generate quests:', newQuests);
            return;
          }

          set(state => ({
            availableQuests: [...(Array.isArray(state.availableQuests) ? state.availableQuests : []), ...newQuests]
          }));
        }
      }),
      {
        name: 'delivery-store',
        partialize: (state) => ({
          activeQuest: serializeDates(state.activeQuest),
          availableQuests: serializeDates(state.availableQuests),
          completedQuests: serializeDates(state.completedQuests),
          activeDelivery: serializeDates(state.activeDelivery),
          deliveryProgress: serializeDates(state.deliveryProgress),
          multiplierInfo: state.multiplierInfo
        }),
        version: 1,
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.activeQuest = deserializeDates(state.activeQuest);
            state.availableQuests = deserializeDates(state.availableQuests) || [];
            state.completedQuests = deserializeDates(state.completedQuests) || [];
            state.activeDelivery = deserializeDates(state.activeDelivery);
            state.deliveryProgress = deserializeDates(state.deliveryProgress);
          }
        }
      }
    )
  )
); 