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
import { useMemo } from "react";
import Papa from "papaparse";

// const data = [
//   { month: "JUL", value: 2000 },
//   { month: "AUG", value: 3000 },
//   { month: "SEP", value: 2500 },
// ];
interface HeatingCostsProps {
  csvText: string;
}

export default function HeatingCosts({ csvText }: HeatingCostsProps) {
  const data = useMemo(() => {
    const parsed = Papa.parse(csvText.trim(), { header: true });
    if (!parsed.data || !Array.isArray(parsed.data)) return [];

    // Extract monthly values (as floats) from the desired column
    const monthlyValues: number[] = parsed.data.map((row: any) =>
      parseFloat(row["IV,0,0,0,Wh,E"]?.replace(/"/g, "") || "0")
    );

    // Group into 3 quarters (as evenly as possible)
    const groups = [[], [], []] as number[][];
    monthlyValues.forEach((val, idx) => {
      const groupIndex = Math.floor((idx / monthlyValues.length) * 3);
      groups[groupIndex].push(val);
    });

    // Aggregate each group
    const groupedData = groups.map((group, idx) => ({
      quarter: `Q${idx + 1}`,
      value: group.reduce((sum, v) => sum + v, 0),
    }));

    return groupedData;
  }, [csvText]);
  return (
    <div className="rounded-xl row-span-6 shadow p-4 bg-white">
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-gray-800">Heizkosten</h2>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-6 max-h-6"
          src={heater}
          alt="heater"
        />
      </div>
      <ResponsiveContainer className="heating-costs" width="100%" height="80%">
        <BarChart data={data}>
          <XAxis
            orientation="top"
            dataKey="quarter"
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={[0, 10000]} />
          <Tooltip />
          <Bar
            dataKey="value"
            // maxBarSize={40}
            background={{ fill: "#e2e8f0", radius: 10 }}
            fill="#90b4e4"
            radius={[10, 10, 10, 10]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill="#90b4e4" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
