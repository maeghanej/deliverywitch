import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Interaction, InteractionType } from '../types/Interaction';
import { useWorldStore } from './worldStore';
import { TIME_PERIODS, BASE_INTERACTION_POINTS } from '../types/Interaction';

interface InteractionState {
  // Daily interaction tracking
  dailyInteractions: {
    [characterId: string]: {
      [type in InteractionType]?: number;
    };
  };
  
  // Available interactions
  availableInteractions: Interaction[];
  
  // Actions
  trackInteraction: (characterId: string, type: InteractionType) => void;
  canInteract: (characterId: string, type: InteractionType) => boolean;
  getCurrentTimePeriod: () => keyof typeof TIME_PERIODS;
  getAvailableInteractions: (characterId: string) => Interaction[];
  addInteraction: (interaction: Interaction) => void;
  removeInteraction: (characterId: string, type: InteractionType) => void;
}

export const useInteractionStore = create<InteractionState>()(
  persist(
    (set, get) => ({
      dailyInteractions: {},
      availableInteractions: [],

      trackInteraction: (characterId: string, type: InteractionType) => {
        set((state) => ({
          dailyInteractions: {
            ...state.dailyInteractions,
            [characterId]: {
              ...state.dailyInteractions[characterId],
              [type]: (state.dailyInteractions[characterId]?.[type] || 0) + 1
            }
          }
        }));
      },

      canInteract: (characterId: string, type: InteractionType) => {
        const dailyLimit = {
          chat: 3,
          delivery: 5,
          gift: 1,
          help: 2,
          special: 1
        }[type];

        const currentCount = get().dailyInteractions[characterId]?.[type] || 0;
        return currentCount < dailyLimit;
      },

      getCurrentTimePeriod: () => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        return Object.entries(TIME_PERIODS).find(([_, period]) => 
          currentTime >= period.start && currentTime <= period.end
        )?.[0] as keyof typeof TIME_PERIODS || 'morning';
      },

      getAvailableInteractions: (characterId: string) => {
        const character = useWorldStore.getState().characters[characterId];
        if (!character || !character.unlocked) return [];

        const currentTime = get().getCurrentTimePeriod();
        
        return get().availableInteractions.filter(interaction => {
          if (interaction.characterId !== characterId) return false;
          if (!get().canInteract(characterId, interaction.type)) return false;

          const requirements = interaction.requirements || {};
          
          // Check relationship tier requirement
          if (requirements.minRelationshipTier !== undefined && 
              character.relationshipTier < requirements.minRelationshipTier) {
            return false;
          }

          // Check time of day requirement
          if (requirements.timeOfDay && 
              !requirements.timeOfDay.includes(currentTime)) {
            return false;
          }

          // Check location requirement
          if (requirements.locationId && 
              !useWorldStore.getState().isCharacterPresent(characterId, requirements.locationId)) {
            return false;
          }

          return true;
        });
      },

      addInteraction: (interaction: Interaction) => {
        set((state) => ({
          availableInteractions: [...state.availableInteractions, interaction]
        }));
      },

      removeInteraction: (characterId: string, type: InteractionType) => {
        set((state) => ({
          availableInteractions: state.availableInteractions.filter(
            interaction => !(interaction.characterId === characterId && interaction.type === type)
          )
        }));
      }
    }),
    {
      name: 'delivery-witch-interactions',
      partialize: (state) => ({
        dailyInteractions: state.dailyInteractions
      })
    }
  )
); 