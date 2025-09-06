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

const getRecentReadingDate = (readings: MeterReadingType[]): Date | null => {
  if (!readings || readings.length === 0) return null;
  const dateString = readings[0]["IV,0,0,0,,Date/Time"]?.split(" ")[0];
  if (!dateString) return null;
  const [day, month, year] = dateString.split(".").map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to get energy data with dates for different time ranges
const getEnergyDataWithDates = (
  readings: MeterReadingType[],
  startDate?: Date,
  endDate?: Date
): { date: Date; value: number }[] => {
  const energyData: { date: Date; value: number }[] = [];
  const mostRecentDate = getRecentReadingDate(readings);
  if (!mostRecentDate) return [];

  // Calculate the time range
  const rangeStart = startDate || new Date(mostRecentDate.getFullYear(), mostRecentDate.getMonth() - 15, 1);
  const rangeEnd = endDate || mostRecentDate;
  const monthsDiff = (rangeEnd.getFullYear() - rangeStart.getFullYear()) * 12 + (rangeEnd.getMonth() - rangeStart.getMonth());
  const daysDiff = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));

  // Determine granularity based on time range
  if (monthsDiff >= 8) {
    // Quarterly data (8+ months)
    const quarters = Math.ceil(monthsDiff / 3);
    for (let i = 0; i < quarters; i++) {
      const quarterStart = new Date(rangeStart);
      quarterStart.setMonth(rangeStart.getMonth() + i * 3);
      const quarterEnd = new Date(quarterStart);
      quarterEnd.setMonth(quarterStart.getMonth() + 3);

      let totalValue = 0;
      // Sum energy for all months in this quarter
      for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
        const monthIndex = i * 3 + monthOffset;
        const key = `IV,${monthIndex * 2},0,0,Wh,E` as keyof MeterReadingType;

        readings.forEach((reading) => {
          const value = reading[key];
          if (typeof value === "string") {
            totalValue += parseFloat(value.replace(",", ".") || "0");
          } else if (typeof value === "number") {
            totalValue += value;
          }
        });
      }

      energyData.push({ date: quarterStart, value: totalValue });
    }
  } else if (monthsDiff < 1) {
    // Daily data (<3 months)
    const maxDays = Math.min(daysDiff, 90); // Limit to 60 days for performance
    for (let i = 0; i <= maxDays; i++) {
      const key = `IV,${i},0,0,Wh,E` as keyof MeterReadingType;
      const historicalDate = new Date(rangeStart);
      historicalDate.setDate(rangeStart.getDate() + i);

      let totalValue = 0;
      readings.forEach((reading) => {
        const value = reading[key];
        if (typeof value === "string") {
          totalValue += parseFloat(value.replace(",", ".") || "0");
        } else if (typeof value === "number") {
          totalValue += value;
        }
      });

      energyData.push({ date: historicalDate, value: totalValue });
    }
  } else {
    // Monthly data (3-8 months)
    const numMonths = Math.min(monthsDiff + 1, 8); // +1 to include both start and end months, cap at 8
    for (let i = 0; i < numMonths; i++) {
      const key = `IV,${i * 2},0,0,Wh,E` as keyof MeterReadingType;
      const historicalDate = new Date(rangeStart);
      historicalDate.setMonth(rangeStart.getMonth() + i);

      let totalValue = 0;
      readings.forEach((reading) => {
        const value = reading[key];
        if (typeof value === "string") {
          totalValue += parseFloat(value.replace(",", ".") || "0");
        } else if (typeof value === "number") {
          totalValue += value;
        }
      });

      energyData.push({ date: historicalDate, value: totalValue });
    }
  }

  return energyData;
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
  const { startDate, endDate, meterIds } = useChartStore();
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 10000]);
  const [tickFormatter, setTickFormatter] = useState<(value: number) => string>(
    () => (value: number) => `${value.toLocaleString()}`
  );

  const data = useMemo(() => {
    if (!csvText || !Array.isArray(csvText)) {
      return [];
    }

    const filteredDevices =
      meterIds && meterIds.length > 0
        ? csvText.filter((device) => meterIds.includes(device.ID.toString()))
        : csvText;

    // Get energy data with appropriate granularity
    const energyData = getEnergyDataWithDates(filteredDevices, startDate || undefined, endDate || undefined);

    if (energyData.length === 0) return [];

    // Calculate time range to determine display format
    const rangeStart = startDate || energyData[0]?.date;
    const rangeEnd = endDate || energyData[energyData.length - 1]?.date;

    if (!rangeStart || !rangeEnd) return [];

    const monthsDiff = (rangeEnd.getFullYear() - rangeStart.getFullYear()) * 12 + (rangeEnd.getMonth() - rangeStart.getMonth());

    // Format data based on time range
    if (monthsDiff >= 8) {
      // Quarterly display
      return energyData.map((item, index) => ({
        period: `Q${index + 1}`,
        value: item.value,
        date: item.date
      }));
    } else if (monthsDiff < 1) {
      // Daily display
      return energyData.map((item) => ({
        period: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.value,
        date: item.date
      }));
    } else {
      // Monthly display
      return energyData.map((item) => ({
        period: item.date.toLocaleDateString('en-US', { month: 'short' }),
        value: item.value,
        date: item.date
      }));
    }
  }, [csvText, startDate, endDate, meterIds]);

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
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <h2 className="text-lg font-medium max-small:text-sm max-medium:text-sm text-gray-800">
          Heizkosten
        </h2>
        <Image
          width={24}
          height={24}
          sizes="100%"
          loading="lazy"
          className="max-w-6 max-h-6 w-auto max-small:max-w-4 max-small:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
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
                dataKey="period"
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={yAxisDomain} />
              <Tooltip
                formatter={(value: number, name, props) => {
                  const formattedValue = tickFormatter(value);
                  const date = props.payload?.date;
                  const dateStr = date ? date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : '';
                  return [`${formattedValue} Wh`, `Heizkosten${dateStr ? ` (${dateStr})` : ''}`];
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

