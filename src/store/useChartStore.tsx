
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChartState {
  startDate: Date | null;
  endDate: Date | null;
  setDates: (start: Date, end: Date) => void;
  meterIds: string[];
  setMeterIds: (id: string[]) => void;
  

  chartSizes: Record<string, { height: number; width?: number }>;
  setChartSize: (key: string, size: { width: number; height: number }) => void;

  isTableView: boolean;
  setIsTableView: (isTable: boolean) => void;
}

// Helper to safely convert a value to a Date or null.
// Zustand persist serializes Date objects as ISO strings via JSON.stringify.
// On rehydration, JSON.parse leaves them as strings, so we must convert them back.
const toDateOrNull = (value: unknown): Date | null => {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

export const useChartStore = create<ChartState>()(
  persist(
    (set) => ({
      startDate: null,
      endDate: null,
      meterIds: [],

      chartSizes: {},

      setChartSize: (key, size) =>
        set((state) => ({
          chartSizes: {
            ...state.chartSizes,
            [key]: size,
          },
        })),

      isTableView: false,
  setMeterIds: (ids: string[]) => {
        const normalized = ids?.length ? Array.from(new Set(ids)).sort() : [];
        set({ meterIds: normalized });
      },

      setDates: (start, end) => set({ startDate: start, endDate: end }),
  setIsTableView: (isTable: boolean) => set({ isTableView: isTable }),
    }),
    {
      name: "dashboard-chart-layout",
      // Exclude meterIds from persist - they are user-specific; persisting causes wrong data when admin switches customers
      partialize: (state) => ({
        startDate: state.startDate,
        endDate: state.endDate,
        chartSizes: state.chartSizes,
        isTableView: state.isTableView,
      }),
      // Convert date strings back to Date objects after rehydration from localStorage
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<ChartState>;
        return {
          ...currentState,
          ...persisted,
          meterIds: [], // Always start empty; AdminApartmentsDropdown populates from current user's apartments
          startDate: toDateOrNull(persisted.startDate),
          endDate: toDateOrNull(persisted.endDate),
        };
      },
    }
  )
);
