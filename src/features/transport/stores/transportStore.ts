import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type TransportMode = 'WALKING' | 'BIKING' | null;

interface TransportState {
  mode: TransportMode;
  setMode: (mode: TransportMode) => void;
}

export const useTransportStore = create<TransportState>()(
  devtools(
    (set) => ({
      mode: null,
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'transport-store',
    }
  )
); 