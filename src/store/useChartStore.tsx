import { create } from "zustand";
import { MeterReadingType } from "@/api";
import { DashboardDataResponse, DashboardDataRequest } from "@/app/api/dashboard-data/route";

interface ChartState {
  // Date and meter selection
  startDate: Date | null;
  endDate: Date | null;
  meterIds: string[];
  
  // Data state
  data: MeterReadingType[];
  metadata: DashboardDataResponse['metadata'] | null;
  loading: boolean;
  error: string | null;
  lastFetchParams: string | null; // Cache key for avoiding duplicate fetches
  
  // Actions
  setDates: (start: Date, end: Date) => void;
  setMeterIds: (ids: string[]) => void;
  fetchData: () => Promise<void>;
  clearData: () => void;
  clearError: () => void;
}

export const useChartStore = create<ChartState>((set, get) => ({
  // Initial state
  startDate: null,
  endDate: null,
  meterIds: [],
  data: [],
  metadata: null,
  loading: false,
  error: null,
  lastFetchParams: null,

  // Actions
  setMeterIds: (ids: string[]) => {
    const uniqueIds = ids?.length ? Array.from(new Set(ids)) : [];
    set({ meterIds: uniqueIds });
    
    // Auto-fetch data when meter IDs change
    if (uniqueIds.length > 0) {
      setTimeout(() => get().fetchData(), 0);
    }
  },

  setDates: (start: Date, end: Date) => {
    set({ startDate: start, endDate: end });
    
    // Auto-fetch data when dates change and we have meter IDs
    const { meterIds } = get();
    if (meterIds.length > 0) {
      setTimeout(() => get().fetchData(), 0);
    }
  },

  fetchData: async () => {
    const { meterIds, startDate, endDate, lastFetchParams } = get();
    
    // Don't fetch if no meter IDs
    if (!meterIds.length) {
      set({ data: [], metadata: null, error: null });
      return;
    }

    // Create cache key to avoid duplicate fetches
    const fetchParams = JSON.stringify({
      meterIds: meterIds.sort(),
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString()
    });

    // Skip if same parameters as last fetch
    if (fetchParams === lastFetchParams) {
      return;
    }

    set({ loading: true, error: null });

    try {
      // Build request body
      const requestBody: DashboardDataRequest = {
        meterIds,
        startDate: startDate?.toISOString() || null,
        endDate: endDate?.toISOString() || null
      };

      const response = await fetch('/api/dashboard-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: DashboardDataResponse = await response.json();
      
      set({
        data: result.data,
        metadata: result.metadata,
        loading: false,
        error: null,
        lastFetchParams: fetchParams
      });

    } catch (error) {
      console.error('Error fetching chart data:', error);
      set({
        data: [],
        metadata: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        lastFetchParams: null
      });
    }
  },

  clearData: () => {
    set({
      data: [],
      metadata: null,
      error: null,
      lastFetchParams: null
    });
  },

  clearError: () => {
    set({ error: null });
  }
}));
