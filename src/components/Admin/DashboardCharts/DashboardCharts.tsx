"use client";

import { useMemo } from "react";
import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import GaugeChart from "@/components/Basic/Charts/GaugeChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import NotificationsChart from "@/components/Basic/Charts/NotificationsChart";
import WaterChart from "@/components/Basic/Charts/WaterChart";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { useChartStore } from "@/store/useChartStore";
import { MeterReadingType } from "@/api";
import { parseGermanDate } from "@/utils";

interface DashboardChartsProps {
  parsedData: {
    data: MeterReadingType[];
    errors?: any[];
  };
}

export default function DashboardCharts({ parsedData }: DashboardChartsProps) {
  const { startDate, endDate } = useChartStore();

  // Extract date strings for proper dependency tracking
  const startDateString = startDate?.toString();
  const endDateString = endDate?.toString();

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

  // some calculations for gauge chart
  const calculateGaugePercent = (data: MeterReadingType[] | undefined) => {
    return 0.5;
  };

  return (
    <ContentWrapper className="max-h-[90%] grid grid-cols-3 gap-2 grid-rows-10">
      <WaterChart
        csvText={coldWaterDevices}
        color="#6083CC"
        title="Kaltwasser"
        chartType="cold"
      />
      <GaugeChart percent={calculateGaugePercent(coldWaterDevices)} />
      <NotificationsChart />
      <HeatingCosts csvText={heatDevices} />
      <WaterChart
        csvText={hotWaterDevices}
        color="#E74B3C"
        title="Warmwasser"
        chartType="hot"
      />
      <EinsparungChart />
    </ContentWrapper>
  );
}
