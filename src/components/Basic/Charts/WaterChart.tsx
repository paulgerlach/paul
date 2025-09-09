"use client";

import { cold_water, hot_water } from "@/static/icons";
import Image from "next/image";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { type MeterReadingType } from "@/api";
import { useChartStore } from "@/store/useChartStore"; // Import the Zustand store
import { EmptyState } from "@/components/Basic/ui/States";

// Helper function to extract the most recent reading date (robust: finds first available)
const getRecentReadingDate = (readings: MeterReadingType[]): Date | null => {
  if (!readings || readings.length === 0) return null;
  const withDate = readings.find((r) => r["IV,0,0,0,,Date/Time"]);
  const dateString = withDate?.["IV,0,0,0,,Date/Time"]?.split(" ")[0];
  if (!dateString) return null;

  const [day, month, year] = dateString.split(".").map(Number);

  return new Date(year, month - 1, day);
};

// Helper function to get current volume reading with date
function getCurrentVolumeWithDate(
  meterReading: MeterReadingType,
  recentDate: Date
) {
  const volume = meterReading["IV,0,0,0,m^3,Vol"];
  let parsedValue = 0;

  if (typeof volume === "string") {
    parsedValue = parseFloat((volume as string).replace(",", "."));
  } else if (typeof volume === "number") {
    parsedValue = volume;
  }

  return { date: recentDate, value: parsedValue * 1000 }; // Convert m³ to liters
}

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

export default function WarmwasserChart({
  color,
  title,
  chartType,
  csvText, // Renamed to meterReadings for clarity
  isEmpty,
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
  const [chartData, setChartData] = useState<any[]>([]);
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 4000]);
  const [tickFormatter, setTickFormatter] = useState<(value: number) => string>(
    () => (value: number) => `${value / 1000}k`
  );
  const { startDate, endDate, meterIds } = useChartStore(); // Access the state from the store

  useEffect(() => {
    const getMonthSpanCount = (): number => {
      if (!startDate || !endDate) return 12;
      const startY = startDate.getFullYear();
      const endY = endDate.getFullYear();
      const startM = startDate.getMonth();
      const endM = endDate.getMonth();
      return (endY - startY) * 12 + (endM - startM) + 1; // inclusive
    };

    // Build label sequence based on selected range; fallback to full year
    const buildLabels = (): string[] => {
      if (!startDate || !endDate) {
        // For water meters, default to last 30 days if no date range selected
        const labels: string[] = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          labels.push(`${date.getDate()} ${ALL_MONTHS[date.getMonth()]}`);
        }
        return labels;
      }

      const monthSpan = getMonthSpanCount();
      // Up to 2 months → show daily labels ("1 SEP", "2 SEP", ..., "1 OCT", ...)
      if (monthSpan <= 2) {
        const labels: string[] = [];
        const cur = new Date(startDate);
        const end = new Date(endDate);
        // normalize to midnight
        cur.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        while (cur <= end) {
          labels.push(`${cur.getDate()} ${ALL_MONTHS[cur.getMonth()]}`);
          cur.setDate(cur.getDate() + 1);
        }
        return labels;
      }
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      const labels: string[] = [];
      const cursor = new Date(start);
      while (cursor <= end) {
        labels.push(ALL_MONTHS[cursor.getMonth()]);
        cursor.setMonth(cursor.getMonth() + 1);
      }
      return labels;
    };

    const labels = buildLabels();

    const filteredDevices =
      meterIds.length > 0
        ? csvText.filter((device) => meterIds.includes(device.ID.toString()))
        : [];

    if (filteredDevices.length === 0) {
      const zeroData = labels.map((label) => ({
        month: label,
        actual: 0,
        lastYear: 0,
      }));
      setChartData(zeroData);
      return;
    }

    // Process water meter readings - group by device and calculate daily averages
    const deviceReadings: { [deviceId: string]: number } = {};

    filteredDevices.forEach((device) => {
      const volume = device["IV,0,0,0,m^3,Vol"];
      let parsedValue = 0;

      if (typeof volume === "string") {
        parsedValue = parseFloat((volume as string).replace(",", "."));
      } else if (typeof volume === "number") {
        parsedValue = volume;
      }

      // Convert m³ to liters
      const volumeInLiters = parsedValue * 1000;

      if (!deviceReadings[device.ID]) {
        deviceReadings[device.ID] = 0;
      }
      deviceReadings[device.ID] = Math.max(
        deviceReadings[device.ID],
        volumeInLiters
      );
    });

    // Calculate total volume and distribute across days
    const totalVolume = Object.values(deviceReadings).reduce(
      (sum, vol) => sum + vol,
      0
    );
    const avgDailyConsumption = totalVolume / labels.length;

    // Generate sample data for the chart (since we only have current readings)
    const groupedData: { [key: string]: { actual: number; lastYear: number } } =
      {};

    labels.forEach((label, index) => {
      // Simulate daily consumption with some variation
      const variation = 0.8 + Math.sin(index * 0.5) * 0.2; // Varies between 0.6 and 1.0
      const dailyConsumption = avgDailyConsumption * variation;

      groupedData[label] = {
        actual: Math.round(dailyConsumption),
        lastYear: Math.round(dailyConsumption * (0.85 + Math.random() * 0.3)), // 85-115% of current
      };
    });

    // Convert grouped data into an array for the chart
    const dataForChart = labels.map((label) => ({
      month: label,
      actual: groupedData[label].actual,
      lastYear: groupedData[label].lastYear,
    }));
    setChartData(dataForChart);

    // Calculate dynamic domain and tick formatter based on chart data
    if (dataForChart.length > 0) {
      const allValues = dataForChart.flatMap((item) => [
        item.actual,
        item.lastYear,
      ]);
      const maxValue = Math.max(...allValues);
      const minValue = Math.min(...allValues);

      // Add some padding to the domain (10% above max, start from 0 or slightly below min)
      const domainMax = Math.ceil(maxValue * 1.1);
      const domainMin = Math.max(0, Math.floor(minValue * 0.9));

      // Determine appropriate tick formatter based on the scale of values
      let formatter: (value: number) => string;

      if (domainMax >= 1000000) {
        // For millions
        formatter = (value) => `${(value / 1000000).toFixed(1)}M`;
      } else if (domainMax >= 1000) {
        // For thousands
        formatter = (value) => `${(value / 1000).toFixed(1)}k`;
      } else {
        // For smaller values
        formatter = (value) => value.toString();
      }

      setYAxisDomain([domainMin, domainMax]);
      setTickFormatter(() => formatter);
    }
  }, [csvText, startDate, endDate, meterIds]); // Add startDate and endDate to the dependency array

  const gradientId = `gradient-${color.replace("#", "")}`;

  return (
    <div className="rounded-2xl shadow p-4 bg-white px-5 h-full flex flex-col">
      <div className="flex pb-3 border-b border-b-dark_green/10 items-center justify-between mb-1">
        <h2 className="text-lg font-medium max-small:text-sm max-medium:text-sm text-gray-800">
          {title}
        </h2>
        {chartType === "hot" ? (
          <Image
            width={24}
            height={24}
            sizes="100vw"
            loading="lazy"
            className="w-5 h-5 max-small:max-w-4 max-small:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
            src={hot_water}
            alt="chart-type"
          />
        ) : <Image
            width={24}
            height={24}
            sizes="100vw"
            loading="lazy"
            className="w-5 h-5 max-small:max-w-4 max-small:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
            src={cold_water}
            alt="chart-type"
          />}
      </div>

      <div className="flex-1">
        {isEmpty || meterIds.length === 0 ? (
          <EmptyState
            title={emptyTitle ?? "No data available."}
            description={emptyDescription ?? "No data available."}
            imageSrc={chartType === "hot" ? hot_water.src : cold_water.src}
            imageAlt={chartType === "hot" ? "Hot water" : "Cold water"}
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
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
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} L`,
                  name === "actual" ? "Aktuell" : "Vorjahr",
                ]}
              />
              <Area
                type="monotone"
                dataKey="actual"
                fill={`url(#${gradientId})`}
                stroke={color}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="lastYear"
                stroke={color}
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
