"use client";

import { useEffect, useMemo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import GaugeChart from "@/components/Basic/Charts/GaugeChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import WaterChart from "@/components/Basic/Charts/WaterChart";

interface SharedDashboardWrapperProps {
  filteredData: any[];
  filters: {
    startDate?: string;
    endDate?: string; 
    meterIds?: string[];
  };
}

export default function SharedDashboardWrapper({ filteredData, filters }: SharedDashboardWrapperProps) {
  const { setDates, setMeterIds } = useChartStore();
  
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      setDates(new Date(filters.startDate), new Date(filters.endDate));
    }
    if (filters.meterIds) setMeterIds(filters.meterIds);
  }, [filters, setDates, setMeterIds]);

  const { heatDevices, coldWaterDevices, hotWaterDevices } = useMemo(() => {
    return (filteredData || []).reduce(
      (acc, item) => {
        const deviceType = item["Device Type"];
        if (deviceType === "Heat") {
          acc.heatDevices.push(item);
        } else if (deviceType === "Water") {
          acc.coldWaterDevices.push(item);
        } else if (deviceType === "WWater") {
          acc.hotWaterDevices.push(item);
        }
        return acc;
      },
      { heatDevices: [], coldWaterDevices: [], hotWaterDevices: [] }
    );
  }, [filteredData]);
  
  const isColdEmpty = (coldWaterDevices?.length || 0) === 0;
  const isHotEmpty = (hotWaterDevices?.length || 0) === 0;
  const isHeatEmpty = (heatDevices?.length || 0) === 0;
  const isAllEmpty = (heatDevices?.length || 0) + (coldWaterDevices?.length || 0) + (hotWaterDevices?.length || 0) === 0;

  return (
    <div className="max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl max-md:w-full max-md:mx-0 rounded-2xl max-md:rounded-none px-4 max-md:px-0 border-y-[16px] max-md:border-y-0 border-[#EFEEEC] bg-[#EFEEEC] max-md:bg-transparent w-full mt-6 max-xl:mt-4 max-md:mt-0 mx-auto pb-2 max-md:pb-0">
      <div className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-2 max-md:p-3">
        
        <div className="flex flex-col gap-3 max-md:gap-2 max-md:w-full">
          {/* Kaltwasser */}
          <div className="h-[250px] max-md:h-[180px] hover:scale-105 transition-transform duration-300 ease-in-out max-md:hover:scale-100 max-md:w-full max-md:overflow-hidden">
            <WaterChart
              csvText={coldWaterDevices}
              color="#6083CC"
              title="Kaltwasser"
              chartType="cold"
              isEmpty={isColdEmpty}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Daten für Kaltwasser im ausgewählten Zeitraum."
            />
          </div>

          {/* Warmwasser */}
          <div className="h-[217px] max-md:h-[160px] hover:scale-105 transition-transform duration-300 ease-in-out max-md:hover:scale-100 max-md:w-full max-md:overflow-hidden">
            <WaterChart
              csvText={hotWaterDevices}
              color="#E74B3C"
              title="Warmwasser"
              chartType="hot"
              isEmpty={isHotEmpty}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Daten für Warmwasser im ausgewählten Zeitraum."
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 max-md:gap-2 max-md:w-full">
          {/* Gesamtkosten */}
          <div className="h-[212px] max-md:h-[160px] hover:scale-105 transition-transform duration-300 ease-in-out max-md:hover:scale-100 max-md:w-full max-md:overflow-hidden">
            <GaugeChart
              heatReadings={heatDevices}
              coldWaterReadings={coldWaterDevices}
              hotWaterReadings={hotWaterDevices}
              isEmpty={isAllEmpty}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Daten im ausgewählten Zeitraum."
            />
          </div>

          {/* Heizkosten */}
          <div className="h-[254px] max-md:h-[180px] hover:scale-105 transition-transform duration-300 ease-in-out max-md:hover:scale-100 max-md:w-full max-md:overflow-hidden">
            <HeatingCosts 
              csvText={heatDevices} 
              isEmpty={isHeatEmpty}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Heizungsdaten im ausgewählten Zeitraum."
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 max-md:gap-2 max-md:w-full">
          {/* Shared Dashboard Info Panel - matches NotificationsChart height */}
          <div className="h-[328px] max-md:h-[200px] bg-white rounded-xl shadow p-4 px-5 max-md:p-3 hover:scale-105 transition-transform duration-300 ease-in-out max-md:hover:scale-100 max-md:w-full max-md:overflow-hidden">
            <div className="flex pb-4 max-md:pb-3 border-b border-gray-200 items-center justify-between mb-4 max-md:mb-3">
              <h2 className="text-lg max-md:text-base font-medium text-gray-800">Shared Dashboard</h2>
              <div className="w-6 h-6 max-md:w-5 max-md:h-5 bg-blue-500 rounded flex items-center justify-center animate-pulse hover:animate-spin">
                <span className="text-white text-xs animate-bounce">📊</span>
              </div>
            </div>
            <div className="space-y-3 max-md:space-y-2">
              <div className="p-3 max-md:p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <p className="text-sm max-md:text-xs font-medium text-gray-900">Meter Data</p>
                <p className="text-xs max-md:text-xs text-gray-500">Real-time monitoring</p>
              </div>
              <div className="p-3 max-md:p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                <p className="text-sm max-md:text-xs font-medium text-gray-900">Water Usage</p>
                <p className="text-xs max-md:text-xs text-gray-500">Cold & Hot water</p>
              </div>
              <div className="p-3 max-md:p-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200">
                <p className="text-sm max-md:text-xs font-medium text-gray-900">Heating Costs</p>
                <p className="text-xs max-md:text-xs text-gray-500">Monthly tracking</p>
              </div>
            </div>
          </div>

          {/* Einsparung - matches original height */}
          <div className="h-[138px] max-md:h-[140px] hover:scale-105 transition-transform duration-300 ease-in-out max-md:hover:scale-100 max-md:w-full max-md:overflow-hidden">
            <EinsparungChart />
          </div>
        </div>

      </div>
    </div>
  );
}
