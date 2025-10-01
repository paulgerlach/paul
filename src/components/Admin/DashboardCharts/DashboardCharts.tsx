"use client";

import { useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { useChartStore } from "@/store/useChartStore";
import { MeterReadingType } from "@/api";
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

export default function DashboardCharts() {
  const {
    data,
    metadata,
    loading,
    error,
    meterIds,
    startDate,
    endDate,
    fetchData,
    clearError,
  } = useChartStore();

  // Performance monitoring in development
  const logPerformance = useCallback(
    (label: string, dataLength: number) => {
      if (process.env.NODE_ENV === "development") {
        console.debug(`Dashboard ${label}:`, {
          dataLength,
          startDate,
          endDate,
          meterIds: meterIds.length,
          metadata,
        });
      }
    },
    [startDate, endDate, meterIds, metadata]
  );

  // The data is already filtered by the API endpoint based on meterIds and date range
  const selectedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Additional client-side validation if needed
    const filtered = data.filter(isValidMeterReading);

    logPerformance("chart data", filtered.length);
    return filtered;
  }, [data, logPerformance]);

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
            case 'Heat':
              groups.heat.push(item);
              break;
            case 'Water':
              groups.coldWater.push(item);
              break;
            case 'WWater':
              groups.hotWater.push(item);
              break;
            case 'Elec':
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
  const {
    heat: heatDevices,
    coldWater: coldWaterDevices,
    hotWater: hotWaterDevices,
    electricity: electricityDevices,
  } = deviceGroups;

  // Calculate empty states with proper error handling
  const emptyStates = useMemo((): EmptyStates => {
    const isColdEmpty = coldWaterDevices.length === 0;
    const isHotEmpty = hotWaterDevices.length === 0;
    const isHeatEmpty = heatDevices.length === 0;
    const isElectricityEmpty = electricityDevices.length === 0;
    const isAllEmpty =
      heatDevices.length + coldWaterDevices.length + hotWaterDevices.length ===
      0;

    return {
      isColdEmpty,
      isHotEmpty,
      isHeatEmpty,
      isElectricityEmpty,
      isAllEmpty,
    };
  }, [
    heatDevices.length,
    coldWaterDevices.length,
    hotWaterDevices.length,
    electricityDevices.length,
  ]);

  const {
    isColdEmpty,
    isHotEmpty,
    isHeatEmpty,
    isElectricityEmpty,
    isAllEmpty,
  } = emptyStates;

  // Create type-safe parsed data for NotificationsChart
  const notificationsData = useMemo(() => {
    return {
      data: selectedData,
      errors: [], // API errors are handled separately in the store
    };
  }, [selectedData]);

  // Handle loading states
  if (loading) {
    return (
      <ContentWrapper className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </ContentWrapper>
    );
  }

  // Handle error states
  if (error) {
    return (
      <ContentWrapper className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Fehler beim Laden der Daten
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={clearError}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </ContentWrapper>
    );
  }

  // Show message when no meter IDs are selected
  if (!meterIds.length) {
    return (
      <ContentWrapper className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Keine Wohnungen ausgewählt
          </h3>
          <p className="text-gray-600">
            Bitte wählen Sie Wohnungen aus, um die Verbrauchsdaten anzuzeigen.
          </p>
        </div>
      </ContentWrapper>
    );
  }

  const shouldShowElectricityChart = !isElectricityEmpty;

  return (
    <ContentWrapper className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
      <div className="flex flex-col gap-3">
        <div className="h-[312px]">
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
        <div className="h-[271px]">
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
        <div className="h-[265px]">
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
        <div className="h-[318px]">
          <HeatingCosts
            csvText={heatDevices}
            isEmpty={isHeatEmpty}
            emptyTitle="Keine Daten verfügbar."
            emptyDescription="Keine Heizungsdaten im ausgewählten Zeitraum."
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="h-[360px]">
          <NotificationsChart
            isEmpty={isAllEmpty}
            emptyTitle="Keine Daten verfügbar."
            emptyDescription="Keine Daten im ausgewählten Zeitraum."
            parsedData={notificationsData}
          />
        </div>
        <div className="h-[220px]">
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
