import { create } from 'zustand';

interface ChartState {
    startDate: Date | null;
    endDate: Date | null;
    setDates: (start: Date, end: Date) => void;
}

export const useChartStore = create<ChartState>((set) => ({
    startDate: null,
    endDate: null,
    setDates: (start, end) => set({ startDate: start, endDate: end }),
}));