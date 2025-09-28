"use client";

import { useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { useChartStore } from "@/store/useChartStore";
import { MeterReadingType } from "@/api";
import { parseGermanDate } from "@/utils";
import ChartCardSkeleton from "@/components/Basic/ui/ChartCardSkeleton";

// Utility functions for better code organization
const isValidMeterReading = (item: MeterReadingType): boolean => {
  return !!(
    item &&
    item["Device Type"] !== "Device Type" &&
    item.ID &&
    item["IV,0,0,0,,Date/Time"]
  );
};

const isDateInRange = (dateString: string, start: Date, end: Date): boolean => {
  const itemDateString = dateString.split(" ")[0]; // Extract date part
  const itemDate = parseGermanDate(itemDateString);
  
  if (!itemDate || isNaN(itemDate.getTime())) {
    return false;
  }
  
  return itemDate >= start && itemDate <= end;
};

const WaterChart = dynamic(
  () => import("@/components/Basic/Charts/WaterChart"),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const ElectricityChart = dynamic(
  () => import("@/components/Basic/Charts/ElectricityChart"),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const GaugeChart = dynamic(
  () => import("@/components/Basic/Charts/GaugeChart"),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const HeatingCosts = dynamic(
  () => import("@/components/Basic/Charts/HeatingCosts"),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const NotificationsChart = dynamic(
  () => import("@/components/Basic/Charts/NotificationsChart"),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const EinsparungChart = dynamic(
  () => import("@/components/Basic/Charts/EinsparungChart"),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

interface ParsedDataError {
  row?: number;
  error?: string;
  message?: string;
  code?: string;
  details?: unknown;
  rawRow?: any;
}

interface DashboardChartsProps {
  parsedData: {
    data: MeterReadingType[];
    errors?: ParsedDataError[];
  };
}

interface DeviceTypeGroups {
  heat: MeterReadingType[];
  coldWater: MeterReadingType[];
  hotWater: MeterReadingType[];
  electricity: MeterReadingType[];
}

interface EmptyStates {
  isColdEmpty: boolean;
  isHotEmpty: boolean;
  isHeatEmpty: boolean;
  isElectricityEmpty: boolean;
  isAllEmpty: boolean;
}

export default function DashboardCharts({ parsedData }: DashboardChartsProps) {
  const { startDate, endDate } = useChartStore();

  // Performance monitoring in development
  const logPerformance = useCallback((label: string, dataLength: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Dashboard ${label}:`, { dataLength, startDate, endDate });
    }
  }, [startDate, endDate]);

  // Optimized data filtering with single pass and date range caching
  const selectedData = useMemo(() => {
    if (!parsedData?.data) return [];

    // Cache date objects to avoid repeated parsing
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const hasDateRange = start && end;

    // Single pass filtering for better performance
    const filtered = parsedData.data.filter((item) => {
      // Basic validation using utility function
      if (!isValidMeterReading(item)) return false;

      // Date range filtering if specified
      if (hasDateRange && !isDateInRange(item["IV,0,0,0,,Date/Time"], start, end)) {
        return false;
      }

      return true;
    });

    logPerformance('filtered data', filtered.length);
    return filtered;
  }, [parsedData?.data, startDate, endDate, logPerformance]);

  // Optimized device type grouping with single pass and error handling
  const deviceGroups = useMemo((): DeviceTypeGroups => {
    if (!selectedData || selectedData.length === 0) {
      return {
        heat: [],
        coldWater: [],
        hotWater: [],
        electricity: [],
      };
    }

    try {
      return selectedData.reduce<DeviceTypeGroups>(
        (groups, item) => {
          const deviceType = item["Device Type"];
          switch (deviceType) {
            case "Heat":
              groups.heat.push(item);
              break;
            case "Water":
              groups.coldWater.push(item);
              break;
            case "WWater":
              groups.hotWater.push(item);
              break;
            case "Elec":
              groups.electricity.push(item);
              break;
            default:
              // Silently ignore unknown device types
              break;
          }
          return groups;
        },
        {
          heat: [],
          coldWater: [],
          hotWater: [],
          electricity: [],
        }
      );
    } catch (error) {
      console.error("Error grouping device data:", error);
      return {
        heat: [],
        coldWater: [],
        hotWater: [],
        electricity: [],
      };
    }
  }, [selectedData]);

  // Extract individual device arrays for backward compatibility
  const { heat: heatDevices, coldWater: coldWaterDevices, hotWater: hotWaterDevices, electricity: electricityDevices } = deviceGroups;

  // Calculate empty states with proper error handling
  const emptyStates = useMemo((): EmptyStates => {
    const isColdEmpty = coldWaterDevices.length === 0;
    const isHotEmpty = hotWaterDevices.length === 0;
    const isHeatEmpty = heatDevices.length === 0;
    const isElectricityEmpty = electricityDevices.length === 0;
    const isAllEmpty = heatDevices.length + coldWaterDevices.length + hotWaterDevices.length === 0;

    return {
      isColdEmpty,
      isHotEmpty,
      isHeatEmpty,
      isElectricityEmpty,
      isAllEmpty,
    };
  }, [heatDevices.length, coldWaterDevices.length, hotWaterDevices.length, electricityDevices.length]);

  const { isColdEmpty, isHotEmpty, isHeatEmpty, isElectricityEmpty, isAllEmpty } = emptyStates;

  // Create type-safe parsed data for NotificationsChart
  const notificationsData = useMemo(() => {
    if (!parsedData) return { data: [], errors: [] };
    
    return {
      data: parsedData.data,
      errors: parsedData.errors?.map(error => ({
        row: error.row || 0,
        error: error.error || error.message || 'Unknown error',
        rawRow: error.rawRow || error.details || {}
      })) || []
    };
  }, [parsedData]);

  // Handle loading or error states after all hooks
  if (!parsedData) {
    return (
      <ContentWrapper className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </ContentWrapper>
    );
  }

  // Handle data errors
  if (parsedData.errors && parsedData.errors.length > 0) {
    console.error("Dashboard data errors:", parsedData.errors);
  }

  const forceElecDummy = process.env.NEXT_PUBLIC_ELEC_DUMMY === "1";
  const shouldShowElectricityChart = !isElectricityEmpty;

  return (
    <ContentWrapper className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
      <div className="flex flex-col gap-3">
        <div className="h-[312px] hover:scale-[1.03] transition-transform duration-200 ease-out animate-fadeInUp">
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
        <div className="h-[271px] hover:scale-[1.03] transition-transform duration-200 ease-out animate-fadeInUp delay-100">
          <WaterChart
            csvText={hotWaterDevices || []}
            color="#E74B3C"
            title="Warmwasser"
            chartType="hot"
            isEmpty={isHotEmpty}
            emptyTitle="Keine Daten verfügbar."
            emptyDescription="Keine Daten für Warmwasser im ausgewählten Zeitraum."
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="h-[265px] hover:scale-[1.03] transition-transform duration-200 ease-out animate-fadeInUp delay-200">
          {!shouldShowElectricityChart ? (
            <GaugeChart
              heatReadings={heatDevices}
              coldWaterReadings={coldWaterDevices}
              hotWaterReadings={hotWaterDevices}
              isEmpty={isAllEmpty}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Daten im ausgewählten Zeitraum."
            />
          ) : (
            <ElectricityChart
              electricityReadings={electricityDevices}
              isEmpty={isElectricityEmpty}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Stromdaten im ausgewählten Zeitraum."
            />
          )}
        </div>
        <div className="h-[318px] hover:scale-[1.03] transition-transform duration-200 ease-out animate-fadeInUp delay-300">
          <HeatingCosts
            csvText={heatDevices}
            isEmpty={isHeatEmpty}
            emptyTitle="Keine Daten verfügbar."
            emptyDescription="Keine Heizungsdaten im ausgewählten Zeitraum."
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="h-[360px] hover:scale-[1.03] transition-transform duration-200 ease-out animate-fadeInUp delay-400">
          <NotificationsChart
            isEmpty={isAllEmpty}
            emptyTitle="Keine Daten verfügbar."
            emptyDescription="Keine Daten im ausgewählten Zeitraum."
            parsedData={notificationsData}
          />
        </div>
        <div className="h-[220px] hover:scale-[1.03] transition-transform duration-200 ease-out animate-fadeInUp delay-500">
          <EinsparungChart
            selectedData={selectedData}
            isEmpty={isAllEmpty}
            emptyTitle="Keine Daten verfügbar."
            emptyDescription="Keine CO₂-Einsparungen im ausgewählten Zeitraum."
          />
        </div>
      </div>
    </ContentWrapper>
  );
}
