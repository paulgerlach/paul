"use client";

import { heater } from "@/static/icons";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useMemo, useState, useEffect } from "react";
import { type MeterReadingType } from "@/api";
import { useChartStore } from "@/store/useChartStore";
import { EmptyState } from "@/components/Basic/ui/States";
interface HeatingCostsProps {
  csvText?: MeterReadingType[];
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getRecentReadingDate = (readings: MeterReadingType[]): Date | null => {
  if (!readings || readings.length === 0) return null;
  const dateString = readings[0]["IV,0,0,0,,Date/Time"]?.split(" ")[0];
  if (!dateString) return null;
  const [day, month, year] = dateString.split(".").map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to get unique dates from readings
const getUniqueDatesFromReadings = (readings: MeterReadingType[]): Date[] => {
  const uniqueDates = new Set<string>();
  const dates: Date[] = [];

  readings.forEach((reading) => {
    const dateString = reading["IV,0,0,0,,Date/Time"]?.split(" ")[0];
    if (dateString && !uniqueDates.has(dateString)) {
      uniqueDates.add(dateString);
      const [day, month, year] = dateString.split(".").map(Number);
      dates.push(new Date(year, month - 1, day));
    }
  });

  return dates.sort((a, b) => a.getTime() - b.getTime());
};

// Helper function that returns an array with both date and value for monthly historical data
const getMonthlyEnergyDataWithDates = (
  readings: MeterReadingType[]
): { date: Date; value: number }[] => {
  const monthlyData: { date: Date; value: number }[] = [];
  const mostRecentDate = getRecentReadingDate(readings);
  if (!mostRecentDate) return [];

  for (let i = 0; i <= 30; i += 2) {
    const key = `IV,${i},0,0,Wh,E` as keyof MeterReadingType;
    const historicalDate = new Date(mostRecentDate);
    historicalDate.setMonth(mostRecentDate.getMonth() - i / 2);

    let totalValue = 0;
    readings.forEach((reading) => {
      const value = reading[key];
      if (typeof value === "string") {
        totalValue += parseFloat(value.replace(",", ".") || "0");
      } else if (typeof value === "number") {
        totalValue += value;
      }
    });

    monthlyData.unshift({ date: historicalDate, value: totalValue });
  }

  return monthlyData;
};

// Helper function to check if a reading contains error data
const isValidReading = (reading: MeterReadingType): boolean => {
  // Check for error status codes
  const status = reading.Status;
  if (status && status !== "00h") {
    return false; // Status other than 00h indicates error
  }

  // Check for error flags
  const errorFlags =
    reading["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"];
  if (errorFlags && errorFlags !== "0b") {
    return false; // Non-zero error flags indicate problems
  }

  // Check for obvious error values in energy reading
  const currentValue = reading["IV,0,0,0,Wh,E"];
  let numValue = 0;
  if (currentValue != null) {
    numValue =
      typeof currentValue === "number"
        ? currentValue
        : parseFloat(String(currentValue).replace(",", ".") || "0");
  }

  // Filter out obvious error codes (repeated digits like 77777777, 88888888, 99999999)
  if (numValue >= 10000000) {
    // Values above 10 million Wh are likely errors
    return false;
  }

  // Check for error patterns in volume
  const volume = reading["IV,0,0,0,m^3,Vol"];
  let volumeValue = 0;
  if (volume != null) {
    volumeValue =
      typeof volume === "number"
        ? volume
        : parseFloat(String(volume).replace(",", ".") || "0");
  }

  // Filter out obvious volume error codes (777.777, 888.888, 999.999)
  if (
    volumeValue >= 777 &&
    (Math.abs(volumeValue - 777.777) < 0.001 ||
      Math.abs(volumeValue - 888.888) < 0.001 ||
      Math.abs(volumeValue - 999.999) < 0.001)
  ) {
    return false;
  }

  return true;
};

// Helper function to aggregate data by actual date ranges
const aggregateDataByTimeRange = (
  readings: MeterReadingType[],
  startDate?: Date,
  endDate?: Date
): { label: string; value: number }[] => {
  if (!readings || readings.length === 0) return [];

  // Filter out invalid readings first
  const validReadings = readings.filter(isValidReading);

  // Get unique dates from valid readings and sort them
  const uniqueDates = getUniqueDatesFromReadings(validReadings);

  // Filter by date range if provided
  let filteredDates = uniqueDates;
  if (startDate && endDate) {
    filteredDates = uniqueDates.filter(
      (date) => date >= startDate && date <= endDate
    );
  }

  if (filteredDates.length === 0) return [];

  const oldestDate = filteredDates[0];
  const newestDate = filteredDates[filteredDates.length - 1];
  const daysDiff = Math.ceil(
    (newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const monthsDiff = Math.ceil(daysDiff / 30);

  // Aggregate readings by date for current energy values
  const readingsByDate = new Map<string, number>();
  validReadings.forEach((reading) => {
    const dateString = reading["IV,0,0,0,,Date/Time"]?.split(" ")[0];
    if (!dateString) return;

    const [day, month, year] = dateString.split(".").map(Number);
    const date = new Date(year, month - 1, day);

    // Check if date is in range
    if (startDate && endDate && (date < startDate || date > endDate)) return;

    const currentValue = reading["IV,0,0,0,Wh,E"];
    let numValue = 0;
    if (currentValue != null) {
      numValue =
        typeof currentValue === "number"
          ? currentValue
          : parseFloat(String(currentValue).replace(",", ".") || "0");
    }

    const dateKey = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    readingsByDate.set(dateKey, (readingsByDate.get(dateKey) || 0) + numValue);
  });

  // Decide aggregation level based on time range
  if (daysDiff <= 30) {
    // Daily data for <= 30 days
    return Array.from(readingsByDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, value]) => {
        const [year, month, day] = dateKey.split("-");
        return {
          label: `${day} ${monthNames[parseInt(month) - 1]}`,
          value,
        };
      });
  } else if (monthsDiff <= 4) {
    // Monthly data for <= 4 months
    const monthlyData = new Map<string, number>();

    readingsByDate.forEach((value, dateKey) => {
      const [year, month] = dateKey.split("-");
      const monthKey = `${year}-${month}`;
      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + value);
    });

    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, value]) => {
        const [year, month] = monthKey.split("-");

        return {
          label: `${monthNames[parseInt(month) - 1]}`,
          value,
        };
      });
  } else {
    // Quarterly data for > 4 months
    const quarterlyData = new Map<string, number>();

    readingsByDate.forEach((value, dateKey) => {
      const [year, month] = dateKey.split("-");
      const quarter = Math.ceil(parseInt(month) / 3);
      const quarterKey = `Q${quarter}`;
      quarterlyData.set(
        quarterKey,
        (quarterlyData.get(quarterKey) || 0) + value
      );
    });

    return Array.from(quarterlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([quarterKey, value]) => ({
        label: quarterKey,
        value,
      }));
  }
};

export default function HeatingCosts({
  csvText,
  isEmpty,
  emptyTitle,
  emptyDescription,
}: HeatingCostsProps & {
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const { startDate, endDate } = useChartStore();
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 10000]);
  const [tickFormatter, setTickFormatter] = useState<(value: number) => string>(
    () => (value: number) => `${value.toLocaleString()}`
  );

  const data = useMemo(() => {
    if (!csvText || !Array.isArray(csvText)) {
      return [];
    }

    // Data is already filtered by meter IDs at database level
    const filteredDevices = csvText;

    // Use the new aggregation function
    return aggregateDataByTimeRange(
      filteredDevices,
      startDate || undefined,
      endDate || undefined
    );
  }, [csvText, startDate, endDate]);

  console.log("HeatingCosts data:", csvText, data);

  // Calculate dynamic domain and formatting based on chart data
  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((item) => item.value);
      const maxValue = Math.max(...values);

      // Add padding to the domain (10% above max, start from 0)
      const domainMax = Math.ceil(maxValue * 1.1);
      const domainMin = 0;

      // Determine appropriate tick formatter based on the scale of values
      let formatter: (value: number) => string;

      if (domainMax >= 1000000) {
        // For millions of Wh (MWh)
        formatter = (value) => `${(value / 1000000).toFixed(1)}M`;
      } else if (domainMax >= 1000) {
        // For thousands of Wh (kWh)
        formatter = (value) => `${(value / 1000).toFixed(1)}k`;
      } else {
        // For smaller values (Wh)
        formatter = (value) => value.toLocaleString();
      }

      setYAxisDomain([domainMin, domainMax]);
      setTickFormatter(() => formatter);
    }
  }, [data]);

  return (
    <div
      className={`rounded-xl shadow p-4 bg-white h-full flex flex-col ${isEmpty ? "flex flex-col" : ""}`}
    >
      <div className="flex pb-3 border-b border-b-dark_green/10 items-center justify-between mb-1">
        <h2 className="text-lg font-medium max-small:text-sm max-medium:text-sm text-gray-800">
          Heizkosten
        </h2>
        <Image
          width={24}
          height={24}
          sizes="100%"
          loading="lazy"
          className="w-5 h-5 max-small:max-w-4 max-small:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
          src={heater}
          alt="heater"
        />
      </div>
      <div className="flex-1">
        {isEmpty ? (
          <EmptyState
            title={emptyTitle ?? "No data available."}
            description={emptyDescription ?? "No data available."}
            imageSrc={heater.src}
            imageAlt="Heizkosten"
          />
        ) : (
          <ResponsiveContainer
            className="heating-costs"
            width="100%"
            height="100%"
          >
            <BarChart data={data}>
              <XAxis
                orientation="top"
                dataKey="label"
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={yAxisDomain} />
              <Tooltip
                formatter={(value: number) => {
                  const formattedValue = tickFormatter(value);
                  return [`${formattedValue} Wh`, "Heizkosten"];
                }}
              />
              <Bar
                dataKey="value"
                background={{ fill: "#e2e8f0", radius: 10 }}
                fill="#90b4e4"
                radius={[10, 10, 10, 10]}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#90b4e4" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
