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
  
  // Support both OLD format (IV,0,0,0,,Date/Time) and NEW format (Actual Date / Raw Date)
  const oldFormatDate = readings[0]["IV,0,0,0,,Date/Time"];
  const newActualDate = readings[0]["Actual Date"];
  const newRawDate = readings[0]["Raw Date"];
  
  let dateString: string | null = null;
  
  if (oldFormatDate && typeof oldFormatDate === "string") {
    dateString = oldFormatDate.split(" ")[0];
  } else if (newActualDate && typeof newActualDate === "string") {
    dateString = newActualDate.split(" ")[0];
  } else if (newRawDate && typeof newRawDate === "string") {
    // Convert "29-10-2025" to "29.10.2025"
    dateString = newRawDate.replace(/-/g, ".");
  }
  
  if (!dateString) return null;
  const [day, month, year] = dateString.split(".").map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to get unique dates from readings
const getUniqueDatesFromReadings = (readings: MeterReadingType[]): Date[] => {
  const uniqueDates = new Set<string>();
  const dates: Date[] = [];

  readings.forEach((reading) => {
    // Support both OLD format (IV,0,0,0,,Date/Time) and NEW format (Actual Date / Raw Date)
    const oldFormatDate = reading["IV,0,0,0,,Date/Time"];
    const newActualDate = reading["Actual Date"];
    const newRawDate = reading["Raw Date"];
    
    let dateString: string | null = null;
    
    if (oldFormatDate && typeof oldFormatDate === "string") {
      dateString = oldFormatDate.split(" ")[0];
    } else if (newActualDate && typeof newActualDate === "string") {
      dateString = newActualDate.split(" ")[0];
    } else if (newRawDate && typeof newRawDate === "string") {
      dateString = newRawDate.replace(/-/g, ".");
    }
    
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
  // Support both OLD format (IV,0,0,0,Wh,E) and NEW format (Actual Energy / HCA)
  const oldFormatEnergy = reading["IV,0,0,0,Wh,E"];
  const newFormatEnergy = reading["Actual Energy / HCA"];
  const currentValue = newFormatEnergy !== undefined ? newFormatEnergy : oldFormatEnergy;
  
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
  // Support both OLD format (IV,0,0,0,m^3,Vol) and NEW format (Actual Volume)
  const oldFormatVolume = reading["IV,0,0,0,m^3,Vol"];
  const newFormatVolume = reading["Actual Volume"];
  const volume = newFormatVolume !== undefined ? newFormatVolume : oldFormatVolume;
  
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

// Helper function to parse reading date
const parseReadingDate = (reading: MeterReadingType): Date | null => {
  const oldFormatDate = reading["IV,0,0,0,,Date/Time"];
  const newActualDate = reading["Actual Date"];
  const newRawDate = reading["Raw Date"];
  
  let dateString: string | null = null;
  
  if (oldFormatDate && typeof oldFormatDate === "string") {
    dateString = oldFormatDate.split(" ")[0];
  } else if (newActualDate && typeof newActualDate === "string") {
    dateString = newActualDate.split(" ")[0];
  } else if (newRawDate && typeof newRawDate === "string") {
    dateString = newRawDate.replace(/-/g, ".");
  }
  
  if (!dateString) return null;
  
  const [day, month, year] = dateString.split(".").map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  return new Date(year, month - 1, day);
};

// Helper function to parse energy value from reading
const parseEnergyValue = (reading: MeterReadingType): number => {
  const oldFormatEnergy = reading["IV,0,0,0,Wh,E"];
  const newFormatEnergy = reading["Actual Energy / HCA"];
  const currentValue = newFormatEnergy !== undefined ? newFormatEnergy : oldFormatEnergy;
  
  if (currentValue == null) return 0;
  
  const numValue = typeof currentValue === "number"
    ? currentValue
    : parseFloat(String(currentValue).replace(",", ".") || "0");
  
  return isNaN(numValue) ? 0 : numValue;
};

// =============================================================================
// ROOT FIX: Aggregate data using IV,x COLUMNS for historical data
// The CSV data embeds historical readings in columns (IV,0, IV,2, IV,4, etc.)
// NOT across multiple rows. This is critical for correct monthly aggregation.
// =============================================================================

/**
 * Extract historical energy consumption from IV,x columns
 * Returns array of { date, consumption } where consumption = IV[n] - IV[n+1]
 */
const extractHistoricalConsumptionFromDevice = (
  reading: MeterReadingType,
  mostRecentDate: Date
): { date: Date; consumption: number }[] => {
  const consumptionData: { date: Date; consumption: number }[] = [];
  
  // Heat meters use IV,0, IV,1, IV,3, IV,5, IV,7... for Wh,E (ODD indices after 0 and 1)
  // Verified against actual CSV data from Worringerestrasse86
  const indices = [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
  const values: { index: number; value: number }[] = [];
  
  for (const i of indices) {
    const key = `IV,${i},0,0,Wh,E` as keyof MeterReadingType;
    const rawValue = reading[key];
    
    if (rawValue == null) continue;
    
    let numValue: number;
    if (typeof rawValue === "number") {
      numValue = rawValue;
    } else {
      numValue = parseFloat(String(rawValue).replace(",", ".") || "0");
    }
    
    // Filter out error codes (very large numbers like 77777777)
    // Also filter out 0 values for historical columns (IV,1 and beyond) as they indicate "no data"
    // IV,0 can be 0 legitimately (no consumption yet this month)
    const isValidValue = !isNaN(numValue) && numValue >= 0 && numValue < 100000000;
    const isHistoricalZero = i > 0 && numValue === 0;
    
    if (isValidValue && !isHistoricalZero) {
      values.push({ index: i, value: numValue });
    }
  }
  
  // Need at least 2 values to calculate consumption
  if (values.length < 2) return [];
  
  // Sort by index (lower index = more recent data)
  values.sort((a, b) => a.index - b.index);
  
  // Calculate consumption between consecutive readings
  // Each pair of readings represents one month's consumption
  // Position 0 in array = current month, position 1 = previous month, etc.
  for (let i = 0; i < values.length - 1; i++) {
    const current = values[i];
    const previous = values[i + 1];
    const consumption = current.value - previous.value;
    
    // Only include positive consumption (cumulative values should decrease going back)
    if (consumption >= 0) {
      // Calculate the date for this consumption period
      // Position i in the sorted array represents i months back from most recent date
      const monthsBack = i;
      const consumptionDate = new Date(mostRecentDate);
      consumptionDate.setMonth(mostRecentDate.getMonth() - monthsBack);
      
      consumptionData.push({
        date: consumptionDate,
        consumption: consumption
      });
    }
  }
  
  return consumptionData;
};

// Helper function to aggregate data by actual date ranges
// ROOT FIX: Uses IV,x COLUMNS for historical data, NOT consecutive CSV rows
const aggregateDataByTimeRange = (
  readings: MeterReadingType[],
  startDate?: Date,
  endDate?: Date
): { label: string; value: number }[] => {
  if (!readings || readings.length === 0) return [];

  // Filter out invalid readings first
  const validReadings = readings.filter(isValidReading);
  if (validReadings.length === 0) return [];

  // Get the most recent date from readings (for calculating historical dates)
  const mostRecentDate = getRecentReadingDate(validReadings);
  if (!mostRecentDate) return [];

  // Calculate the requested date range span
  let requestedDaysDiff = 30; // Default
  if (startDate && endDate) {
    requestedDaysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // STEP 1: Extract ALL historical consumption from IV columns for each device
  const allConsumptionData: { date: Date; consumption: number }[] = [];
  const processedDeviceIds = new Set<string>();

  validReadings.forEach((reading) => {
    const deviceId = String(reading.ID || reading["Number Meter"] || "unknown");
    
    // Skip if we've already processed this device
    if (processedDeviceIds.has(deviceId)) return;
    processedDeviceIds.add(deviceId);
    
    const deviceDate = parseReadingDate(reading) || mostRecentDate;
    const deviceConsumption = extractHistoricalConsumptionFromDevice(reading, deviceDate);
    allConsumptionData.push(...deviceConsumption);
  });

  if (allConsumptionData.length === 0) return [];

  // STEP 2: Filter by date range if specified
  const filteredData = allConsumptionData.filter(item => {
    if (!startDate || !endDate) return true;
    return item.date >= startDate && item.date <= endDate;
  });

  if (filteredData.length === 0) return [];

  // STEP 3: Aggregate by time granularity based on REQUESTED range (not data range)
  if (requestedDaysDiff <= 31) {
    // Daily view - show individual consumption points
    const dailyData = new Map<string, number>();
    
    filteredData.forEach(item => {
      const dateKey = `${item.date.getFullYear()}-${(item.date.getMonth() + 1).toString().padStart(2, "0")}-${item.date.getDate().toString().padStart(2, "0")}`;
      dailyData.set(dateKey, (dailyData.get(dateKey) || 0) + item.consumption);
    });

    return Array.from(dailyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey]) => {
        const [, month, day] = dateKey.split("-");
        return {
          label: `${day} ${monthNames[parseInt(month) - 1]}`,
          value: Math.round((dailyData.get(dateKey) || 0) * 100) / 100,
        };
      });
  } else if (requestedDaysDiff <= 120) {
    // Monthly view for <= 4 months
    const monthlyData = new Map<string, number>();

    filteredData.forEach(item => {
      const monthKey = `${item.date.getFullYear()}-${(item.date.getMonth() + 1).toString().padStart(2, "0")}`;
      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + item.consumption);
    });

    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, value]) => {
        const [, month] = monthKey.split("-");
        return {
          label: `${monthNames[parseInt(month) - 1]}`,
          value: Math.round(value * 100) / 100,
        };
      });
  } else {
    // Quarterly view for > 4 months
    const quarterlyData = new Map<string, number>();

    filteredData.forEach(item => {
      const quarter = Math.ceil((item.date.getMonth() + 1) / 3);
      const quarterKey = `${item.date.getFullYear()}-Q${quarter}`;
      quarterlyData.set(quarterKey, (quarterlyData.get(quarterKey) || 0) + item.consumption);
    });

    return Array.from(quarterlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([quarterKey, value]) => {
        const [, quarter] = quarterKey.split("-");
        return {
          label: quarter,
          value: Math.round(value * 100) / 100,
        };
      });
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
    const aggregatedData = aggregateDataByTimeRange(
      filteredDevices,
      startDate || undefined,
      endDate || undefined
    );

    // If we have raw device data but no readings for the selected date range,
    // show 0 value for each day in the range instead of "no data available"
    // This provides better UX - users see "0 consumption" rather than ambiguous "no data"
    if (aggregatedData.length === 0 && filteredDevices.length > 0 && startDate && endDate) {
      const result: { label: string; value: number }[] = [];
      const currentDate = new Date(startDate);
      const end = new Date(endDate);
      
      while (currentDate <= end) {
        result.push({
          label: `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]}`,
          value: 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return result;
    }

    return aggregatedData;
  }, [csvText, startDate, endDate]);

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
