"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseSharedUrl, DashboardFilters } from '@/lib/shareUtils';
import { parseCSV } from '@/api';
import { useChartStore } from '@/store/useChartStore';
import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import GaugeChart from "@/components/Basic/Charts/GaugeChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import NotificationsChart from "@/components/Basic/Charts/NotificationsChart";
import WaterChart from "@/components/Basic/Charts/WaterChart";

export default function SharedDashboardClient() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<DashboardFilters | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { setDates, setMeterIds } = useChartStore();

  useEffect(() => {
    const parsedFilters = parseSharedUrl(searchParams);
    
    if (!parsedFilters) {
      setError('Invalid shared link');
      setLoading(false);
      return;
    }

    setFilters(parsedFilters);
    
    // Apply filters to chart store
    if (parsedFilters.startDate && parsedFilters.endDate) {
      setDates(new Date(parsedFilters.startDate), new Date(parsedFilters.endDate));
    }
    
    if (parsedFilters.meterIds.length > 0) {
      setMeterIds(parsedFilters.meterIds);
    }

    // Load dashboard data
    loadDashboardData();
  }, [searchParams, setDates, setMeterIds]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await parseCSV();
      
      if (!data) {
        throw new Error('Failed to load dashboard data');
      }

      const filteredData = data.filter(
        (item) => item["Device Type"] !== "Device Type"
      );
      
      setDashboardData({
        heatDevices: filteredData.filter((item) => item["Device Type"] === "Heat"),
        coldWaterDevices: filteredData.filter((item) => item["Device Type"] === "Water"),
        hotWaterDevices: filteredData.filter((item) => item["Device Type"] === "WWater"),
      });
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-yellow-800 font-medium">No Data</h3>
        <p className="text-yellow-600 mt-1">No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Info Display */}
      {filters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-medium mb-2">Applied Filters</h3>
          <div className="text-sm text-blue-600 space-y-1">
            {filters.startDate && filters.endDate && (
              <p>Date Range: {filters.startDate} to {filters.endDate}</p>
            )}
            {filters.meterIds.length > 0 && (
              <p>Selected Meters: {filters.meterIds.length} meter(s)</p>
            )}
            <p className="text-xs text-blue-500 mt-2">
              🔒 Read-only view - filters cannot be changed
            </p>
          </div>
        </div>
      )}
      
      {/* Dashboard Charts */}
      <div className="grid grid-cols-3 gap-2 grid-rows-10">
        <WaterChart
          csvText={dashboardData.coldWaterDevices}
          color="#6083CC"
          title="Kaltwasser"
          chartType="cold"
        />
        <GaugeChart />
        <NotificationsChart />
        <HeatingCosts csvText={dashboardData.heatDevices} />
        <WaterChart
          csvText={dashboardData.hotWaterDevices}
          color="#E74B3C"
          title="Warmwasser"
          chartType="hot"
        />
        <EinsparungChart />
      </div>
      
      {/* Watermark */}
      <div className="text-center py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Powered by Heidi Systems - Dashboard shared on {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

