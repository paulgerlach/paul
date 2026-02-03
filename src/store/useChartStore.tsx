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
    }
  )
);
