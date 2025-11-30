"use client";

import { cross_arrows } from "@/static/icons";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { type MeterReadingType } from "@/api";
import { useChartStore } from "@/store/useChartStore";
import { EmptyState } from "@/components/Basic/ui/States";

interface GaugeChartProps {
  heatReadings?: MeterReadingType[];
  coldWaterReadings?: MeterReadingType[];
  hotWaterReadings?: MeterReadingType[];
  pricing?: {
    energyPerKWhEUR?: number;
    coldWaterPerM3EUR?: number;
    hotWaterPerM3EUR?: number;
  };
  monthlyAdvancePayment?: number; // Nebenkostenvorauszahlung
}

// Helper: get recent reading date from dataset
const getRecentReadingDate = (readings: MeterReadingType[]): Date | null => {
  if (!readings || readings.length === 0) return null;
  const rawDate = readings[0]["IV,0,0,0,,Date/Time"];
  if (!rawDate || typeof rawDate !== "string") return null;
  const dateString = rawDate.split(" ")[0];
  if (!dateString) return null;
  const [day, month, year] = dateString.split(".").map(Number);
  return new Date(year, month - 1, day);
};

// Helper: get current heat energy (Wh) from actual readings
// Supports both OLD format (IV,0,0,0,Wh,E) and NEW Engelmann format (Actual Energy / HCA)
const getCurrentEnergyData = (readings: MeterReadingType[]): number => {
  if (!readings || readings.length === 0) return 0;

  let totalValue = 0;
  readings.forEach((reading) => {
    // Try OLD format first
    let currentValue: string | number | undefined = reading["IV,0,0,0,Wh,E"] as number | undefined;
    
    // If OLD format doesn't exist, try NEW Engelmann format
    if (currentValue === undefined || currentValue === null) {
      currentValue = reading["Actual Energy / HCA"] as string | number | undefined;
    }
    
    if (typeof currentValue === "string") {
      const parsedValue = parseFloat(
        currentValue.replace(",", ".") || "0"
      );
      // Convert MWh to Wh if the value is very small (likely MWh)
      // Engelmann format uses MWh, old format uses Wh
      if (parsedValue < 1 && parsedValue > 0) {
        totalValue += parsedValue * 1000000; // Convert MWh to Wh
      } else {
        totalValue += parsedValue;
      }
    } else if (typeof currentValue === "number") {
      // Same conversion logic for numbers
      if (currentValue < 1 && currentValue > 0) {
        totalValue += currentValue * 1000000; // Convert MWh to Wh
      } else {
        totalValue += currentValue;
      }
    }
  });

  return totalValue;
};

// Helper: get current water volume (m^3) from actual readings
// Supports both OLD format (IV,0,0,0,m^3,Vol) and NEW Engelmann format (Actual Volume)
const getCurrentVolumeData = (readings: MeterReadingType[]): number => {
  if (!readings || readings.length === 0) return 0;

  let totalValue = 0;
  readings.forEach((reading) => {
    // Try OLD format first
    let currentValue: string | number | undefined = reading["IV,0,0,0,m^3,Vol"] as number | undefined;
    
    // If OLD format doesn't exist, try NEW Engelmann format
    if (currentValue === undefined || currentValue === null) {
      currentValue = reading["Actual Volume"] as string | number | undefined;
    }
    
    if (typeof currentValue === "string") {
      totalValue += parseFloat(
        currentValue.replace(",", ".") || "0"
      );
    } else if (typeof currentValue === "number") {
      totalValue += currentValue;
    }
  });

  return totalValue;
};

export default function GaugeChart({
  heatReadings,
  coldWaterReadings,
  hotWaterReadings,
  pricing,
  monthlyAdvancePayment,
  isEmpty,
  emptyTitle,
  emptyDescription,
}: GaugeChartProps & {
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Compute totals and percent based on filters
  const { percent, euroCost } = useMemo(() => {
    const heat = Array.isArray(heatReadings) ? heatReadings : [];
    const cold = Array.isArray(coldWaterReadings) ? coldWaterReadings : [];
    const hot = Array.isArray(hotWaterReadings) ? hotWaterReadings : [];

    if (heat.length === 0 && cold.length === 0 && hot.length === 0) {
      return { percent: 0, euroCost: 0 };
    }

    const selectedPricing = {
      energyPerKWhEUR: pricing?.energyPerKWhEUR ?? 0.3,
      coldWaterPerM3EUR: pricing?.coldWaterPerM3EUR ?? 4.0,
      hotWaterPerM3EUR: pricing?.hotWaterPerM3EUR ?? 8.0,
    };

    // Get current actual readings only - no simulated historical data
    const currentHeatWh = getCurrentEnergyData(heat);
    const currentColdM3 = getCurrentVolumeData(cold);
    const currentHotM3 = getCurrentVolumeData(hot);

    // Calculate total cost based on current readings
    const totalCostEUR =
      (currentHeatWh / 1000) * selectedPricing.energyPerKWhEUR +
      currentColdM3 * selectedPricing.coldWaterPerM3EUR +
      currentHotM3 * selectedPricing.hotWaterPerM3EUR;

    // Calculate percentage: Gesamtkosten / Nebenkostenvorauszahlung
    // < 100% = Good (user gets refund)
    // = 100% = Perfect (no adjustment)
    // > 100% = Over budget (user owes extra)
    let percentValue = 0;
    if (monthlyAdvancePayment && monthlyAdvancePayment > 0) {
      percentValue = totalCostEUR / monthlyAdvancePayment;
    } else {
      // Fallback: if no advance payment data, show 100% when there are costs
      percentValue = totalCostEUR > 0 ? 1 : 0;
    }

    return { percent: percentValue, euroCost: totalCostEUR };
  }, [heatReadings, coldWaterReadings, hotWaterReadings, pricing, monthlyAdvancePayment]);

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
  }).format(euroCost);

  // Calculate difference (Differenz = Vorauszahlung - Gesamtkosten)
  const difference = monthlyAdvancePayment ? monthlyAdvancePayment - euroCost : 0;
  const formattedDifference = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    signDisplay: "always",
  }).format(difference);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`Gauge chart showing ${Math.round(value)} percent used`}
      className={`rounded-xl relative shadow p-4 bg-white w-full h-full ${isEmpty ? "flex flex-col" : ""}`}
    >
      <div className="flex pb-3 border-b border-b-dark_green/10 items-center justify-between mb-1">
        <h2 className="text-lg max-small:text-sm max-medium:text-sm font-medium text-gray-800">
          Gesamtkosten
        </h2>
        <Image
          width={0}
          height={0}
          loading="lazy"
          className="w-5 h-5 max-small:max-w-4 max-small:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
          src={cross_arrows}
          alt="Kreuzpfeile Symbol"
        />
      </div>

      {isEmpty ? (
        <EmptyState
          title={emptyTitle ?? "No data available."}
          description={emptyDescription ?? "No data available."}
          imageSrc={cross_arrows.src}
          imageAlt="Gesamtkosten"
        />
      ) : (
        <>
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
                stroke="none"
              >
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

          <div className="absolute bottom-[30%] left-1/2 translate-x-[-50%] text-3xl font-semibold text-[#374151]">
            {value < 1 && value > 0 ? value.toFixed(2) : Math.round(value)}%
          </div>
          <div className="absolute bottom-[15%] left-1/2 translate-x-[-50%] text-xs text-[#9CA3AF] font-medium w-full text-center px-4">
            {monthlyAdvancePayment && monthlyAdvancePayment > 0 ? (
              <div className="flex flex-col gap-0.5">
                <span>Gesamtkosten: {formattedCost}</span>
                <span className={difference > 0 ? "text-green-600" : difference < 0 ? "text-red-600" : "text-gray-600"}>
                  Differenz: {formattedDifference}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                <span>Gesamtkosten: {formattedCost}</span>
                <span className="text-orange-500 text-[10px]">
                  Kein Vertrag mit Nebenkosten
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
