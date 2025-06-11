import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type TransportMode = 'WALKING' | 'BIKING' | null;

interface TransportState {
  mode: TransportMode;
  setMode: (mode: TransportMode) => void;
}

export const useTransportStore = create<TransportState>()(
  devtools(
    persist(
      (set) => ({
        mode: null,
        setMode: (mode) => set({ mode }),
      }),
      {
        name: 'transport-store',
        partialize: (state) => ({
          mode: state.mode
        }),
        version: 1
      }
    )
  )
); 