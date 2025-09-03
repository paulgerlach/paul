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

// New helper function that returns an array with both date and value
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

export default function HeatingCosts({ csvText, isEmpty, emptyTitle, emptyDescription }: HeatingCostsProps & { isEmpty?: boolean; emptyTitle?: string; emptyDescription?: string }) {
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

    // Get all historical data with dates
    const monthlyDataWithDates = getMonthlyEnergyDataWithDates(filteredDevices);

    // Filter the data based on the date range from the store
    const filteredData = monthlyDataWithDates.filter(({ date }) => {
      if (!startDate || !endDate) return true; // No filter if dates are not set
      return date >= startDate && date <= endDate;
    });

    // Grouping the filtered data into 3 quarters
    const numMonths = filteredData.length;
    const monthsPerQuarter = Math.floor(numMonths / 3);
    const remainder = numMonths % 3;

    const quarters = [
      { quarter: "Q1", value: 0 },
      { quarter: "Q2", value: 0 },
      { quarter: "Q3", value: 0 },
    ];

    let startIndex = 0;
    // Distribute remaining months among quarters
    for (let i = 0; i < 3; i++) {
      const monthsInThisQuarter = monthsPerQuarter + (i < remainder ? 1 : 0);
      quarters[i].value = filteredData
        .slice(startIndex, startIndex + monthsInThisQuarter)
        .reduce((sum, { value }) => sum + value, 0);
      startIndex += monthsInThisQuarter;
    }

    return quarters;
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
    <div className={`rounded-xl shadow p-4 bg-white h-full flex flex-col ${isEmpty ? "flex flex-col" : ""}`}>
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <h2 className="text-lg font-medium max-small:text-sm max-medium:text-sm text-gray-800">Heizkosten</h2>
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
      <ResponsiveContainer className="heating-costs" width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            orientation="top"
            dataKey="quarter"
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
