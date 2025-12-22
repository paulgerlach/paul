import { create } from "zustand";
import { createShareableUrl, ShareFilters } from "@/lib/shareUtils";
import { useChartStore } from "./useChartStore";

interface ShareStoreState {
  shareUrl: string;
  generateShareUrl: () => void;
  setShareUrl: (url: string) => void;
}

// Helper to format date as YYYY-MM-DD in local timezone (not UTC)
const formatLocalDate = (date: Date | null): string | undefined => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useShareStore = create<ShareStoreState>((set) => ({
  shareUrl: "",
  setShareUrl: (url) => set({ shareUrl: url }),
  generateShareUrl: () => {
    if (typeof window === "undefined") return; // Ensure it runs only on client

    const { startDate, endDate, meterIds } = useChartStore.getState();

    // Use local date formatting to avoid timezone issues
    const filters: ShareFilters = {
      meterIds: meterIds.length > 0 ? meterIds : undefined,
      startDate: formatLocalDate(startDate),
      endDate: formatLocalDate(endDate),
    };

    const url = createShareableUrl(filters, 720); // 30 days
    const fullUrl = `${window.location.origin}${url}`;
    set({ shareUrl: fullUrl });
  },
}));
