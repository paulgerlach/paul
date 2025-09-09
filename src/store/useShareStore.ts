import { create } from "zustand";
import { createShareableUrl, ShareFilters } from "@/lib/shareUtils";
import { useChartStore } from "./useChartStore";

interface ShareStoreState {
  shareUrl: string;
  generateShareUrl: () => void;
  setShareUrl: (url: string) => void;
}

export const useShareStore = create<ShareStoreState>((set) => ({
  shareUrl: "",
  setShareUrl: (url) => set({ shareUrl: url }),
  generateShareUrl: () => {
    if (typeof window === "undefined") return; // Ensure it runs only on client

    const { startDate, endDate, meterIds } = useChartStore.getState();

    const filters: ShareFilters = {
      meterIds: meterIds.length > 0 ? meterIds : undefined,
      startDate: startDate?.toISOString().split("T")[0],
      endDate: endDate?.toISOString().split("T")[0],
    };

    const url = createShareableUrl(filters, 720); // 30 days
    const fullUrl = `${window.location.origin}${url}`;
    set({ shareUrl: fullUrl });
  },
}));
