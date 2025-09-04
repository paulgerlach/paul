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

// Aggregate energy (Wh) per historical month with dates from IV keys
const getMonthlyEnergyDataWithDates = (
  readings: MeterReadingType[]
): { date: Date; valueWh: number }[] => {
  const result: { date: Date; valueWh: number }[] = [];
  const mostRecentDate = getRecentReadingDate(readings);
  if (!mostRecentDate) return result;

  for (let i = 0; i <= 30; i += 2) {
    const key = `IV,${i},0,0,Wh,E` as keyof MeterReadingType;
    const d = new Date(mostRecentDate);
    d.setMonth(mostRecentDate.getMonth() - i / 2);

    let total = 0;
    readings.forEach((r) => {
      const v = r[key] as unknown as number | string | undefined;
      if (typeof v === "string") total += parseFloat(v.replace(",", ".") || "0");
      else if (typeof v === "number") total += v;
    });

    result.push({ date: d, valueWh: total });
  }

  // ensure asc by date
  result.sort((a, b) => a.date.getTime() - b.date.getTime());
  return result;
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

export default function ElectricityChart({
  electricityReadings,
  isEmpty,
  emptyTitle,
  emptyDescription,
}: ElectricityChartProps) {
  const { startDate, endDate, meterIds } = useChartStore();

  const { data, maxKWh, usedDummy } = useMemo(() => {
    const readings = Array.isArray(electricityReadings)
      ? electricityReadings
      : [];

    const calcIsDaily = (): boolean => {
      if (!startDate || !endDate) return false;
      const startY = startDate.getFullYear();
      const endY = endDate.getFullYear();
      const startM = startDate.getMonth();
      const endM = endDate.getMonth();
      const span = (endY - startY) * 12 + (endM - startM) + 1;
      return span <= 2;
    };

    // optional filtering by selected meters
    const filteredByMeter =
      meterIds && meterIds.length > 0
        ? readings.filter((d) => meterIds.includes(d.ID))
        : readings;

    const series = getMonthlyEnergyDataWithDates(filteredByMeter);

    const filteredByDate = series.filter(({ date }) => {
      if (!startDate || !endDate) return true;
      return date >= startDate && date <= endDate;
    });

    let rows = filteredByDate.map(({ date, valueWh }) => ({
      label: MONTHS[date.getMonth()],
      kwh: valueWh / 1000,
    }));

    // If no data, or demo flag set, synthesize dummy data that respects day-vs-month labeling
    const forceDummy = process.env.NEXT_PUBLIC_ELEC_DUMMY === "1";
    if (rows.length === 0 || forceDummy) {
      const labels: string[] = [];

      // Decide label granularity based on selected range (like WaterChart)
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const monthsSpan = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;

        if (monthsSpan <= 2) {
          const cur = new Date(start);
          cur.setHours(0, 0, 0, 0);
          const endNorm = new Date(end);
          endNorm.setHours(0, 0, 0, 0);
          while (cur <= endNorm) {
            labels.push(`${cur.getDate()} ${MONTHS[cur.getMonth()]}`);
            cur.setDate(cur.getDate() + 1);
          }

          // Daily dummy around ~7 kWh/day (≈210/30)
          const baseDaily = 7;
          rows = labels.map((label, idx) => {
            const jitter = ((idx * 7) % 6) - 3; // +/-3 kWh
            return { label, kwh: Math.max(1, baseDaily + jitter) };
          });
        } else {
          // Monthly dummy strictly from start→end (respect selection)
          const startMonth = new Date(start.getFullYear(), start.getMonth(), 1);
          const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
          const cursor = new Date(startMonth);
          let i = 0;
          while (cursor <= endMonth) {
            labels.push(MONTHS[cursor.getMonth()]);
            cursor.setMonth(cursor.getMonth() + 1);
            i++;
          }
          const baseMonthly = 210;
          rows = labels.map((label, idx) => {
            const jitter = ((idx * 29) % 80) - 40; // +/-40 kWh
            return { label, kwh: Math.max(120, baseMonthly + jitter) };
          });
        }
      } else {
        // No date filter → 12 recent months
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now);
          d.setMonth(now.getMonth() - i);
          labels.push(MONTHS[d.getMonth()]);
        }
        const baseMonthly = 210;
        rows = labels.map((label, i) => {
          const jitter = ((i * 29) % 80) - 40;
          return { label, kwh: Math.max(120, baseMonthly + jitter) };
        });
      }

      return {
        data: rows,
        maxKWh: rows.reduce((m, r) => (r.kwh > m ? r.kwh : m), 0),
        usedDummy: true,
      };
    }

    return {
      data: rows,
      maxKWh: rows.reduce((m, r) => (r.kwh > m ? r.kwh : m), 0),
      usedDummy: false,
    };
  }, [electricityReadings, startDate, endDate, meterIds]);

  // Medium benchmark per image: 2-person household ≈210 kWh/month
  const BENCHMARK_KWH_PER_MONTH = 210;

  const showEmpty = (!usedDummy && (isEmpty || (data?.length ?? 0) === 0));

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
        <h2 className="text-lg max-small:text-sm max-medium:text-sm font-medium text-gray-800">Stromverbrauch</h2>
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
            <ComposedChart data={chartData} margin={{ left: 4, right: 12, top: 8 }}>
              <defs>
                <linearGradient id="elecGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FDBA74" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#EEF2F7" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis width={36} tickFormatter={(v) => `${Math.round(v)}`} domain={[0, yMax]} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v: number) => `${(v as number).toFixed(0)} kWh`}
                labelFormatter={(l) => `${l}`}
                contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8 }}
              />
              <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="avg" name="Ø (3M)" stroke="#FBBF24" fill="#FEF3C7" fillOpacity={0.6} />
              <Bar dataKey="kwh" name="kWh" radius={[8, 8, 8, 8]} fill="url(#elecGradient)" />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}


