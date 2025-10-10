"use client";

import { cold_water, hot_water } from "@/static/icons";
import Image from "next/image";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { type MeterReadingType } from "@/api";
import { useChartStore } from "@/store/useChartStore";
import { EmptyState } from "@/components/Basic/ui/States";

const ALL_MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

interface ProcessedData {
  date: Date;
  deviceId: string;
  volume: number; // in liters
}

interface ChartDataPoint {
  label: string;
  value: number;
  date: Date;
}

// Utility functions
const parseTimestamp = (dateTimeString: string): Date => {
  try {
    // Parse format like "29.09.2025 09:57 invalid 1 summer time 0"
    const parts = dateTimeString.split(" ");
    if (parts.length >= 2) {
      const [datePart, timePart] = parts;
      const [day, month, year] = datePart.split(".").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);

      if (day && month && year && !isNaN(hour) && !isNaN(minute)) {
        return new Date(year, month - 1, day, hour, minute);
      }
    }
  } catch (error) {
    console.warn("Failed to parse timestamp:", dateTimeString, error);
  }
  return new Date();
};

const parseVolume = (volume: string | number): number => {
  if (typeof volume === "string") {
    return parseFloat(volume.replace(",", "."));
  }
  return typeof volume === "number" ? volume : 0;
};

const isWithinDateRange = (
  date: Date,
  startDate: Date | null,
  endDate: Date | null
): boolean => {
  if (!startDate || !endDate) return true;
  return date >= startDate && date <= endDate;
};

const formatLabel = (
  date: Date,
  granularity: "hour" | "day" | "month"
): string => {
  switch (granularity) {
    case "hour":
      return `${date.getHours().toString().padStart(2, "0")}:00`;
    case "day":
      return `${date.getDate()} ${ALL_MONTHS[date.getMonth()]}`;
    case "month":
      return `${ALL_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    default:
      return date.toDateString();
  }
};

const determineGranularity = (
  processedData: ProcessedData[],
  startDate: Date | null,
  endDate: Date | null
): "hour" | "day" | "month" => {
  if (!startDate || !endDate) {
    // If no date range, determine based on data spread
    if (processedData.length === 0) return "day";

    const dates = processedData.map((d) => d.date.toDateString());
    const uniqueDates = new Set(dates);

    if (uniqueDates.size === 1) {
      // Single day - check if we have multiple hours
      const hours = processedData.map((d) => d.date.getHours());
      const uniqueHours = new Set(hours);
      return uniqueHours.size > 1 ? "hour" : "day";
    }

    return uniqueDates.size <= 31 ? "day" : "month";
  }

  // Calculate range in days (more precise calculation)
  const rangeInHours =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const rangeInDays = rangeInHours / 24;

  // For same day or less than 24 hours, use hourly granularity
  if (rangeInDays <= 1) return "hour";
  if (rangeInDays <= 62) return "day"; // ~2 months
  return "month";
};

const aggregateDataByGranularity = (
  processedData: ProcessedData[],
  granularity: "hour" | "day" | "month"
): ChartDataPoint[] => {
  const aggregationMap = new Map<string, { total: number; date: Date }>();

  processedData.forEach((item) => {
    let key: string;
    let groupDate: Date;

    switch (granularity) {
      case "hour":
        // Group by date + hour
        groupDate = new Date(
          item.date.getFullYear(),
          item.date.getMonth(),
          item.date.getDate(),
          item.date.getHours()
        );
        key = `${groupDate.toDateString()}-${groupDate.getHours()}`;
        break;
      case "day":
        // Group by date only
        groupDate = new Date(
          item.date.getFullYear(),
          item.date.getMonth(),
          item.date.getDate()
        );
        key = groupDate.toDateString();
        break;
      case "month":
        // Group by year + month
        groupDate = new Date(item.date.getFullYear(), item.date.getMonth(), 1);
        key = `${groupDate.getFullYear()}-${groupDate.getMonth()}`;
        break;
    }

    if (!aggregationMap.has(key)) {
      aggregationMap.set(key, { total: 0, date: groupDate });
    }

    aggregationMap.get(key)!.total += item.volume;
  });

  // Convert to array and sort by date
  return Array.from(aggregationMap.entries())
    .map(([_, { total, date }]) => ({
      label: formatLabel(date, granularity),
      value: Math.round(total * 1000) / 1000, // Round to 3 decimal places instead of whole numbers
      date: date,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

const generateZeroPaddedData = (
  aggregatedData: ChartDataPoint[],
  granularity: "hour" | "day" | "month",
  startDate: Date | null,
  endDate: Date | null
): ChartDataPoint[] => {
  if (!startDate || !endDate || aggregatedData.length === 0) {
    return aggregatedData;
  }

  const dataMap = new Map<string, ChartDataPoint>();
  aggregatedData.forEach((item) => {
    const key = item.date.getTime().toString();
    dataMap.set(key, item);
  });

  const result: ChartDataPoint[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    let key: string;
    let displayDate: Date;

    switch (granularity) {
      case "hour":
        displayDate = new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate(),
          current.getHours()
        );
        key = displayDate.getTime().toString();

        const existing = dataMap.get(key);
        result.push({
          label: formatLabel(displayDate, granularity),
          value: existing?.value || 0,
          date: displayDate,
        });

        current.setHours(current.getHours() + 1);
        break;

      case "day":
        displayDate = new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate()
        );
        key = displayDate.getTime().toString();

        const existingDay = dataMap.get(key);
        result.push({
          label: formatLabel(displayDate, granularity),
          value: existingDay?.value || 0,
          date: displayDate,
        });

        current.setDate(current.getDate() + 1);
        break;

      case "month":
        displayDate = new Date(current.getFullYear(), current.getMonth(), 1);
        key = displayDate.getTime().toString();

        const existingMonth = dataMap.get(key);
        result.push({
          label: formatLabel(displayDate, granularity),
          value: existingMonth?.value || 0,
          date: displayDate,
        });

        current.setMonth(current.getMonth() + 1);
        break;
    }
  }

  return result;
};

export default function WaterChart({
  color,
  title,
  chartType,
  csvText,
  isEmpty = false,
  emptyTitle,
  emptyDescription,
}: {
  color: string;
  title: string;
  chartType: "hot" | "cold";
  csvText: MeterReadingType[];
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 4000]);
  const [tickFormatter, setTickFormatter] = useState<(value: number) => string>(
    () => (value: number) => `${value / 1000}k`
  );
  const [hasDataInRange, setHasDataInRange] = useState<boolean>(true);

  const { startDate, endDate } = useChartStore();

  useEffect(() => {
    if (isEmpty || csvText.length === 0) {
      setChartData([]);
      setHasDataInRange(false);
      return;
    }

    // Step 1: Process raw data
    const processedData: ProcessedData[] = [];

    csvText.forEach((device) => {
      const volume = parseVolume(device["IV,0,0,0,m^3,Vol"]);

      // Convert from cubic meters to liters (1 m³ = 1000 L)
      // Preserve decimal precision for exact values
      const volumeInLiters = volume * 1000;

      // Skip zero or negative volumes
      if (volumeInLiters <= 0) return;

      const dateTimeString = device["IV,0,0,0,,Date/Time"];
      if (!dateTimeString) return;

      const parsedDate = parseTimestamp(dateTimeString);

      // Apply date range filter
      if (!isWithinDateRange(parsedDate, startDate, endDate)) return;

      processedData.push({
        date: parsedDate,
        deviceId: device.ID.toString(),
        volume: volumeInLiters,
      });
    });

    // Step 2: Check if we have data
    const dataInRange = processedData.length > 0;
    setHasDataInRange(dataInRange);

    if (!dataInRange) {
      setChartData([]);
      return;
    }

    // Step 3: Determine appropriate granularity
    const granularity = determineGranularity(processedData, startDate, endDate);

    // Step 4: Aggregate data by granularity
    const aggregatedData = aggregateDataByGranularity(
      processedData,
      granularity
    );

    // Step 5: Generate zero-padded data for consistent chart display
    const zeroPaddedData = generateZeroPaddedData(
      aggregatedData,
      granularity,
      startDate,
      endDate
    );

    setChartData(zeroPaddedData);

    // Step 6: Calculate Y-axis domain and formatter
    if (zeroPaddedData.length > 0) {
      const values = zeroPaddedData.map((item) => item.value);
      const maxValue = Math.max(...values);
      const minValue = Math.min(...values);

      const domainMax = Math.ceil(maxValue * 1.1) || 100; // Ensure minimum domain
      const domainMin = Math.max(0, Math.floor(minValue * 0.9));

      let formatter: (value: number) => string;
      if (domainMax >= 1000000) {
        formatter = (value) => `${(value / 1000000).toFixed(1)}M`;
      } else if (domainMax >= 1000) {
        formatter = (value) => `${(value / 1000).toFixed(1)}k`;
      } else {
        formatter = (value) => value.toString();
      }

      setYAxisDomain([domainMin, domainMax]);
      setTickFormatter(() => formatter);
    }
  }, [csvText, startDate, endDate, chartType, isEmpty]);

  const gradientId = `gradient-${color.replace("#", "")}`;

  return (
    <div className="rounded-2xl shadow p-4 bg-white px-5 h-full flex flex-col">
      <div className="flex pb-3 border-b border-b-dark_green/10 items-center justify-between mb-1">
        <h2 className="text-lg font-medium max-small:text-sm max-medium:text-sm text-gray-800">
          {title}
        </h2>
        <Image
          width={24}
          height={24}
          sizes="100vw"
          loading="lazy"
          className="w-5 h-5 max-small:max-w-4 max-small:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
          src={chartType === "hot" ? hot_water : cold_water}
          alt="chart-type"
        />
      </div>

      <div className="flex-1">
        {isEmpty || !hasDataInRange ? (
          <EmptyState
            title={
              !hasDataInRange && startDate && endDate
                ? "Keine Daten im gewählten Zeitraum"
                : (emptyTitle ?? "Keine Daten verfügbar.")
            }
            description={
              !hasDataInRange && startDate && endDate
                ? `Keine ${chartType === "hot" ? "Warmwasser" : "Kaltwasser"}-Messwerte zwischen ${startDate.toLocaleDateString("de-DE")} und ${endDate.toLocaleDateString("de-DE")} gefunden`
                : (emptyDescription ?? "Keine Daten verfügbar.")
            }
            imageSrc={chartType === "hot" ? hot_water.src : cold_water.src}
            imageAlt={chartType === "hot" ? "Warmwasser" : "Kaltwasser"}
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData.map((d) => ({ month: d.label, actual: d.value }))}
              margin={{ top: 10, right: -30, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                tick={{ fill: color, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                orientation="right"
                domain={yAxisDomain}
                tickFormatter={tickFormatter}
                tick={{ fill: color, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: 10, borderColor: color }}
                formatter={(value: number) => {
                  if (value === 0) {
                    return [
                      `0 L`,
                      chartType === "hot" ? "Warmwasser" : "Kaltwasser",
                    ];
                  }
                  return [
                    `${value.toLocaleString("de-DE", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 3,
                    })} L`,
                    chartType === "hot" ? "Warmwasser" : "Kaltwasser",
                  ];
                }}
              />
              <Area
                type="monotone"
                dataKey="actual"
                fill={`url(#${gradientId})`}
                stroke={color}
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
