import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { DeliveryStatus, QuestStatus } from '../types';
import type { Quest, Delivery, DeliveryProgress } from '../types';
import type { Location } from '../../../types';
import { calculateDistance } from '../utils/distance';

interface DeliveryState {
  activeQuest: Quest | null;
  availableQuests: Quest[];
  completedQuests: Quest[];
  activeDelivery: Delivery | null;
  deliveryProgress: DeliveryProgress | null;
  
  // Quest Actions
  startQuest: (quest: Quest) => void;
  completeQuest: (questId: string) => void;
  failQuest: (questId: string) => void;
  
  // Delivery Actions
  acceptDelivery: (delivery: Delivery) => void;
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus) => void;
  updateDeliveryProgress: (currentLocation: Location) => void;
  
  // Quest Generation
  generateNewQuests: (playerLocation: Location, transportMode: 'WALKING' | 'BIKING') => void;
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

          return {
            activeQuest: null,
            completedQuests: [...state.completedQuests, {
              ...quest,
              status: QuestStatus.COMPLETED,
              completedAt: new Date()
            }]
          };
        }),

        failQuest: (questId: string) => set(state => {
          const quest = state.activeQuest;
          if (!quest || quest.id !== questId) return state;

          return {
            activeQuest: null,
            completedQuests: [...state.completedQuests, {
              ...quest,
              status: QuestStatus.FAILED,
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

        generateNewQuests: (playerLocation: Location, transportMode: 'WALKING' | 'BIKING') => {
          // This would be implemented with your quest generation logic
          // For now it's a placeholder
          console.log('Generating quests for', transportMode, 'at', playerLocation);
        }
      }),
      {
        name: 'delivery-store',
        partialize: (state) => ({
          completedQuests: state.completedQuests,
        }),
      }
    )
  )
); 