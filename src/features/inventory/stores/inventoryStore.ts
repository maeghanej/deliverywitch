import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface InventoryItem {
  id: string
  name: string
  value: number
  origin: string // location ID where item came from
  destination: string // location ID where item goes
  pickupTime?: number
}

interface InventoryState {
  items: InventoryItem[]
  addItem: (item: InventoryItem) => void
  removeItem: (itemId: string) => void
  clearInventory: () => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (itemId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),
      clearInventory: () => set({ items: [] }),
    }),
    {
      name: 'delivery-inventory',
    }
  )
) 