export type LocationType = 'restaurant' | 'cafe' | 'shop' | 'market' | 'bakery' | 'library';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  openingHours: {
    [key: string]: { // day of week (0-6)
      open: string; // HH:mm format
      close: string;
    };
  };
  imageUrl?: string;
  specialties?: string[]; // e.g., ["Coffee", "Pastries"] for a cafe
  unlocked: boolean;
} 