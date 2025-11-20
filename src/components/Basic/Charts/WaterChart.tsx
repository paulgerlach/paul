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
  // APPROACH 3: Group by DEVICE first, then calculate consumption between consecutive readings
  
  // Step 1: Group all readings by device ID
  const deviceMap = new Map<string, ProcessedData[]>();
  
  processedData.forEach((item) => {
    if (!deviceMap.has(item.deviceId)) {
      deviceMap.set(item.deviceId, []);
    }
    deviceMap.get(item.deviceId)!.push(item);
  });
  
  // Step 2: For each device, calculate consumption between consecutive readings
  const consumptionByDate = new Map<string, { consumption: number; date: Date }>();
  
  deviceMap.forEach((readings, deviceId) => {
    // Sort readings chronologically
    readings.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Calculate consumption between consecutive readings
    for (let i = 1; i < readings.length; i++) {
      const prev = readings[i - 1];
      const curr = readings[i];
      
      // Calculate consumption = current - previous
      const consumption = curr.volume - prev.volume;
      
      // Only add positive consumption (handles meter rollovers/errors)
      if (consumption >= 0) {
        // Normalize the current reading's date based on granularity
        let normalizedDate: Date;
        let dateKey: string;
        
        switch (granularity) {
          case "hour":
            normalizedDate = new Date(
              curr.date.getFullYear(),
              curr.date.getMonth(),
              curr.date.getDate(),
              curr.date.getHours()
            );
            dateKey = `${normalizedDate.toDateString()}-${normalizedDate.getHours()}`;
            break;
          case "day":
            normalizedDate = new Date(
              curr.date.getFullYear(),
              curr.date.getMonth(),
              curr.date.getDate()
            );
            dateKey = normalizedDate.toDateString();
            break;
          case "month":
            normalizedDate = new Date(curr.date.getFullYear(), curr.date.getMonth(), 1);
            dateKey = `${normalizedDate.getFullYear()}-${normalizedDate.getMonth()}`;
            break;
        }
        
        // Sum consumption for this date across all devices
        if (!consumptionByDate.has(dateKey)) {
          consumptionByDate.set(dateKey, { consumption: 0, date: normalizedDate });
        }
        consumptionByDate.get(dateKey)!.consumption += consumption;
      }
    }
  });
  
  // Step 3: Convert to array and sort by date
  return Array.from(consumptionByDate.entries())
    .map(([_, { consumption, date }]) => ({
      label: formatLabel(date, granularity),
      value: Math.round(consumption * 1000) / 1000, // Round to 3 decimal places
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
      // Support both OLD format (IV,0,0,0,m^3,Vol) and NEW format (Actual Volume)
      const oldFormatVolume = device["IV,0,0,0,m^3,Vol"];
      const newFormatVolume = device["Actual Volume"];
      
      const volume = parseVolume(newFormatVolume !== undefined ? newFormatVolume : (oldFormatVolume ?? 0));

      // Convert from cubic meters to liters (1 m³ = 1000 L)
      // Preserve decimal precision for exact values
      const volumeInLiters = volume * 1000;

      // Skip zero or negative volumes
      if (volumeInLiters <= 0) return;

      // Support both OLD format (IV,0,0,0,,Date/Time) and NEW format (Actual Date / Raw Date)
      const oldFormatDate = device["IV,0,0,0,,Date/Time"];
      const newActualDate = device["Actual Date"];
      const newRawDate = device["Raw Date"];
      
      let dateTimeString: string | null = null;
      
      if (oldFormatDate && typeof oldFormatDate === "string") {
        dateTimeString = oldFormatDate;
      } else if (newActualDate && typeof newActualDate === "string") {
        // New format may include time: "29.10.2025" or "29.10.2025 09:56..."
        const actualTime = device["Actual Time"] || "";
        dateTimeString = actualTime ? `${newActualDate} ${actualTime}` : newActualDate;
      } else if (newRawDate && typeof newRawDate === "string") {
        // Raw Date format: "29-10-2025" → convert to "29.10.2025"
        dateTimeString = newRawDate.replace(/-/g, ".");
      }
      
      if (!dateTimeString || typeof dateTimeString !== "string") return;

      const parsedDate = parseTimestamp(dateTimeString);

      // Apply date range filter
      if (!isWithinDateRange(parsedDate, startDate, endDate)) return;

      // Support both old "ID" field and new "Number Meter" field
      const deviceId = device.ID || device["Number Meter"] || "";

      processedData.push({
        date: parsedDate,
        deviceId: deviceId.toString(),
        volume: volumeInLiters,
      });
    });

    // Step 2: Check if we have data
    const dataInRange = processedData.length > 0;
    setHasDataInRange(dataInRange);

    // 🔍 DEBUG: Log date range filtering
    console.log(`[WaterChart ${chartType}] Date Range:`, {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      processedDataCount: processedData.length,
      sampleDates: processedData.slice(0, 3).map(d => d.date.toISOString())
    });

    if (!dataInRange) {
      console.warn(`[WaterChart ${chartType}] No data in range!`);
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
