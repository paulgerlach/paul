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

// Helper function to extract the most recent reading date
const getRecentReadingDate = (readings: MeterReadingType[]): Date | null => {
  if (!readings || readings.length === 0) return null;

  const dateString = readings[0]["IV,0,0,0,,Date/Time"]?.split(" ")[0];

  if (!dateString) return null;

  const [day, month, year] = dateString.split(".").map(Number);

  return new Date(year, month - 1, day);
};

// New helper function to get historical data with associated dates
function getMonthlyDataWithDatesAndValues(
  meterReading: MeterReadingType,
  recentDate: Date
) {
  const history = [];
  for (let i = 30; i >= 0; i -= 2) {
    const key = `IV,${i},0,0,Wh,E` as keyof MeterReadingType;
    const value = meterReading[key];
    const historicalDate = new Date(recentDate);
    historicalDate.setMonth(recentDate.getMonth() - i / 2);
    let parsedValue = 0;

    if (typeof value === "string") {
      parsedValue = parseFloat(value.replace(",", "."));
    } else if (typeof value === "number") {
      parsedValue = value;
    }

    history.push({ date: historicalDate, value: parsedValue });
  }

  return history.reverse();
}

const months = [
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
}: {
  color: string;
  title: string;
  chartType: "hot" | "cold";
  csvText?: MeterReadingType[];
}) {
  const [chartData, setChartData] = useState<any[]>([]);
  const { startDate, endDate, meterIds } = useChartStore(); // Access the state from the store

  useEffect(() => {
    if (!csvText || csvText.length === 0) {
      return;
    }

    const recentReadingDate = getRecentReadingDate(csvText);
    if (!recentReadingDate) {
      return;
    }

    // Filter devices based on meterIds from the store
    const filteredDevices = (meterIds.length > 0)
      ? csvText.filter((device) => meterIds.includes(device.ID.toString()))
      : [];

    // Aggregate historical data from the filtered devices
    const combinedHistory = filteredDevices.flatMap((device) =>
      getMonthlyDataWithDatesAndValues(device, recentReadingDate)
    );

    // Filter the combined data based on the date range from the store
    const filteredData = combinedHistory.filter(({ date }) => {
      if (!startDate || !endDate) return true;
      return date >= startDate && date <= endDate;
    });

    const groupedData: {
      [key: string]: { actual: number; lastYear: number };
    } = {};

    months.forEach((month) => {
      groupedData[month] = { actual: 0, lastYear: 0 };
    });

    // Group the filtered data by month and year
    filteredData.forEach(({ date, value }) => {
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();

      // Simple logic to distinguish between the current year's data and the previous year's
      if (year === recentReadingDate.getFullYear()) {
        groupedData[monthName].actual += value;
      } else if (year === recentReadingDate.getFullYear() - 1) {
        groupedData[monthName].lastYear += value;
      }
    });

    // Convert grouped data into an array for the chart
    const dataForChart = months.map((month) => ({
      month,
      actual: groupedData[month].actual,
      lastYear: groupedData[month].lastYear,
    }));

    setChartData(dataForChart);
  }, [csvText, startDate, endDate, meterIds]); // Add startDate and endDate to the dependency array

  const gradientId = `gradient-${color.replace("#", "")}`;

  return (
    <div className="rounded-2xl row-span-5 shadow p-4 bg-white px-5">
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2 mr-8">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-6 max-h-6"
          src={chartType === "hot" ? hot_water : cold_water}
          alt="chart-type"
        />
      </div>

      <ResponsiveContainer width="100%" height="80%">
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
            domain={[0, 4000]}
            tickFormatter={(value) => `${value / 1000}k`}
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
    </div>
  );
}
