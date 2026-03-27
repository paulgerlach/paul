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
import { aggregateHCADataByTimeRange } from "@/services/heatingCostServices/heatingCostServices";
import { monthNames } from "@/lib/constants/date";
interface HeatingCostsProps {
  csvText?: MeterReadingType[];
}


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

  const getRandomPlaceholder = () => {
    return Math.floor(Math.random() * 9501) + 500;
  }

  
  const data = useMemo(() => {
    if (!csvText || !Array.isArray(csvText)) {
      return [];
    }

    // Data is already filtered by meter IDs at database level
    // const filteredDevices = csvText;
    // Use the new aggregation function
    const aggregatedHCAData = aggregateHCADataByTimeRange(
      csvText,
      startDate,
      endDate
    );

    // console.log('AGGREGATE DATA', aggregatedHCAData)
    // If we have raw device data but no readings for the selected date range,
    // show 0 value for each day in the range instead of "no data available"
    // This provides better UX - users see "0 consumption" rather than ambiguous "no data"
    if (aggregatedHCAData.length === 0 && csvText.length > 0 && startDate && endDate) {
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

    return [
      { label: '2025-12', value: getRandomPlaceholder() },
      { label: '2026-01', value: getRandomPlaceholder() },
      { label: '2026-02', value: getRandomPlaceholder() },
    ];
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
        {/* {isEmpty ? (
          <EmptyState
            title={emptyTitle ?? "No data available."}
            description={emptyDescription ?? "No data available."}
            imageSrc={heater.src}
            imageAlt="Heizkosten"
          />
        ) : ( */}
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
                    return [`${formattedValue} ${ "Einh."}`, "Heizkosten"];
                }}
              />
              <Bar
                dataKey="value"
                background={{ fill: "#e2e8f0", radius: 10 }}
                fill="#90b4e4"
                radius={[10, 10, 10, 10]}
              >
                  {data && data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#90b4e4" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        {/* )} */}
      </div>
    </div>
  );
}
