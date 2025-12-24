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

// Helper function to aggregate data by actual date ranges
// Uses IV historical columns to calculate CONSUMPTION (not cumulative sums)
const aggregateDataByTimeRange = (
  readings: MeterReadingType[],
  startDate?: Date,
  endDate?: Date
): { label: string; value: number }[] => {
  if (!readings || readings.length === 0) return [];

  // Filter out invalid readings first
  const validReadings = readings.filter(isValidReading);
  if (validReadings.length === 0) return [];

  // Determine date range for display
  const now = endDate || new Date();
  const rangeStart = startDate || new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const daysDiff = Math.ceil((now.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
  const monthsToShow = Math.max(2, Math.ceil(daysDiff / 30));

  // STEP 1: Get most recent reading per device
  const deviceLatestReading = new Map<string, { reading: MeterReadingType; date: Date }>();
  
  validReadings.forEach((reading) => {
    const deviceId = String(reading.ID || reading["Number Meter"] || "unknown");
    
    // Get date from reading
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
    
    let readingDate = new Date(0);
    if (dateString && dateString !== "00.00.00") {
      const [day, month, year] = dateString.split(".").map(Number);
      const fullYear = year < 100 ? 2000 + year : year;
      readingDate = new Date(fullYear, month - 1, day);
    }
    
    const existing = deviceLatestReading.get(deviceId);
    if (!existing || readingDate > existing.date) {
      deviceLatestReading.set(deviceId, { reading, date: readingDate });
    }
  });

  // STEP 2: Calculate monthly consumption from IV columns for each device
  // IV columns: IV,0 = current, IV,1 = last month end, IV,3 = 2 months ago end
  // Consumption = IV[n] - IV[n+1]
  const monthlyConsumption = new Map<number, number>(); // monthOffset -> total consumption
  
  deviceLatestReading.forEach(({ reading }) => {
    // Get cumulative values from IV columns (try multiple patterns)
    const iv0 = parseGermanNumber(reading["IV,0,0,0,Wh,E"]);
    const iv1 = parseGermanNumber(reading["IV,1,0,0,Wh,E"]);
    const iv2 = parseGermanNumber(reading["IV,2,0,0,Wh,E"]);
    const iv3 = parseGermanNumber(reading["IV,3,0,0,Wh,E"]);
    const iv5 = parseGermanNumber(reading["IV,5,0,0,Wh,E"]);
    
    // Build array of valid cumulative values
    const cumulativeValues: number[] = [];
    if (iv0 !== null && iv0 > 0) cumulativeValues.push(iv0);
    
    // IV,1 is last month - only include if > 0 (0 means no data)
    const lastMonth = iv1 !== null && iv1 > 0 ? iv1 : null;
    if (lastMonth !== null) cumulativeValues.push(lastMonth);
    
    // Try IV,3 first (more common), fall back to IV,2
    const twoMonthsAgo = (iv3 !== null && iv3 > 0) ? iv3 : (iv2 !== null && iv2 > 0 ? iv2 : null);
    if (twoMonthsAgo !== null) cumulativeValues.push(twoMonthsAgo);
    
    // IV,5 for 3 months ago
    if (iv5 !== null && iv5 > 0) cumulativeValues.push(iv5);
    
    // Calculate consumption for each month (delta between consecutive values)
    for (let i = 0; i < cumulativeValues.length - 1; i++) {
      const consumption = cumulativeValues[i] - cumulativeValues[i + 1];
      if (consumption >= 0) {
        monthlyConsumption.set(i, (monthlyConsumption.get(i) || 0) + consumption);
      }
    }
  });

  // STEP 3: Convert month offsets to actual labels
  const result: { label: string; value: number }[] = [];
  
  // monthOffset 0 = current month, 1 = last month, etc.
  for (let offset = 0; offset < monthsToShow && offset < 4; offset++) {
    const consumption = monthlyConsumption.get(offset) || 0;
    if (consumption > 0 || offset < 2) { // Always show at least 2 months
      const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      result.push({
        label: monthNames[monthDate.getMonth()],
        value: Math.round(consumption),
      });
    }
  }
  
  // Return in chronological order (oldest first)
  return result.reverse();
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
