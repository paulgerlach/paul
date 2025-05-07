"use client";

import { cross_arrows } from "@/static/icons";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function GaugeChart({ percent = 0.72 }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(container);
    return () => observer.unobserve(container);
  }, []);

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
  const { width, height } = size;

  const cx = "50%";
  const cy = "50%";

  const pixelCx = width / 2;
  const pixelCy = height / 2;
  const oR = Math.min(width, height) * 0.5;
  const iR = oR * 0.8;
  const midR = (iR + oR) / 2;

  const data = [
    { name: "used", value, color: "#B0C5F1" },
    { name: "unused", value: 100 - value, color: "#F2F2F2" },
  ];

  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const currentAngle = 180 - (data[0].value / total) * 180;
  const rad = (Math.PI * currentAngle) / 180;
  const dotX = pixelCx + midR * Math.cos(-rad);
  const dotY = pixelCy + midR * Math.sin(-rad);

  const formattedCost = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(34321);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`Gauge chart showing ${Math.round(value)} percent used`}
      className="rounded-xl row-span-4 relative shadow p-4 bg-white w-full h-full">
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-gray-800">Gesamtkosten</h2>
        <Image
          width={24}
          height={24}
          loading="lazy"
          className="w-6 h-6"
          src={cross_arrows}
          alt="Kreuzpfeile Symbol"
        />
      </div>

      <ResponsiveContainer width="100%" height="100%">
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

          {width > 0 && height > 0 && (
            <circle
              cx={dotX}
              cy={dotY}
              r={16}
              fill="#B0C5F1"
              stroke="#FFFFFF"
              strokeWidth={6}
            />
          )}

          <Tooltip
            formatter={(value: number, name: string) => [
              `${Math.round(value)}%`,
              name === "used" ? "Verbraucht" : "Frei",
            ]}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              border: "1px solid #E5E7EB", // optional subtle border
              color: "#374151", // optional text color
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              zIndex: "999",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute bottom-[20%] left-1/2 translate-x-[-50%] text-3xl font-semibold text-[#374151]">
        {Math.round(value)}%
      </div>
      <div className="absolute bottom-[5%] left-1/2 translate-x-[-50%] text-sm text-[#9CA3AF] font-medium">
        Gesamtkosten: {formattedCost}
      </div>
    </div>
  );
}
