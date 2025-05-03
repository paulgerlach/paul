"use client";

import { cross_arrows } from "@/static/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const cx = 160; // center x
const cy = 140; // center y
const iR = 100; // inner radius
const oR = 120; // outer radius
const midR = (iR + oR) / 2; // mid radius for the dot

export default function GaugeChart({ percent = 0.72 }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(percent * eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percent]);

  const value = animatedPercent * 100;
  const data = [
    { name: "used", value, color: "#B0C5F1" },
    { name: "unused", value: 100 - value, color: "#F2F2F2" },
  ];

  // Convert percentage to angle for the arc (180° = full half-circle)
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const currentAngle = 180 - (data[0].value / total) * 180;
  const rad = (Math.PI * currentAngle) / 180;

  // Dot position in the middle of the gauge stroke
  const dotX = cx + midR * Math.cos(-rad);
  const dotY = cy + midR * Math.sin(-rad);

  return (
    <div className="rounded-xl row-span-4 relative shadow p-4 bg-white">
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-gray-800">Gesamtkosten</h2>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-6 max-h-6"
          src={cross_arrows}
          alt="cross_arrows"
        />
      </div>
      <ResponsiveContainer width="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx={cx}
            cy={cy}
            innerRadius={iR}
            outerRadius={oR}
            cornerRadius={10}
            stroke="none">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          {/* Moving Dot in center of gauge stroke */}
          <circle
            cx={dotX}
            cy={dotY}
            r={16}
            fill="#B0C5F1"
            stroke="#FFFFFF"
            strokeWidth={6}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Percentage text */}
      <div className="absolute bottom-2/10 left-1/2 translate-x-[-50%] text-3xl font-semibold text-[#374151]">
        {Math.round(value)}%
      </div>

      {/* Subtitle text */}
      <div className="absolute bottom-1/10 left-1/2 translate-x-[-50%] text-sm text-[#9CA3AF] font-medium">
        Gesamtkosten: 34.321€
      </div>
    </div>
  );
}
