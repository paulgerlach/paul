import { useMemo } from 'react';
import useSWR from 'swr';
import { MeterReadingType } from '@/api';
import { useChartStore } from '@/store/useChartStore';

/**
 * Unified dashboard data hook with SWR caching
 * Fetches all device types in a single API call, then filters client-side
 * 
 * Benefits:
 * - 1 API call instead of 5
 * - Automatic deduplication (60s window)
 * - Shared cache across components
 * - Automatic revalidation
 */

interface DashboardDataResult {
  coldWaterData: MeterReadingType[];
  hotWaterData: MeterReadingType[];
  electricityData: MeterReadingType[];
  heatData: MeterReadingType[];
  notificationsData: MeterReadingType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const fetchAllChartData = async (
  meterIds: string[],
  startDate?: Date | null,
  endDate?: Date | null
): Promise<MeterReadingType[]> => {
  if (!meterIds.length) {
    return [];
  }

  // For consumption calculations, fetch extra 7 days of data
  let adjustedStartDate = startDate;
  if (startDate) {
    adjustedStartDate = new Date(startDate);
    adjustedStartDate.setDate(adjustedStartDate.getDate() - 7);
  }

  const response = await fetch('/api/dashboard-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      meterIds,
      deviceTypes: [
        // OLD format
        'Heat', 'Water', 'WWater', 'Elec', 'HCA',
        // NEW Engelmann format
        'Stromzähler', 'Kaltwasserzähler', 'Warmwasserzähler', 
        'WMZ Rücklauf', 'Heizkostenverteiler', 'Wärmemengenzähler'
      ],
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

export const useDashboardData = (): DashboardDataResult => {
  const { meterIds, startDate, endDate } = useChartStore();

  // Create stable cache key
  const cacheKey = useMemo(() => {
    if (!meterIds.length) return null;
    return [
      'dashboard-data',
      meterIds.join(','),
      startDate?.toISOString() || 'null',
      endDate?.toISOString() || 'null'
    ];
  }, [meterIds, startDate, endDate]);

  // SWR with 60s deduplication window
  const { data: allData, error, mutate } = useSWR(
    cacheKey,
    () => fetchAllChartData(meterIds, startDate, endDate),
    {
      dedupingInterval: 60000, // 60 seconds
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3
    }
  );

  // Memoized filtering - only re-run when data changes
  const coldWaterData = useMemo(() => {
    if (!allData) return [];
    return allData.filter(d => 
      ['Water', 'Kaltwasserzähler'].includes(d['Device Type'])
    );
  }, [allData]);

  const hotWaterData = useMemo(() => {
    if (!allData) return [];
    return allData.filter(d => 
      ['WWater', 'Warmwasserzähler'].includes(d['Device Type'])
    );
  }, [allData]);

  const electricityData = useMemo(() => {
    if (!allData) return [];
    return allData.filter(d => 
      ['Elec', 'Stromzähler'].includes(d['Device Type'])
    );
  }, [allData]);

  const heatData = useMemo(() => {
    if (!allData) return [];
    return allData.filter(d => 
      ['Heat', 'HCA', 'WMZ Rücklauf', 'Heizkostenverteiler', 'Wärmemengenzähler'].includes(d['Device Type'])
    );
  }, [allData]);

  // Notifications needs all data (for error flags across all device types)
  const notificationsData = useMemo(() => {
    return allData || [];
  }, [allData]);

  return {
    coldWaterData,
    hotWaterData,
    electricityData,
    heatData,
    notificationsData,
    isLoading: !allData && !error,
    error: error?.message || null,
    refetch: () => mutate()
  };
};
