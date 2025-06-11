import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

interface MovementStatsState {
  daysThisWeek: number[];
  totalDistance: number;
  weeklyDistance: number;
  monthlyDistance: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null;
  
  // Actions
  addDistance: (distance: number) => void;
  updateStreak: () => void;
  resetStats: () => void;
}

const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');

const createEmptyStats = () => ({
  daysThisWeek: Array(7).fill(0), // Initialize with zeros for each day
  totalDistance: 0,
  weeklyDistance: 0,
  monthlyDistance: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: null
});

export const useMovementStatsStore = create<MovementStatsState>()(
  persist(
    (set, get) => ({
      ...createEmptyStats(),

      addDistance: (distance: number) => set(state => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const newDaysThisWeek = [...state.daysThisWeek];
        newDaysThisWeek[dayOfWeek] += distance;

        return {
          daysThisWeek: newDaysThisWeek,
          totalDistance: state.totalDistance + distance,
          weeklyDistance: state.weeklyDistance + distance,
          monthlyDistance: state.monthlyDistance + distance,
          lastActiveDate: getCurrentDate()
        };
      }),

      updateStreak: () => set(state => {
        const today = getCurrentDate();
        if (!state.lastActiveDate) {
          return {
            currentStreak: 1,
            bestStreak: 1,
            lastActiveDate: today
          };
        }

        const lastActive = new Date(state.lastActiveDate);
        const currentDate = new Date(today);
        const daysDiff = Math.floor((currentDate.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          // Consecutive day
          const newStreak = state.currentStreak + 1;
          return {
            currentStreak: newStreak,
            bestStreak: Math.max(newStreak, state.bestStreak),
            lastActiveDate: today
          };
        } else if (daysDiff === 0) {
          // Same day, no streak change
          return state;
        } else {
          // Streak broken
          return {
            currentStreak: 1,
            bestStreak: state.bestStreak,
            lastActiveDate: today
          };
        }
      }),

      resetStats: () => set(createEmptyStats)
    }),
    {
      name: 'movement-stats',
      // Persist all fields except functions
      partialize: (state) => ({
        daysThisWeek: state.daysThisWeek,
        totalDistance: state.totalDistance,
        weeklyDistance: state.weeklyDistance,
        monthlyDistance: state.monthlyDistance,
        currentStreak: state.currentStreak,
        bestStreak: state.bestStreak,
        lastActiveDate: state.lastActiveDate
      }),
      // Add version for future migrations if needed
      version: 1
    }
  )
); 