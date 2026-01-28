import { create } from "zustand";

interface TourState {
  run: boolean;
  setRun: (run: boolean) => void;
}

export const useTourStore = create<TourState>((set) => ({
  run: false,
  setRun: (run) => set({ run }),
}));
