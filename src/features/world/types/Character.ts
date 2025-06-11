export type CharacterRole = 'shopkeeper' | 'chef' | 'barista' | 'librarian' | 'merchant' | 'baker';

export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  locationId: string; // Reference to their primary location
  description: string;
  personality: string[];  // personality traits
  likes: string[];       // things they like
  dislikes: string[];    // things they dislike
  schedule: {
    [key: string]: { // day of week (0-6)
      start: string; // HH:mm format
      end: string;
      locationId: string;
    };
  };
  imageUrl?: string;
  unlocked: boolean;
  relationshipLevel: number; // 0-100
  relationshipTier: number; // 0-5 (stranger to best friend)
  // Dialogue options will be handled separately
} 