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

// Helper to parse German number format
const parseGermanNumber = (value: string | number | undefined): number | null => {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") return value;
  const str = String(value).trim();
  if (str === "") return null;
  const normalized = str.replace(/\./g, "").replace(/,/g, ".");
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
};

// Calculate MONTHLY CONSUMPTION using embedded IV historical columns
// This is more reliable than calculating deltas from consecutive readings
// IV columns contain month-end snapshots: IV,0=current, IV,1=last month end, IV,3=2 months ago
const calculateMonthlyConsumptionFromIVColumns = (
  readings: MeterReadingType[]
): { monthOffset: number; consumption: number }[] => {
  if (!readings || readings.length === 0) return [];

  // Aggregate consumption by month offset across all devices
  // monthOffset: 0 = current month, 1 = last month, 2 = 2 months ago, etc.
  const monthlyTotals = new Map<number, number>();

  // Group readings by device to avoid double-counting
  const deviceMap = new Map<string, MeterReadingType>();
  readings.forEach((reading) => {
    const deviceId = String(reading.ID || "unknown");
    // Keep the most recent reading per device
    if (!deviceMap.has(deviceId)) {
      deviceMap.set(deviceId, reading);
    }
  });

  // For each device, extract monthly consumption from IV columns
  deviceMap.forEach((reading) => {
    // IV column indices for energy (Wh,E) - try both patterns
    // Some CSVs use IV,0, IV,2, IV,4... others use IV,0, IV,1, IV,3, IV,5...
    const ivIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    
    const cumulativeValues: { index: number; value: number }[] = [];
    
    for (const i of ivIndices) {
      const key = `IV,${i},0,0,Wh,E` as keyof MeterReadingType;
      const rawValue = reading[key];
      const value = parseGermanNumber(rawValue);
      
      // Filter out error codes and zero values (except IV,0 which can be current reading)
      if (value !== null && value >= 0 && value < 100000000) {
        cumulativeValues.push({ index: i, value });
      }
    }

    if (cumulativeValues.length < 2) return; // Need at least 2 values for consumption

    // Sort by index to ensure chronological order (IV,0 is most recent)
    cumulativeValues.sort((a, b) => a.index - b.index);

    // Calculate consumption as delta between consecutive cumulative values
    // IV,0 - IV,1 = current month consumption
    // IV,1 - IV,3 = last month consumption (or IV,1 - IV,2)
    for (let i = 0; i < cumulativeValues.length - 1; i++) {
      const current = cumulativeValues[i];
      const previous = cumulativeValues[i + 1];
      
      const consumption = current.value - previous.value;
      
      if (consumption >= 0) {
        // Month offset is based on position in array (0 = most recent month)
        const monthOffset = i;
        monthlyTotals.set(monthOffset, (monthlyTotals.get(monthOffset) || 0) + consumption);
      }
    }
  });

  return Array.from(monthlyTotals.entries())
    .map(([monthOffset, consumption]) => ({ monthOffset, consumption }))
    .sort((a, b) => b.monthOffset - a.monthOffset); // Oldest first for chronological display
};

// Helper function to aggregate consumption data by time range
// Uses IV columns for reliable monthly consumption data
const aggregateDataByTimeRange = (
  readings: MeterReadingType[],
  startDate?: Date,
  endDate?: Date
): { label: string; value: number }[] => {
  if (!readings || readings.length === 0) return [];

  // Filter out invalid readings first
  const validReadings = readings.filter(isValidReading);

  // Calculate monthly consumption from IV columns (most reliable for heating)
  const monthlyConsumption = calculateMonthlyConsumptionFromIVColumns(validReadings);

  if (monthlyConsumption.length === 0) return [];

  // Determine how many months to show based on date range
  const requestedDaysDiff = startDate && endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 30;
  
  const monthsToShow = Math.ceil(requestedDaysDiff / 30);

  // Get current date for calculating actual month names
  const now = endDate || new Date();
  
  // Convert month offsets to actual month names and filter by requested range
  const result: { label: string; value: number }[] = [];
  
  for (const { monthOffset, consumption } of monthlyConsumption) {
    // Only include months within the requested range
    if (monthOffset >= monthsToShow) continue;
    
    // Calculate the actual month for this offset
    const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const monthName = monthNames[monthDate.getMonth()];
    
    // For quarterly view (>1 year), aggregate by quarter
    if (requestedDaysDiff > 365) {
      const quarter = Math.ceil((monthDate.getMonth() + 1) / 3);
      const quarterLabel = `Q${quarter} ${monthDate.getFullYear()}`;
      
      // Find or create quarter entry
      const existingIdx = result.findIndex(r => r.label === quarterLabel);
      if (existingIdx >= 0) {
        result[existingIdx].value += consumption;
  } else {
        result.push({ label: quarterLabel, value: consumption });
      }
    } else {
      result.push({ label: monthName, value: Math.round(consumption * 100) / 100 });
    }
  }

  // Sort chronologically (oldest first) and round values
  result.reverse();
  return result.map(r => ({ ...r, value: Math.round(r.value * 100) / 100 }));
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
