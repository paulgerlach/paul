import { useState, useEffect, useCallback } from "react";
import { MeterReadingType } from "@/api";
import { useChartStore } from "@/store/useChartStore";

export interface ChartDataHookResult {
  data: MeterReadingType[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const DEVICE_TYPES = {
  waterCold: ["Water", "Kaltwasserzähler"],
  waterHot: ["WWater", "Warmwasserzähler"],
  electricity: ["Elec", "Stromzähler"],
  heat: ["Heat", "WMZ Rücklauf", "Heizkostenverteiler", "Wärmemengenzähler"],
  notifications: [
    "Heat",
    "Water",
    "WWater",
    "Elec",
    "Stromzähler",
    "Kaltwasserzähler",
    "Warmwasserzähler",
    "WMZ Rücklauf",
    "Heizkostenverteiler",
  ],
} as const;

const fetchChartData = async (
  meterIds: string[],
  deviceTypes: string[],
  startDate?: Date | null,
  endDate?: Date | null,
): Promise<MeterReadingType[]> => {
  if (!meterIds.length || !deviceTypes.length) {
    return [];
  }

  // For consumption calculations (electricity, water, heat), we need the previous reading before startDate
  // Fetch extra data to ensure we have baseline readings for consumption calculation
  // This is crucial because consumption = current reading - previous reading
  let adjustedStartDate = startDate;
  if (startDate) {
    // Subtract 7 days to ensure we have previous readings available
    // This extra data is filtered out after consumption is calculated
    adjustedStartDate = new Date(startDate);
    adjustedStartDate.setDate(adjustedStartDate.getDate() - 7);
  }

  const response = await fetch("/api/dashboard-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      meterIds,
      deviceTypes,
      startDate: adjustedStartDate?.toISOString() || null,
      endDate: endDate?.toISOString() || null,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || [];
};

const useChartData = (deviceTypes: readonly string[]): ChartDataHookResult => {
  const { meterIds, startDate, endDate } = useChartStore();
  const [data, setData] = useState<MeterReadingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!meterIds.length) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const chartData = await fetchChartData(
        meterIds,
        [...deviceTypes],
        startDate,
        endDate,
      );
      setData(chartData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch chart data",
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [meterIds, deviceTypes, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export const useWaterChartData = (
  chartType: "cold" | "hot",
): ChartDataHookResult =>
  useChartData(
    chartType === "cold" ? DEVICE_TYPES.waterCold : DEVICE_TYPES.waterHot,
  );

export const useElectricityChartData = (): ChartDataHookResult =>
  useChartData(DEVICE_TYPES.electricity);

export const useHeatChartData = (): ChartDataHookResult =>
  useChartData(DEVICE_TYPES.heat);

export const useNotificationsChartData = (): ChartDataHookResult =>
  useChartData(DEVICE_TYPES.notifications);
