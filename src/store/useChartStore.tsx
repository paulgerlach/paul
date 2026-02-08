import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChartState {
  startDate: Date | null;
  endDate: Date | null;
  setDates: (start: Date, end: Date) => void;
  meterIds: string[];
  setMeterIds: (id: string[]) => void;
  chartHeights: Record<string, number>;

  setChartHeight: (key: string, height: number) => void;
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

      chartHeights: {},

      setChartHeight: (key, height) =>
        set((state) => ({
          chartHeights: {
            ...state.chartHeights,
            [key]: height,
          },
        })),

      isTableView: false,
  setMeterIds: (ids: string[]) => {
        set({
          meterIds: ids?.length ? Array.from(new Set(ids)) : [],
        });
      },

      setDates: (start, end) => set({ startDate: start, endDate: end }),
  setIsTableView: (isTable: boolean) => set({ isTableView: isTable }),
    }),
    {
      name: "dashboard-chart-layout",
      // Convert date strings back to Date objects after rehydration from localStorage
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<ChartState>;
        return {
          ...currentState,
          ...persisted,
          startDate: toDateOrNull(persisted.startDate),
          endDate: toDateOrNull(persisted.endDate),
        };
      },
    }
  )
);
