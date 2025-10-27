"use client";

import dynamic from "next/dynamic";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { useChartStore } from "@/store/useChartStore";
import { 
  useWaterChartData, 
  useElectricityChartData, 
  useHeatChartData, 
  useNotificationsChartData 
} from "@/hooks/useChartData";
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



export default function DashboardCharts() {
  const { meterIds } = useChartStore();

  // Individual chart data hooks
  const coldWaterChart = useWaterChartData('cold');
  const hotWaterChart = useWaterChartData('hot');
  const electricityChart = useElectricityChartData();
  const heatChart = useHeatChartData();
  const notificationsChart = useNotificationsChartData();

  // Combine data for GaugeChart (needs coldWater, hotWater, heat)
  const gaugeChartData = [...coldWaterChart.data, ...hotWaterChart.data, ...heatChart.data];
  const gaugeChartLoading = coldWaterChart.loading || hotWaterChart.loading || heatChart.loading;

  // Combine data for EinsparungChart (needs all device types for CO2 calculations)
  const einsparungChartData = [...coldWaterChart.data, ...hotWaterChart.data, ...electricityChart.data, ...heatChart.data];
  const einsparungChartLoading = coldWaterChart.loading || hotWaterChart.loading || electricityChart.loading || heatChart.loading;

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

  // Determine whether to show electricity chart based on data availability
  const shouldShowElectricityChart = electricityChart.data.length > 0;

  return (
    <ContentWrapper className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
      <div className="flex flex-col gap-3">
        <div className="h-[312px]">
          {coldWaterChart.loading ? (
            <ChartCardSkeleton />
          ) : (
            <WaterChart
              csvText={coldWaterChart.data}
              color="#6083CC"
              title="Kaltwasser"
              chartType="cold"
              isEmpty={coldWaterChart.data.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Daten für Kaltwasser im ausgewählten Zeitraum."
            />
          )}
        </div>
        <div className="h-[271px]">
          {hotWaterChart.loading ? (
            <ChartCardSkeleton />
          ) : (
            <WaterChart
              csvText={hotWaterChart.data}
              color="#E74B3C"
              title="Warmwasser"
              chartType="hot"
              isEmpty={hotWaterChart.data.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Daten für Warmwasser im ausgewählten Zeitraum."
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="h-[265px]">
          {!shouldShowElectricityChart ? (
            gaugeChartLoading ? (
              <ChartCardSkeleton />
            ) : (
              <GaugeChart
                heatReadings={heatChart.data}
                coldWaterReadings={coldWaterChart.data}
                hotWaterReadings={hotWaterChart.data}
                isEmpty={gaugeChartData.length === 0}
                emptyTitle="Keine Daten verfügbar."
                emptyDescription="Keine Daten im ausgewählten Zeitraum."
              />
            )
          ) : electricityChart.loading ? (
            <ChartCardSkeleton />
          ) : (
            <ElectricityChart
              electricityReadings={electricityChart.data}
              isEmpty={electricityChart.data.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Stromdaten im ausgewählten Zeitraum."
            />
          )}
        </div>
        <div className="h-[318px]">
          {heatChart.loading ? (
            <ChartCardSkeleton />
          ) : (
            <HeatingCosts
              csvText={heatChart.data}
              isEmpty={heatChart.data.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Heizungsdaten im ausgewählten Zeitraum."
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="h-[360px]">
          {notificationsChart.loading ? (
            <ChartCardSkeleton />
          ) : (
            <NotificationsChart
              isEmpty={notificationsChart.data.length === 0}
              emptyTitle="Keine Daten verfügbar."
              emptyDescription="Keine Daten im ausgewählten Zeitraum."
              parsedData={{ data: notificationsChart.data, errors: [] }}
            />
          )}
        </div>
        <div className="h-[220px]">
          {einsparungChartLoading ? (
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
