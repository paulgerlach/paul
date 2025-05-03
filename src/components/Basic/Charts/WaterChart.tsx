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

const data = [
  { month: "JUL", actual: 2000, lastYear: 3200 },
  { month: "AUG", actual: 1800, lastYear: 3000 },
  { month: "SEP", actual: 2500, lastYear: 3400 },
];

export default function WarmwasserChart({
  color,
  title,
  chartType,
}: {
  color: string;
  title: string;
  chartType: "hot" | "cold";
}) {
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
          data={data}
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
