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

// Helper function to serialize dates in objects
const serializeDates = (obj: any): any => {
  if (!obj) return obj;
  const newObj = { ...obj };
  for (const key in newObj) {
    if (newObj[key] instanceof Date) {
      newObj[key] = newObj[key].toISOString();
    } else if (typeof newObj[key] === 'object') {
      newObj[key] = serializeDates(newObj[key]);
    }
  }
  return newObj;
};

// Helper function to deserialize dates in objects
const deserializeDates = (obj: any): any => {
  if (!obj) return obj;
  const newObj = { ...obj };
  for (const key in newObj) {
    if (typeof newObj[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(newObj[key])) {
      newObj[key] = new Date(newObj[key]);
    } else if (typeof newObj[key] === 'object') {
      newObj[key] = deserializeDates(newObj[key]);
    }
  }
  return newObj;
};

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
          const quest = state.activeQuest;
          if (!quest || quest.id !== questId) return state;

          return {
            activeQuest: null,
            completedQuests: [...state.completedQuests, {
              ...quest,
              status: QuestStatus.COMPLETED, // We removed FAILED status
              completedAt: new Date()
            }]
          };
        }),

        acceptDelivery: (delivery: Delivery) => set({
          activeDelivery: {
            ...delivery,
            status: DeliveryStatus.ACCEPTED,
            timeStarted: new Date()
          },
          deliveryProgress: {
            currentDistance: 0,
            totalDistance: delivery.distance,
            startTime: new Date(),
            lastUpdateTime: new Date(),
            averageSpeed: 0
          }
        }),

        updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus) => 
          set(state => {
            if (!state.activeDelivery || state.activeDelivery.id !== deliveryId) {
              return state;
            }

            return {
              activeDelivery: {
                ...state.activeDelivery,
                status,
                ...(status === DeliveryStatus.COMPLETED ? { timeCompleted: new Date() } : {})
              }
            };
          }),

        updateDeliveryProgress: (currentLocation: Location) => set(state => {
          if (!state.activeDelivery || !state.deliveryProgress) return state;

          const delivery = state.activeDelivery;
          const progress = state.deliveryProgress;
          const now = new Date();

          // Calculate new distance based on delivery status
          let newDistance = 0;
          if (delivery.status === DeliveryStatus.ACCEPTED) {
            newDistance = calculateDistance(
              currentLocation.coordinates,
              delivery.pickupLocation.coordinates
            );
          } else if (delivery.status === DeliveryStatus.PICKED_UP) {
            newDistance = calculateDistance(
              currentLocation.coordinates,
              delivery.dropoffLocation.coordinates
            );
          }

          // Calculate average speed
          const timeElapsed = (now.getTime() - progress.lastUpdateTime.getTime()) / 1000; // in seconds
          const distanceDelta = Math.abs(newDistance - progress.currentDistance);
          const currentSpeed = timeElapsed > 0 ? distanceDelta / timeElapsed : 0;
          const averageSpeed = (progress.averageSpeed + currentSpeed) / 2;

          // Estimate remaining time
          const remainingDistance = delivery.distance - newDistance;
          const estimatedTimeRemaining = averageSpeed > 0 
            ? remainingDistance / averageSpeed 
            : undefined;

          return {
            deliveryProgress: {
              currentDistance: newDistance,
              totalDistance: delivery.distance,
              estimatedTimeRemaining,
              startTime: progress.startTime,
              lastUpdateTime: now,
              averageSpeed
            }
          };
        }),

        generateNewQuests: (playerLocation: Location, transportMode: TransportMode) => {
          if (!transportMode) return;
          
          const newQuests = generateQuests(playerLocation, transportMode);
          set(state => ({
            availableQuests: [...state.availableQuests, ...newQuests]
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
            state.availableQuests = deserializeDates(state.availableQuests);
            state.completedQuests = deserializeDates(state.completedQuests);
            state.activeDelivery = deserializeDates(state.activeDelivery);
            state.deliveryProgress = deserializeDates(state.deliveryProgress);
          }
        }
      }
    )
  )
); 