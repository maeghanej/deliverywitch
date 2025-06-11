import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Location } from '../types/Location';
import type { Character } from '../types/Character';
import { initialLocations } from '../data/initialLocations';
import { initialCharacters } from '../data/initialCharacters';

interface WorldState {
  locations: { [id: string]: Location };
  characters: { [id: string]: Character };
  discoveredLocations: Set<string>;
  metCharacters: Set<string>;
  
  // Location actions
  unlockLocation: (locationId: string) => void;
  updateLocation: (location: Location) => void;
  
  // Character actions
  unlockCharacter: (characterId: string) => void;
  updateCharacter: (character: Character) => void;
  increaseRelationship: (characterId: string, amount: number) => void;
  
  // Helper functions
  isLocationOpen: (locationId: string) => boolean;
  isCharacterPresent: (characterId: string, locationId: string) => boolean;
  getCharactersAtLocation: (locationId: string) => Character[];
}

export const useWorldStore = create<WorldState>()(
  persist(
    (set, get) => ({
      locations: initialLocations,
      characters: initialCharacters,
      discoveredLocations: new Set<string>(),
      metCharacters: new Set<string>(),

      unlockLocation: (locationId: string) => {
        set((state) => ({
          locations: {
            ...state.locations,
            [locationId]: {
              ...state.locations[locationId],
              unlocked: true
            }
          },
          discoveredLocations: new Set([...state.discoveredLocations, locationId])
        }));
      },

      updateLocation: (location: Location) => {
        set((state) => ({
          locations: {
            ...state.locations,
            [location.id]: location
          }
        }));
      },

      unlockCharacter: (characterId: string) => {
        set((state) => ({
          characters: {
            ...state.characters,
            [characterId]: {
              ...state.characters[characterId],
              unlocked: true
            }
          },
          metCharacters: new Set([...state.metCharacters, characterId])
        }));
      },

      updateCharacter: (character: Character) => {
        set((state) => ({
          characters: {
            ...state.characters,
            [character.id]: character
          }
        }));
      },

      increaseRelationship: (characterId: string, amount: number) => {
        const character = get().characters[characterId];
        if (!character) return;

        const newLevel = Math.min(100, character.relationshipLevel + amount);
        const newTier = Math.floor(newLevel / 20); // 20 points per tier

        set((state) => ({
          characters: {
            ...state.characters,
            [characterId]: {
              ...character,
              relationshipLevel: newLevel,
              relationshipTier: newTier
            }
          }
        }));
      },

      isLocationOpen: (locationId: string) => {
        const location = get().locations[locationId];
        if (!location) return false;

        const now = new Date();
        const day = now.getDay().toString();
        const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        const hours = location.openingHours[day];
        if (!hours) return false;

        return time >= hours.open && time <= hours.close;
      },

      isCharacterPresent: (characterId: string, locationId: string) => {
        const character = get().characters[characterId];
        if (!character) return false;

        const now = new Date();
        const day = now.getDay().toString();
        const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        const schedule = character.schedule[day];
        if (!schedule) return false;

        return schedule.locationId === locationId && 
               time >= schedule.start && 
               time <= schedule.end;
      },

      getCharactersAtLocation: (locationId: string) => {
        return Object.values(get().characters).filter(
          character => get().isCharacterPresent(character.id, locationId)
        );
      }
    }),
    {
      name: 'delivery-witch-world',
      partialize: (state) => ({
        discoveredLocations: Array.from(state.discoveredLocations),
        metCharacters: Array.from(state.metCharacters),
        characters: Object.fromEntries(
          Object.entries(state.characters).map(([id, char]) => [
            id,
            {
              ...char,
              schedule: char.schedule // Keep schedule for persistence
            }
          ])
        )
      })
    }
  )
); 