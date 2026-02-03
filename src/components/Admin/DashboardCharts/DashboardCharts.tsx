"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { useChartStore } from "@/store/useChartStore";
import { useDashboardData } from "@/hooks/useDashboardData";
import ChartCardSkeleton from "@/components/Basic/ui/ChartCardSkeleton";

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

export default function DashboardCharts() {
  const { meterIds } = useChartStore();

  // Single unified data fetch with SWR caching (replaces 5 separate API calls)
  const {
    coldWaterData,
    hotWaterData,
    electricityData,
    heatData,
    notificationsData,
    isLoading,
    error
  } = useDashboardData();

  // Memoized combination for EinsparungChart
  const einsparungChartData = useMemo(() => [
    ...coldWaterData,
    ...hotWaterData,
    ...electricityData,
    ...heatData,
  ], [coldWaterData, hotWaterData, electricityData, heatData]);

  // Show message when no meter IDs are selected
  const isAnyChartLoading = isLoading;

  if (!meterIds.length && !isAnyChartLoading) {
    return (
      <ContentWrapper className="grid gap-3 grid-cols-3 max-large:grid-cols-2 max-medium:grid-cols-1">
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

  // Determine whether to show electricity chart based on data availability
  const shouldShowElectricityChart = electricityData.length > 0;

  return (
    <ContentWrapper className="grid grid-cols-3 gap-3 max-large:grid-cols-2 max-medium:grid-cols-1">
      {/* Column 1: Kaltwasser + Warmwasser */}
      <div className="flex flex-col gap-3">
        <div className="h-[240px]">
          {isLoading ? (
            <ChartCardSkeleton />
          ) : (
            <WaterChart
              csvText={coldWaterData}
              color="#6083CC"
              title="Kaltwasser"
              chartType="cold"
              isEmpty={coldWaterData.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Daten für Kaltwasser im ausgewählten Zeitraum."
            />
          )}
        </div>
        <div className="h-[240px]">
          {isLoading ? (
            <ChartCardSkeleton />
          ) : (
            <WaterChart
              csvText={hotWaterData}
              color="#E74B3C"
              title="Warmwasser"
              chartType="hot"
              isEmpty={hotWaterData.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Daten für Warmwasser im ausgewählten Zeitraum."
            />
          )}
        </div>
      </div>

      {/* Column 2: Stromverbrauch + Heizkosten */}
      <div className="flex flex-col gap-3">
        <div className="h-[200px]">
          {isLoading ? (
            <ChartCardSkeleton />
          ) : (
            <ElectricityChart
              electricityReadings={electricityData}
              isEmpty={electricityData.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Stromdaten im ausgewählten Zeitraum."
            />
          )}
        </div>
        <div className="h-[280px]">
          {isLoading ? (
            <ChartCardSkeleton />
          ) : (
            <HeatingCosts
              csvText={heatData}
              isEmpty={heatData.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Heizungsdaten im ausgewählten Zeitraum."
            />
          )}
        </div>
      </div>

      {/* Column 3: Benachrichtigungen + Einsparung (these stay together on tablet) */}
      <div className="flex flex-col gap-3 max-large:col-span-2 max-large:grid max-large:grid-cols-2 max-large:gap-3 max-medium:col-span-1 max-medium:grid-cols-1 max-medium:flex max-medium:flex-col">
        <div className="h-[300px] max-large:h-[300px]">
          {isLoading ? (
            <ChartCardSkeleton />
          ) : (
            <NotificationsChart
              isEmpty={notificationsData.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Daten im ausgewählten Zeitraum."
              parsedData={{ data: notificationsData, errors: [] }}
            />
          )}
        </div>
        <div className="h-[180px] max-large:h-[300px]">
          {isLoading ? (
            <ChartCardSkeleton />
          ) : (
            <EinsparungChart
              selectedData={einsparungChartData}
              isEmpty={einsparungChartData.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine CO₂-Einsparungen im ausgewählten Zeitraum."
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
}
