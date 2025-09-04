import { create } from "zustand";

interface ChartState {
  startDate: Date | null;
  endDate: Date | null;
  setDates: (start: Date, end: Date) => void;
  meterIds: string[];
  setMeterIds: (id: string[]) => void;
}

export const useChartStore = create<ChartState>((set, get) => ({
  startDate: null,
  endDate: null,
  meterIds: [],
  setMeterIds: (ids: string[]) => {
    set({
      meterIds: ids?.length ? Array.from(new Set(ids)) : [],
    });
  },
  setDates: (start, end) => set({ startDate: start, endDate: end }),
}));
