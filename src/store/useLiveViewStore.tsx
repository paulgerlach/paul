"use client";

import { create } from "zustand";

interface LiveViewState {
  isLiveView: boolean;
  toggleLiveView: () => void;
  setLiveView: (isLive: boolean) => void;
}

export const useLiveViewStore = create<LiveViewState>((set) => ({
  isLiveView: false,
  toggleLiveView: () => set((state) => ({ isLiveView: !state.isLiveView })),
  setLiveView: (isLive: boolean) => set({ isLiveView: isLive }),
}));
