"use client";

import { useEffect, useMemo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import ElectricityChart from "@/components/Basic/Charts/ElectricityChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import NotificationsChart from "@/components/Basic/Charts/NotificationsChart";
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
    
    // For shared dashboard, we need to set the device serial numbers (not UUIDs)
    // because NotificationsChart filters by device.ID which is the serial number
    if (filteredData && filteredData.length > 0) {
      const deviceIds = [...new Set(
        filteredData
          .map(item => item.ID?.toString())
          .filter((id): id is string => !!id)
      )];
      setMeterIds(deviceIds);
    } else if (filters.meterIds) {
      setMeterIds(filters.meterIds);
    }
  }, [filters, filteredData, setDates, setMeterIds]);

  const { heatDevices, coldWaterDevices, hotWaterDevices, electricityDevices } = useMemo(() => {
    return (filteredData || []).reduce(
      (acc, item) => {
        const deviceType = item["Device Type"];
        // Support both OLD format and NEW Engelmann format device types
        // Must match exactly what useChartData.ts uses
        if (deviceType === "Heat" || deviceType === "Heizkostenverteiler" || deviceType === "WMZ Rücklauf" || deviceType === "Wärmemengenzähler") {
          acc.heatDevices.push(item);
        } else if (deviceType === "Water" || deviceType === "Kaltwasserzähler") {
          acc.coldWaterDevices.push(item);
        } else if (deviceType === "WWater" || deviceType === "Warmwasserzähler") {
          acc.hotWaterDevices.push(item);
        } else if (deviceType === "Elec" || deviceType === "Stromzähler") {
          acc.electricityDevices.push(item);
        }
        return acc;
      },
      { heatDevices: [] as any[], coldWaterDevices: [] as any[], hotWaterDevices: [] as any[], electricityDevices: [] as any[] }
    );
  }, [filteredData]);
  
  const isColdEmpty = (coldWaterDevices?.length || 0) === 0;
  const isHotEmpty = (hotWaterDevices?.length || 0) === 0;
  const isHeatEmpty = (heatDevices?.length || 0) === 0;
  const isElecEmpty = (electricityDevices?.length || 0) === 0;
  
  // Combine all data for EinsparungChart (needs all device types for CO2 calculations)
  const einsparungChartData = [...coldWaterDevices, ...hotWaterDevices, ...electricityDevices, ...heatDevices];
  const isEinsparungEmpty = einsparungChartData.length === 0;

  return (
    <div className="max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl max-md:w-full max-md:mx-0 rounded-2xl max-md:rounded-none px-4 max-md:px-0 border-y-[16px] max-md:border-y-0 border-[#EFEEEC] bg-[#EFEEEC] max-md:bg-transparent w-full mt-6 max-xl:mt-4 max-md:mt-0 mx-auto pb-2 max-md:pb-0">
      <div className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-2 max-md:p-3">
        
        <div className="flex flex-col gap-3 max-md:gap-2 max-md:w-full">
          {/* Kaltwasser */}
          <div className="h-[280px] max-md:h-[200px] hover:scale-[1.04] transition-transform duration-200 ease-out max-md:hover:scale-100 max-md:w-full max-md:overflow-hidden animate-fadeInUp">
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
          <div className="h-[247px] max-md:h-[180px] hover:scale-[1.04] transition-transform duration-200 ease-out max-md:hover:scale-100 max-md:w-full max-md:overflow-hidden animate-fadeInUp delay-100">
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
          {/* Stromverbrauch - matches main dashboard */}
          <div className="h-[265px] max-md:h-[180px] hover:scale-[1.04] transition-transform duration-200 ease-out max-md:hover:scale-100 max-md:w-full max-md:overflow-hidden animate-fadeInUp delay-200">
            <ElectricityChart
              electricityReadings={electricityDevices}
              isEmpty={isElecEmpty}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Stromdaten im ausgewählten Zeitraum."
            />
          </div>

          {/* Heizkosten */}
          <div className="h-[318px] max-md:h-[200px] hover:scale-[1.04] transition-transform duration-200 ease-out max-md:hover:scale-100 max-md:w-full max-md:overflow-hidden animate-fadeInUp delay-300">
            <HeatingCosts 
              csvText={heatDevices} 
              isEmpty={isHeatEmpty}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Heizungsdaten im ausgewählten Zeitraum."
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 max-md:gap-2 max-md:w-full">
          {/* Benachrichtigungen - uses real NotificationsChart like main dashboard */}
          <div className="h-[360px] max-md:h-[250px] hover:scale-[1.04] transition-transform duration-200 ease-out max-md:hover:scale-100 max-md:w-full max-md:overflow-hidden animate-fadeInUp delay-400">
            <NotificationsChart
              isEmpty={filteredData.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Daten im ausgewählten Zeitraum."
              parsedData={{ data: filteredData, errors: [] }}
            />
          </div>

          {/* Einsparung - passes data like main dashboard */}
          <div className="h-[220px] max-md:h-[180px] hover:scale-[1.04] transition-transform duration-200 ease-out max-md:hover:scale-100 max-md:w-full overflow-hidden animate-fadeInUp delay-500">
            <EinsparungChart
              selectedData={einsparungChartData}
              isEmpty={isEinsparungEmpty}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine CO₂-Einsparungen im ausgewählten Zeitraum."
            />
          </div>
        </div>

      </div>
    </div>
  );
}
