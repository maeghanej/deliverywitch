import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MovementStats, SessionStats, DailyStats, AllTimeStats } from '../types/MovementStats';
import { format } from 'date-fns';

type TransportMode = 'WALKING' | 'BIKING';

interface MovementStatsState {
  stats: MovementStats;
  
  // Session actions
  startSession: (mode: TransportMode) => void;
  endSession: () => void;
  updateSessionStats: (distance: number, speed: number, latitude: number, longitude: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  
  // Stats actions
  addDeliveryCompleted: () => void;
  checkAchievements: () => void;
}

const createEmptySessionStats = (mode: TransportMode): SessionStats => ({
  startTime: Date.now(),
  endTime: null,
  totalDistance: 0,
  activeTime: 0,
  pauseTime: 0,
  averageSpeed: 0,
  topSpeed: 0,
  currentSpeed: 0,
  speedHistory: [],
  transportMode: mode
});

const createEmptyDailyStats = (): DailyStats => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  totalDistance: 0,
  activeTime: 0,
  deliveriesCompleted: 0,
  byTransportMode: {
    WALKING: { distance: 0, activeTime: 0 },
    BIKING: { distance: 0, activeTime: 0 }
  }
});

const createEmptyAllTimeStats = (): AllTimeStats => ({
  totalDistance: 0,
  totalActiveTime: 0,
  totalDeliveries: 0,
  byTransportMode: {
    WALKING: { distance: 0, activeTime: 0, deliveries: 0 },
    BIKING: { distance: 0, activeTime: 0, deliveries: 0 }
  },
  achievements: []
});

export const useMovementStatsStore = create<MovementStatsState>()(
  persist(
    (set, get) => ({
      stats: {
        session: createEmptySessionStats('WALKING'),
        daily: createEmptyDailyStats(),
        allTime: createEmptyAllTimeStats()
      },

      startSession: (mode: TransportMode) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        set(state => ({
          stats: {
            ...state.stats,
            session: createEmptySessionStats(mode),
            // Reset daily stats if it's a new day
            daily: state.stats.daily.date === today 
              ? state.stats.daily 
              : createEmptyDailyStats()
          }
        }));
      },

      endSession: () => {
        const { stats } = get();
        const { session, daily, allTime } = stats;
        const mode = session.transportMode;

        // Update daily stats
        const updatedDaily: DailyStats = {
          ...daily,
          totalDistance: daily.totalDistance + session.totalDistance,
          activeTime: daily.activeTime + session.activeTime,
          byTransportMode: {
            ...daily.byTransportMode,
            [mode]: {
              distance: daily.byTransportMode[mode].distance + session.totalDistance,
              activeTime: daily.byTransportMode[mode].activeTime + session.activeTime
            }
          }
        };

        // Update all-time stats
        const updatedAllTime: AllTimeStats = {
          ...allTime,
          totalDistance: allTime.totalDistance + session.totalDistance,
          totalActiveTime: allTime.totalActiveTime + session.activeTime,
          byTransportMode: {
            ...allTime.byTransportMode,
            [mode]: {
              distance: allTime.byTransportMode[mode].distance + session.totalDistance,
              activeTime: allTime.byTransportMode[mode].activeTime + session.activeTime,
              deliveries: allTime.byTransportMode[mode].deliveries
            }
          }
        };

        set(state => ({
          stats: {
            ...state.stats,
            session: {
              ...session,
              endTime: Date.now()
            },
            daily: updatedDaily,
            allTime: updatedAllTime
          }
        }));
      },

      updateSessionStats: (distance: number, speed: number, latitude: number, longitude: number) => {
        const { stats } = get();
        const { session } = stats;
        const now = Date.now();
        const timeDiff = (now - session.startTime) / 1000; // seconds

        const speedRecord = {
          timestamp: now,
          speed,
          latitude,
          longitude
        };

        set(state => ({
          stats: {
            ...state.stats,
            session: {
              ...session,
              totalDistance: session.totalDistance + distance,
              activeTime: timeDiff - session.pauseTime,
              currentSpeed: speed,
              averageSpeed: (session.totalDistance + distance) / (timeDiff - session.pauseTime),
              topSpeed: Math.max(session.topSpeed, speed),
              speedHistory: [...session.speedHistory, speedRecord].slice(-100) // Keep last 100 records
            }
          }
        }));
      },

      pauseSession: () => {
        set(state => ({
          stats: {
            ...state.stats,
            session: {
              ...state.stats.session,
              pauseTime: state.stats.session.pauseTime + 
                (Date.now() - (state.stats.session.startTime + state.stats.session.activeTime * 1000)) / 1000
            }
          }
        }));
      },

      resumeSession: () => {
        // No need to do anything special on resume, the next updateSessionStats will handle it
      },

      addDeliveryCompleted: () => {
        const { stats } = get();
        const { session, daily, allTime } = stats;
        const mode = session.transportMode;

        set(state => ({
          stats: {
            ...state.stats,
            daily: {
              ...daily,
              deliveriesCompleted: daily.deliveriesCompleted + 1
            },
            allTime: {
              ...allTime,
              totalDeliveries: allTime.totalDeliveries + 1,
              byTransportMode: {
                ...allTime.byTransportMode,
                [mode]: {
                  ...allTime.byTransportMode[mode],
                  deliveries: allTime.byTransportMode[mode].deliveries + 1
                }
              }
            }
          }
        }));

        get().checkAchievements();
      },

      checkAchievements: () => {
        // TODO: Implement achievement checks based on stats
        // This will check for distance milestones, speed records, delivery counts, etc.
      }
    }),
    {
      name: 'movement-stats',
      partialize: (state) => ({
        stats: {
          daily: state.stats.daily,
          allTime: state.stats.allTime
        }
      })
    }
  )
); 