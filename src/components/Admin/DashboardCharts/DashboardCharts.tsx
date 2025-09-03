"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { EmptyState, ErrorState, GlobalErrorBanner } from "@/components/Basic/ui/States";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { useChartStore } from "@/store/useChartStore";
import { MeterReadingType } from "@/api";
import { parseGermanDate } from "@/utils";
import ChartCardSkeleton from "@/components/Basic/ui/ChartCardSkeleton";
import Widget from "@/components/Basic/ui/Widget";

// Widget moved to ui/Widget

const WaterChart = dynamic(() => import("@/components/Basic/Charts/WaterChart"), {
  loading: () => <ChartCardSkeleton />,
  ssr: false,
});

const GaugeChart = dynamic(() => import("@/components/Basic/Charts/GaugeChart"), {
  loading: () => <ChartCardSkeleton />,
  ssr: false,
});

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

interface DashboardChartsProps {
  parsedData: {
    data: MeterReadingType[];
    errors?: any[];
  };
}

export default function DashboardCharts({ parsedData }: DashboardChartsProps) {
  const { startDate, endDate } = useChartStore();

  // Use useMemo to recalculate filtered data when dependencies change
  const selectedData = useMemo(() => {
    if (!parsedData?.data) return [];

    let filtered = parsedData.data
      .filter((item) => item["Device Type"] !== "Device Type")
      .filter((item) => item.ID); // Only items with valid IDs

    // Filter by date range if both dates are set
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const itemDateString = item["IV,0,0,0,,Date/Time"].split(" ")[0]; // Extract date part
        const itemDate = parseGermanDate(itemDateString);
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Skip invalid dates
        if (!itemDate || isNaN(itemDate.getTime())) {
          return false;
        }

        const isInRange = itemDate >= start && itemDate <= end;

        return isInRange;
      });
    }

    return filtered;
  }, [parsedData?.data, startDate, endDate]);

  // Filter by device type using useMemo for performance
  const heatDevices = useMemo(
    () => selectedData?.filter((item) => item["Device Type"] === "Heat"),
    [selectedData]
  );

  const coldWaterDevices = useMemo(
    () => selectedData?.filter((item) => item["Device Type"] === "Water"),
    [selectedData]
  );

  const hotWaterDevices = useMemo(
    () => selectedData?.filter((item) => item["Device Type"] === "WWater"),
    [selectedData]
  );

  const isColdEmpty = (coldWaterDevices?.length || 0) === 0;
  const isHotEmpty = (hotWaterDevices?.length || 0) === 0;
  const isHeatEmpty = (heatDevices?.length || 0) === 0;
  const isAllEmpty =
    (heatDevices?.length || 0) +
      (coldWaterDevices?.length || 0) +
      (hotWaterDevices?.length || 0) ===
    0;

  return (
    <ContentWrapper className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
      <div className="flex flex-col gap-3">
        <Widget
          heightClass="h-[312px]"
          showError={false}
          errorMessage=""
          showEmpty={isColdEmpty}
          emptyMessage="Keine Daten für Kaltwasser im gewählten Zeitraum."
        >
          <WaterChart
            csvText={coldWaterDevices}
            color="#6083CC"
            title="Kaltwasser"
            chartType="cold"
          />
        </Widget>
        <Widget
          heightClass="h-[271px]"
          showError={false}
          errorMessage=""
          showEmpty={isHotEmpty}
          emptyMessage="Keine Daten für Warmwasser im gewählten Zeitraum."
        >
          <WaterChart
            csvText={hotWaterDevices || []}
            color="#E74B3C"
            title="Warmwasser"
            chartType="hot"
          />
        </Widget>
      </div>

      <div className="flex flex-col gap-3">
        <Widget
          heightClass="h-[265px]"
          showError={false}
          errorMessage=""
          showEmpty={isAllEmpty}
          emptyMessage="Keine Messdaten im gewählten Zeitraum."
        >
          <GaugeChart
            heatReadings={heatDevices}
            coldWaterReadings={coldWaterDevices}
            hotWaterReadings={hotWaterDevices}
          />
        </Widget>
        <Widget
          heightClass="h-[318px]"
          showError={false}
          errorMessage=""
          showEmpty={isHeatEmpty}
          emptyMessage="Keine Heizungsdaten im gewählten Zeitraum."
        >
          <HeatingCosts csvText={heatDevices} />
        </Widget>
      </div>

      <div className="flex flex-col gap-3">
        <div className="h-[410px]">
          <NotificationsChart />
        </div>
        <div className="h-[173px]">
          <EinsparungChart />
        </div>
      </div>
    </ContentWrapper>
  );
}
