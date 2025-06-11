import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { MovementDataPoint, MovementValidationResult } from '../types/MovementValidation';
import { validateMovement } from '../services/movementValidation';
import type { TransportMode } from '../../transport/stores/transportStore';

interface MovementState {
  recentPoints: MovementDataPoint[];
  validationResult: MovementValidationResult | null;
  isValidMovement: boolean;
  
  // Actions
  addMovementPoint: (point: MovementDataPoint, declaredMode: TransportMode) => void;
  clearMovementHistory: () => void;
  initializeValidation: (mode: TransportMode) => void;
}

const MAX_HISTORY_POINTS = 50; // Keep last 50 points for pattern detection

const createInitialValidationResult = (mode: TransportMode): MovementValidationResult => ({
  isValid: true,
  detectedMode: mode,
  issues: []
});

export const useMovementStore = create<MovementState>()(
  devtools(
    persist(
      (set, get) => ({
        recentPoints: [],
        validationResult: null,
        isValidMovement: true,

        initializeValidation: (mode: TransportMode) => set({
          validationResult: createInitialValidationResult(mode),
          isValidMovement: true
        }),

        addMovementPoint: (point: MovementDataPoint, declaredMode: TransportMode) => {
          const recentPoints = get().recentPoints;
          const updatedPoints = [...recentPoints, point].slice(-MAX_HISTORY_POINTS);
          
          const validationResult = validateMovement(point, recentPoints, declaredMode);
          
          set({
            recentPoints: updatedPoints,
            validationResult,
            isValidMovement: validationResult.isValid
          });

          return validationResult;
        },

        clearMovementHistory: () => set({
          recentPoints: [],
          validationResult: null,
          isValidMovement: true
        })
      }),
      {
        name: 'movement-store',
        partialize: (state) => ({
          validationResult: state.validationResult,
          isValidMovement: state.isValidMovement
        }),
        version: 1
      }
    )
  )
); 