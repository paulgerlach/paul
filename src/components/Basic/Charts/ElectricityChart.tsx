"use client";

import { useMemo } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { type MeterReadingType } from "@/api";
import { useChartStore } from "@/store/useChartStore";
import { EmptyState } from "@/components/Basic/ui/States";
import { electricity } from "@/static/icons";
import Image from "next/image";

interface ElectricityChartProps {
  electricityReadings?: MeterReadingType[];
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

// Get recent reading date from dataset (first row date is enough as dumps are aligned)
const getRecentReadingDate = (readings: MeterReadingType[]): Date | null => {
  if (!readings || readings.length === 0) return null;
  const dateString = readings[0]["IV,0,0,0,,Date/Time"]?.split(" ")[0];
  if (!dateString) return null;
  const [day, month, year] = dateString.split(".").map(Number);
  return new Date(year, month - 1, day);
};

// Get current energy readings from actual meter data
const getCurrentEnergyReadings = (
  readings: MeterReadingType[]
): { date: Date; totalWh: number }[] => {
  if (!readings || readings.length === 0) return [];

  // Group readings by their actual timestamp and sum the energy values
  const dateGroups: {
    [dateKey: string]: { date: Date; totalWh: number; meterCount: number };
  } = {};

  readings.forEach((reading) => {
    const dateString = reading["IV,0,0,0,,Date/Time"]?.split(" ")[0];
    if (!dateString) return;

    const [day, month, year] = dateString.split(".").map(Number);
    const readingDate = new Date(year, month - 1, day);
    const dateKey = `${year}-${month - 1}-${day}`;

    // Get current energy reading (cumulative)
    const currentReading = reading["IV,0,0,0,Wh,E"];
    let energyValue = 0;

    if (typeof currentReading === "number") {
      energyValue = currentReading;
    } else if (typeof currentReading === "string") {
      energyValue =
        parseFloat((currentReading as string).replace(",", ".")) || 0;
    }

    // Filter out invalid readings (error codes like 88888888, 77777777, 99999999)
    if (energyValue > 0 && energyValue < 10000000 && !isNaN(energyValue)) {
      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = { date: readingDate, totalWh: 0, meterCount: 0 };
      }
      dateGroups[dateKey].totalWh += energyValue;
      dateGroups[dateKey].meterCount += 1;
    }
  });

  // Convert to array and sort by date
  return Object.values(dateGroups)
    .filter((group) => group.meterCount > 0)
    .map((group) => ({
      date: group.date,
      totalWh: group.totalWh, // Sum of all meter readings for this date
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];

// Helper function to determine label granularity based on date range
const getLabelsForRange = (
  startDate: Date | null,
  endDate: Date | null
): string[] => {
  if (!startDate || !endDate) {
    // Default to last 12 months when no range selected
    const labels: string[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(now.getMonth() - i);
      labels.push(MONTHS[d.getMonth()]);
    }
    return labels;
  }

  const monthsSpan =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1;

  // Up to 2 months → show daily labels
  if (monthsSpan <= 2) {
    const labels: string[] = [];
    const cur = new Date(startDate);
    const end = new Date(endDate);
    cur.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    while (cur <= end) {
      labels.push(`${cur.getDate()} ${MONTHS[cur.getMonth()]}`);
      cur.setDate(cur.getDate() + 1);
    }
    return labels;
  } else {
    // Monthly labels for longer ranges
    const labels: string[] = [];
    const startMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1
    );
    const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    const cursor = new Date(startMonth);
    while (cursor <= endMonth) {
      labels.push(MONTHS[cursor.getMonth()]);
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return labels;
  }
};

export default function ElectricityChart({
  electricityReadings,
  isEmpty,
  emptyTitle,
  emptyDescription,
}: ElectricityChartProps) {
  const { startDate, endDate } = useChartStore();

  const { data, maxKWh } = useMemo(() => {
    const readings = Array.isArray(electricityReadings)
      ? electricityReadings
      : [];

    // Check if we have any valid electricity readings first
    if (readings.length === 0) {
      return {
        data: [],
        maxKWh: 0,
      };
    }

    // Get current actual readings only
    const currentReadings = getCurrentEnergyReadings(readings);

    // Filter by date range if specified
    const filteredByDate = currentReadings.filter(({ date }) => {
      if (!startDate || !endDate) return true;
      return date >= startDate && date <= endDate;
    });

    // Generate labels for the selected time range
    const labels = getLabelsForRange(startDate, endDate);

    // Create chart data showing current readings
    const rows: { label: string; kwh: number }[] = [];

    if (filteredByDate.length > 0) {
      // We have actual data - show the current total consumption
      const totalCurrentWh = filteredByDate.reduce(
        (sum, reading) => sum + reading.totalWh,
        0
      );
      const totalCurrentKwh = totalCurrentWh / 1000;

      // For now, show the current reading as a single point
      // In a real scenario, you'd distribute this across the time period or show historical data
      labels.forEach((label, index) => {
        rows.push({
          label,
          kwh: index === labels.length - 1 ? totalCurrentKwh : 0, // Show all consumption in the last period
        });
      });
    } else {
      // No data available
      labels.forEach((label) => {
        rows.push({
          label,
          kwh: 0,
        });
      });
    }

    return {
      data: rows,
      maxKWh: rows.reduce((m, r) => (r.kwh > m ? r.kwh : m), 0),
    };
  }, [electricityReadings, startDate, endDate]);

  console.log("Test data Elec:", data);

  // Medium benchmark per image: 2-person household ≈210 kWh/month
  const BENCHMARK_KWH_PER_MONTH = 210;

  const showEmpty =
    isEmpty || (data?.length ?? 0) === 0 || electricityReadings?.length === 0;

  // enrich with moving average and benchmark per row for composed chart
  const chartData = useMemo(() => {
    const windowSize = 3;
    const out = data.map((d, idx) => {
      const start = Math.max(0, idx - (windowSize - 1));
      const slice = data.slice(start, idx + 1);
      const avg = slice.reduce((s, r) => s + r.kwh, 0) / slice.length;
      return {
        ...d,
        avg,
      };
    });
    return out;
  }, [data]);

  const yMax = useMemo(() => {
    const values = chartData.map((d) => d.kwh as number);
    const maxData = values.length ? Math.max(...values) : 0;
    const maxVal = maxData;
    const step = maxVal >= 100 ? 50 : maxVal >= 50 ? 10 : maxVal >= 10 ? 5 : 1;
    return Math.ceil((maxVal * 1.1) / step) * step;
  }, [chartData]);

  return (
    <div className="rounded-2xl shadow p-4 bg-white px-5 h-full flex flex-col">
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <h2 className="text-lg max-small:text-sm max-medium:text-sm font-medium text-gray-800">
          Stromverbrauch
        </h2>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-6 max-h-6 max-small:max-w-5 max-small:max-h-5 max-medium:max-w-5 max-medium:max-h-5"
          src={electricity}
          alt="electricity"
        />
      </div>

      <div className="flex-1 flex items-center">
        {showEmpty ? (
          <div className="h-full flex items-center">
            <EmptyState
              title={emptyTitle ?? "Keine Daten verfügbar."}
              description={
                emptyDescription ?? "Keine Stromdaten im ausgewählten Zeitraum."
              }
              imageSrc={electricity.src}
              imageAlt="Stromverbrauch"
            />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ left: 4, right: 12, top: 8 }}
            >
              <defs>
                <linearGradient id="elecGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FDBA74" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#EEF2F7" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                width={36}
                tickFormatter={(v: any) => `${Math.round(v)}`}
                domain={[0, yMax]}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: number) => `${(v as number).toFixed(0)} kWh`}
                labelFormatter={(l: any) => `${l}`}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
              />
              <Legend
                verticalAlign="top"
                height={24}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="avg"
                name="Ø (3M)"
                stroke="#FBBF24"
                fill="#FEF3C7"
                fillOpacity={0.6}
              />
              <Bar
                dataKey="kwh"
                name="kWh"
                radius={[8, 8, 8, 8]}
                fill="url(#elecGradient)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
