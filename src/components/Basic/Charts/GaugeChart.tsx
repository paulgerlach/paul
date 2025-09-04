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
}

// Helper: get recent reading date from dataset
const getRecentReadingDate = (readings: MeterReadingType[]): Date | null => {
  if (!readings || readings.length === 0) return null;
  const dateString = readings[0]["IV,0,0,0,,Date/Time"]?.split(" ")[0];
  if (!dateString) return null;
  const [day, month, year] = dateString.split(".").map(Number);
  return new Date(year, month - 1, day);
};

// Helper: aggregate heat energy (Wh) per historical month with dates
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

// Helper: aggregate water volume (m^3) per historical month with dates
const getMonthlyVolumeDataWithDates = (
  readings: MeterReadingType[]
): { date: Date; value: number }[] => {
  const monthlyData: { date: Date; value: number }[] = [];
  const mostRecentDate = getRecentReadingDate(readings);
  if (!mostRecentDate) return [];

  for (let i = 0; i <= 30; i += 2) {
    const key = `IV,${i},0,0,m^3,Vol` as keyof MeterReadingType;
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

export default function GaugeChart({
  heatReadings,
  coldWaterReadings,
  hotWaterReadings,
  pricing,
  isEmpty,
  emptyTitle,
  emptyDescription,
}: GaugeChartProps & { isEmpty?: boolean; emptyTitle?: string; emptyDescription?: string }) {
  const { startDate, endDate, meterIds } = useChartStore();
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

    // Filter by selected meterIds if provided
    const filterByMeterIds = (arr: MeterReadingType[]) =>
      meterIds && meterIds.length > 0 ? arr.filter((d) => meterIds.includes(d.ID)) : arr;

    const heatFiltered = filterByMeterIds(heat);
    const coldFiltered = filterByMeterIds(cold);
    const hotFiltered = filterByMeterIds(hot);

    // Build monthly series for all and filtered
    const fullHeatSeries = getMonthlyEnergyDataWithDates(heat);
    const fullColdSeries = getMonthlyVolumeDataWithDates(cold);
    const fullHotSeries = getMonthlyVolumeDataWithDates(hot);

    const filteredHeatSeries = getMonthlyEnergyDataWithDates(heatFiltered);
    const filteredColdSeries = getMonthlyVolumeDataWithDates(coldFiltered);
    const filteredHotSeries = getMonthlyVolumeDataWithDates(hotFiltered);

    const withinDate = ({ date }: { date: Date }) => {
      if (!startDate || !endDate) return true;
      return date >= startDate && date <= endDate;
    };

    const filteredHeatByDate = filteredHeatSeries.filter(withinDate);
    const filteredColdByDate = filteredColdSeries.filter(withinDate);
    const filteredHotByDate = filteredHotSeries.filter(withinDate);

    const totalAllWh = fullHeatSeries.reduce((sum, d) => sum + d.value, 0);
    const totalAllM3Cold = fullColdSeries.reduce((sum, d) => sum + d.value, 0);
    const totalAllM3Hot = fullHotSeries.reduce((sum, d) => sum + d.value, 0);

    const totalFilteredWh = filteredHeatByDate.reduce((sum, d) => sum + d.value, 0);
    const totalFilteredM3Cold = filteredColdByDate.reduce((sum, d) => sum + d.value, 0);
    const totalFilteredM3Hot = filteredHotByDate.reduce((sum, d) => sum + d.value, 0);

    const allCostEUR =
      (totalAllWh / 1000) * selectedPricing.energyPerKWhEUR +
      totalAllM3Cold * selectedPricing.coldWaterPerM3EUR +
      totalAllM3Hot * selectedPricing.hotWaterPerM3EUR;

    const filteredCostEUR =
      (totalFilteredWh / 1000) * selectedPricing.energyPerKWhEUR +
      totalFilteredM3Cold * selectedPricing.coldWaterPerM3EUR +
      totalFilteredM3Hot * selectedPricing.hotWaterPerM3EUR;

    const percentValue = allCostEUR > 0 ? Math.min(filteredCostEUR / allCostEUR, 1) : filteredCostEUR > 0 ? 1 : 0;

    return { percent: percentValue, euroCost: filteredCostEUR };
  }, [heatReadings, coldWaterReadings, hotWaterReadings, pricing, startDate, endDate, meterIds]);

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

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`Gauge chart showing ${Math.round(value)} percent used`}
      className={`rounded-xl relative shadow p-4 bg-white w-full h-full ${isEmpty ? "flex flex-col" : ""}`}
    >
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <h2 className="text-lg max-small:text-sm max-medium:text-sm font-medium text-gray-800">Gesamtkosten</h2>
        <Image
          width={0}
          height={0}
          loading="lazy"
          className="w-6 h-6 max-small:max-w-4 max-small:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
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
          <div className="absolute bottom-[15%] left-1/2 translate-x-[-50%] text-sm text-[#9CA3AF] font-medium w-full text-center">
            <span>Gesamtkosten: {formattedCost}</span>
          </div>
        </>
      )}
    </div>
  );
}
