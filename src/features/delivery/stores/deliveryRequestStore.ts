import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeliveryRequest, Villager, DeliveryItem } from '../types/DeliveryRequest';
import { VILLAGER_NAME_PARTS, LOCATION_DELIVERY_ITEMS } from '../types/DeliveryRequest';
import { nanoid } from 'nanoid';

interface DeliveryRequestState {
  activeRequests: DeliveryRequest[];
  
  // Actions
  generateNewRequest: (locationId: string) => DeliveryRequest | null;
  acceptRequest: (requestId: string) => void;
  completeRequest: (requestId: string) => void;
  removeRequest: (requestId: string) => void;
  cleanupExpiredRequests: () => void;
  getActiveRequestsForLocation: (locationId: string) => DeliveryRequest[];
}

const generateRandomVillager = (): Villager => {
  const firstName = VILLAGER_NAME_PARTS.firstNames[
    Math.floor(Math.random() * VILLAGER_NAME_PARTS.firstNames.length)
  ];
  const lastName = VILLAGER_NAME_PARTS.lastNames[
    Math.floor(Math.random() * VILLAGER_NAME_PARTS.lastNames.length)
  ];

  // Generate a random position within ~1km of the center (adjust coordinates as needed)
  const baseLng = -122.4194; // Example: San Francisco
  const baseLat = 37.7749;
  const lngOffset = (Math.random() - 0.5) * 0.02; // ~1km radius
  const latOffset = (Math.random() - 0.5) * 0.02;

  const personalityTraits = [
    'shy', 'outgoing', 'mysterious', 'cheerful', 'grumpy', 'eccentric',
    'wise', 'playful', 'serious', 'dreamy'
  ];
  const trait = personalityTraits[Math.floor(Math.random() * personalityTraits.length)];

  const villagerTypes = [
    'student', 'artist', 'scholar', 'gardener', 'musician',
    'poet', 'inventor', 'collector', 'traveler', 'dreamer'
  ];
  const type = villagerTypes[Math.floor(Math.random() * villagerTypes.length)];

  return {
    id: nanoid(),
    name: `${firstName} ${lastName}`,
    description: `A ${trait} ${type} seeking magical delivery.`,
    coordinates: [baseLng + lngOffset, baseLat + latOffset],
    deliveryMessage: generateDeliveryMessage(trait),
    thankYouMessage: generateThankYouMessage(trait),
  };
};

const generateDeliveryMessage = (trait: string): string => {
  const messages = {
    shy: "Oh! You found me... thank you for bringing this.",
    outgoing: "Hey there! Perfect timing with that delivery!",
    mysterious: "Ah, you've arrived with exactly what I needed...",
    cheerful: "Yay! My delivery is here! You're the best!",
    grumpy: "Finally! I've been waiting for ages...",
    eccentric: "Ooh, the magical aura of this delivery is simply perfect!",
    wise: "Your timing is most auspicious with this delivery.",
    playful: "What a delightful surprise! You're like a magical messenger!",
    serious: "Thank you for your prompt and professional delivery service.",
    dreamy: "Like a dream come true, my delivery has arrived..."
  };
  return messages[trait as keyof typeof messages] || messages.cheerful;
};

const generateThankYouMessage = (trait: string): string => {
  const messages = {
    shy: "T-thank you... this means a lot to me.",
    outgoing: "You're amazing! I'll definitely request more deliveries!",
    mysterious: "Your service will not be forgotten...",
    cheerful: "Thank you so much! You've made my day magical!",
    grumpy: "Well, at least you got it right. Thanks.",
    eccentric: "The stars aligned perfectly for this delivery!",
    wise: "Your dedication to the delivery arts is commendable.",
    playful: "That was fun! Let's do more magical deliveries soon!",
    serious: "Your service is greatly appreciated. Good day.",
    dreamy: "What a wonderful delivery experience..."
  };
  return messages[trait as keyof typeof messages] || messages.cheerful;
};

export const useDeliveryRequestStore = create<DeliveryRequestState>()(
  persist(
    (set, get) => ({
      activeRequests: [],

      generateNewRequest: (locationId: string) => {
        const availableItems = LOCATION_DELIVERY_ITEMS[locationId];
        if (!availableItems?.length) return null;

        const item = availableItems[Math.floor(Math.random() * availableItems.length)];
        const villager = generateRandomVillager();
        
        const request: DeliveryRequest = {
          id: nanoid(),
          villager,
          item,
          reward: Math.floor(Math.random() * 30) + 20, // 20-50 points
          active: true,
          accepted: false,
          completed: false,
          createdAt: new Date(),
          expiresAt: item.timeLimit 
            ? new Date(Date.now() + item.timeLimit * 60 * 1000)
            : undefined
        };

        set((state) => ({
          activeRequests: [...state.activeRequests, request]
        }));

        return request;
      },

      acceptRequest: (requestId: string) => {
        set((state) => ({
          activeRequests: state.activeRequests.map(request =>
            request.id === requestId
              ? { ...request, accepted: true }
              : request
          )
        }));
      },

      completeRequest: (requestId: string) => {
        set((state) => ({
          activeRequests: state.activeRequests.map(request =>
            request.id === requestId
              ? { ...request, completed: true, active: false }
              : request
          )
        }));
      },

      removeRequest: (requestId: string) => {
        set((state) => ({
          activeRequests: state.activeRequests.filter(request => 
            request.id !== requestId
          )
        }));
      },

      cleanupExpiredRequests: () => {
        const now = new Date();
        set((state) => ({
          activeRequests: state.activeRequests.filter(request => 
            !request.expiresAt || request.expiresAt > now
          )
        }));
      },

      getActiveRequestsForLocation: (locationId: string) => {
        return get().activeRequests.filter(request => 
          request.item.originLocationId === locationId && 
          request.active &&
          !request.completed
        );
      }
    }),
    {
      name: 'delivery-witch-requests',
      partialize: (state) => ({
        activeRequests: state.activeRequests.filter(request => 
          request.active && !request.completed
        )
      })
    }
  )
); 