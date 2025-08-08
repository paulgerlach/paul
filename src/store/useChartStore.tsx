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
    const current = get().meterIds;
    if (ids.every((id) => current.includes(id))) {
      set({
        meterIds: current.filter((id) => !ids.includes(id)),
      });
    } else {
      set({
        meterIds: Array.from(new Set([...current, ...ids])),
      });
    }
  },
  setDates: (start, end) => set({ startDate: start, endDate: end }),
}));
