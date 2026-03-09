import { create } from "zustand";
import { createShareableUrl, ShareFilters } from "@/lib/shareUtils";
import { useChartStore } from "./useChartStore";

interface ShareStoreState {
  shareUrl: string;
  generateShareUrl: () => void;
  setShareUrl: (url: string) => void;
}

// Helper to safely convert date to ISO string
// Defensively handles strings (from Zustand persist rehydration) in addition to Date objects.
const toISOString = (date: Date | string | null | undefined): string | undefined => {
  if (!date) return undefined;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString(); // Full UTC timestamp e.g., "2025-08-31T22:00:00.000Z"
};

export const useShareStore = create<ShareStoreState>((set) => ({
  shareUrl: "",
  setShareUrl: (url) => set({ shareUrl: url }),
  generateShareUrl: () => {
    if (typeof window === "undefined") return; // Ensure it runs only on client

    const { startDate, endDate, meterIds } = useChartStore.getState();

    // FIX: Use ISO timestamps to preserve exact UTC time - this ensures tenant sees
    // identical data regardless of their timezone
    const filters: ShareFilters = {
      meterIds: meterIds.length > 0 ? meterIds : undefined,
      startDate: toISOString(startDate),
      endDate: toISOString(endDate),
    };

    const url = createShareableUrl(filters, 720); // 30 days
    const fullUrl = `${window.location.origin}${url}`;
    set({ shareUrl: fullUrl });
  },
}));
