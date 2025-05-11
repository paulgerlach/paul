"use client";

import { cold_water, hot_water } from "@/static/icons";
import Image from "next/image";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import { useEffect, useState } from "react";

function parseCsvData(csvText: string) {
  const result = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: true,
  });

  const rows = result.data.slice(1); // skip header
  const volumeIndex = 16;
  const usageStart = volumeIndex + 1;
  const usageEnd = usageStart + 16;

  return rows.map((row) => {
    const id = row[3];
    const history = row
      .slice(usageStart, usageEnd)
      .map((v) => parseFloat((v || "0").replace(",", ".")))
      .reverse(); // chronological order
    return { id, history };
  });
}

export default function WarmwasserChart({
  color,
  title,
  chartType,
  csvText,
}: {
  color: string;
  title: string;
  chartType: "hot" | "cold";
  csvText: string;
}) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const parsed = parseCsvData(csvText);
    console.log("parsed", parsed);

    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const groupedData: { [key: string]: { actual: number; lastYear: number } } =
      {};

    // Initialize the grouped data object
    months.forEach((month) => {
      groupedData[month] = { actual: 0, lastYear: 0 };
    });

    // Process each device's data and group by month
    parsed.forEach((device) => {
      const actualHistory = device.history.slice(-12); // Last 12 months (actual)
      const lastYearHistory = device.history.slice(0, -12); // First 12 months (last year)

      actualHistory.forEach((value, index) => {
        const month = months[index % 12];
        groupedData[month].actual += value; // Add actual values
        groupedData[month].lastYear += lastYearHistory[index] ?? 0; // Add last year values
      });
    });

    // Convert grouped data into an array for the chart
    const dataForChart = months.map((month) => ({
      month,
      actual: groupedData[month].actual,
      lastYear: groupedData[month].lastYear,
    }));

    setChartData(dataForChart);
  }, [csvText]);

  console.log(chartData, "[]");

  const gradientId = `gradient-${color.replace("#", "")}`;

  return (
    <div className="rounded-2xl row-span-5 shadow p-4 bg-white px-5">
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2 mr-8">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-6 max-h-6"
          src={chartType === "hot" ? hot_water : cold_water}
          alt="chart-type"
        />
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: -30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="month"
            tick={{ fill: color, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            orientation="right"
            domain={[0, 4000]}
            tickFormatter={(value) => `${value / 1000}k`}
            tick={{ fill: color, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 10, borderColor: color }}
            formatter={(value: number, name: string) => [
              `${value.toLocaleString()} L`,
              name === "actual" ? "Aktuell" : "Vorjahr",
            ]}
          />
          <Area
            type="monotone"
            dataKey="actual"
            fill={`url(#${gradientId})`}
            stroke={color}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="lastYear"
            stroke={color}
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
