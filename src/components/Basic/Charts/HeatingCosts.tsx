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

// Helper function to calculate CONSUMPTION (not cumulative sums)
// Uses the same proven approach as ElectricityChart: delta between consecutive readings per device
const calculateConsumptionByDevice = (
  readings: MeterReadingType[]
): { date: Date; consumption: number }[] => {
  if (!readings || readings.length === 0) return [];

  // Step 1: Group all readings by device ID
  const deviceMap = new Map<string, { date: Date; energyValue: number }[]>();

  readings.forEach((reading) => {
    // Get device ID
    const deviceId = String(reading.ID || "unknown");
    
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
    
    if (!dateString || dateString === "00.00.00") return;

    const [day, month, year] = dateString.split(".").map(Number);
    const fullYear = year > 50 ? (year < 100 ? 1900 + year : year) : (year < 100 ? 2000 + year : year);
    const readingDate = new Date(fullYear, month - 1, day);

    // Get current energy reading (cumulative)
    const oldFormatEnergy = reading["IV,0,0,0,Wh,E"];
    const newFormatEnergy = reading["Actual Energy / HCA"];
    const currentReading = newFormatEnergy !== undefined ? newFormatEnergy : oldFormatEnergy;
    
    let energyValue = 0;
    if (typeof currentReading === "number") {
      energyValue = currentReading;
    } else if (typeof currentReading === "string") {
      energyValue = parseFloat(currentReading.replace(",", ".")) || 0;
    }

    // Filter out invalid readings (error codes)
    if (energyValue > 0 && energyValue < 100000000 && !isNaN(energyValue)) {
      if (!deviceMap.has(deviceId)) {
        deviceMap.set(deviceId, []);
      }
      deviceMap.get(deviceId)!.push({ date: readingDate, energyValue });
    }
  });

  // Step 2: For each device, calculate consumption between consecutive readings
  const consumptionByDate = new Map<string, { date: Date; consumption: number }>();

  deviceMap.forEach((deviceReadings) => {
    // Sort readings chronologically
    deviceReadings.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Calculate consumption between consecutive readings
    for (let i = 1; i < deviceReadings.length; i++) {
      const prev = deviceReadings[i - 1];
      const curr = deviceReadings[i];
      
      // Calculate consumption = current - previous (DELTA)
      const consumption = curr.energyValue - prev.energyValue;
      
      // Only add positive consumption (handles meter rollovers/errors)
      if (consumption >= 0) {
        const dateKey = `${curr.date.getFullYear()}-${curr.date.getMonth()}-${curr.date.getDate()}`;
        
        if (!consumptionByDate.has(dateKey)) {
          consumptionByDate.set(dateKey, { date: curr.date, consumption: 0 });
        }
        consumptionByDate.get(dateKey)!.consumption += consumption;
      }
    }
  });

  return Array.from(consumptionByDate.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Helper function to aggregate consumption data by time range
const aggregateDataByTimeRange = (
  readings: MeterReadingType[],
  startDate?: Date,
  endDate?: Date
): { label: string; value: number }[] => {
  if (!readings || readings.length === 0) return [];

  // Filter out invalid readings first
  const validReadings = readings.filter(isValidReading);

  // Calculate actual CONSUMPTION (deltas), not cumulative sums
  const consumptionData = calculateConsumptionByDevice(validReadings);

  if (consumptionData.length === 0) return [];

  // Filter by date range
  const filteredData = consumptionData.filter(({ date }) => {
    if (!startDate || !endDate) return true;
    return date >= startDate && date <= endDate;
  });

  if (filteredData.length === 0) return [];

  // Determine time range for aggregation granularity
  const requestedDaysDiff = startDate && endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 30;

  // Always use monthly aggregation for heating (data is inherently monthly)
  // Daily view doesn't make sense for heating consumption
  if (requestedDaysDiff <= 365) {
    // Monthly view
    const monthlyData = new Map<string, number>();

    filteredData.forEach(({ date, consumption }) => {
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + consumption);
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
    // Quarterly view for > 1 year
    const quarterlyData = new Map<string, number>();

    filteredData.forEach(({ date, consumption }) => {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      const quarterKey = `${date.getFullYear()}-Q${quarter}`;
      quarterlyData.set(quarterKey, (quarterlyData.get(quarterKey) || 0) + consumption);
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
