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

  const fetchData = useCallback(async () => {
    if (!meterIds.length) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Support both OLD format ('Water', 'WWater') and NEW format ('Kaltwasserzähler', 'Warmwasserzähler')
      const deviceTypes = chartType === 'cold' 
        ? ['Water', 'Kaltwasserzähler'] 
        : ['WWater', 'Warmwasserzähler'];
      
      const chartData = await fetchChartData(meterIds, deviceTypes, startDate, endDate);
      setData(chartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch water data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [meterIds, chartType, startDate, endDate]);

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
      // Support both OLD format ('Elec') and NEW format ('Stromzähler')
      const chartData = await fetchChartData(meterIds, ['Elec', 'Stromzähler'], startDate, endDate);
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
      // Support both OLD format ('Heat') and NEW format ('WMZ Rücklauf', 'Heizkostenverteiler')
      const chartData = await fetchChartData(
        meterIds, 
        ['Heat', 'WMZ Rücklauf', 'Heizkostenverteiler'], 
        startDate, 
        endDate
      );
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
      // Notifications chart needs all device types (both old and new format names)
      const chartData = await fetchChartData(
        meterIds, 
        [
          'Heat', 'Water', 'WWater', 'Elec',  // OLD format
          'Stromzähler', 'Kaltwasserzähler', 'Warmwasserzähler', 'WMZ Rücklauf', 'Heizkostenverteiler'  // NEW format
        ], 
        startDate, 
        endDate
      );
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

