import { useState, useEffect, useCallback } from 'react';
import { MeterReadingType } from '@/api';
import { useChartStore } from '@/store/useChartStore';

export interface ChartDataHookResult {
  data: MeterReadingType[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const fetchChartData = async (
  meterIds: string[],
  deviceTypes: string[],
  startDate?: Date | null,
  endDate?: Date | null
): Promise<MeterReadingType[]> => {
  if (!meterIds.length || !deviceTypes.length) {
    return [];
  }

  const response = await fetch('/api/dashboard-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      meterIds,
      deviceTypes,
      startDate: startDate?.toISOString() || null,
      endDate: endDate?.toISOString() || null,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || [];
};

export const useWaterChartData = (chartType: 'cold' | 'hot'): ChartDataHookResult => {
  const { meterIds, startDate, endDate } = useChartStore();
  const [data, setData] = useState<MeterReadingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deviceType = chartType === 'cold' ? 'Water' : 'WWater';

  const fetchData = useCallback(async () => {
    if (!meterIds.length) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const chartData = await fetchChartData(meterIds, [deviceType], startDate, endDate);
      setData(chartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch water data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [meterIds, deviceType, startDate, endDate]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useElectricityChartData = (): ChartDataHookResult => {
  const { meterIds, startDate, endDate } = useChartStore();
  const [data, setData] = useState<MeterReadingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!meterIds.length) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const chartData = await fetchChartData(meterIds, ['Elec'], startDate, endDate);
      setData(chartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch electricity data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [meterIds, startDate, endDate]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useHeatChartData = (): ChartDataHookResult => {
  const { meterIds, startDate, endDate } = useChartStore();
  const [data, setData] = useState<MeterReadingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!meterIds.length) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const chartData = await fetchChartData(meterIds, ['Heat'], startDate, endDate);
      setData(chartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch heat data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [meterIds, startDate, endDate]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useNotificationsChartData = (): ChartDataHookResult => {
  const { meterIds, startDate, endDate } = useChartStore();
  const [data, setData] = useState<MeterReadingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!meterIds.length) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Notifications chart needs all device types
      const chartData = await fetchChartData(meterIds, ['Heat', 'Water', 'WWater', 'Elec'], startDate, endDate);
      setData(chartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [meterIds, startDate, endDate]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

