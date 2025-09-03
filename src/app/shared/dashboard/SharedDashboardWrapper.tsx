"use client";

import { useEffect } from 'react';
import { useChartStore } from '@/store/useChartStore';
import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import GaugeChart from "@/components/Basic/Charts/GaugeChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import NotificationsChart from "@/components/Basic/Charts/NotificationsChart";
import WaterChart from "@/components/Basic/Charts/WaterChart";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { ROUTE_HOME } from "@/routes/routes";
import {
  alert_triangle,
  blue_info,
  green_check,
  heater,
  hot_water,
  keys,
  notification,
  pipe_water,
} from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

interface SharedDashboardWrapperProps {
  filteredData: any[];
  filters: {
    startDate?: string;
    endDate?: string; 
    meterIds?: string[];
  };
}

export default function SharedDashboardWrapper({ filteredData, filters }: SharedDashboardWrapperProps) {
  const { setDates, setMeterIds } = useChartStore();
  
  // Set the store state from URL parameters
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      setDates(new Date(filters.startDate), new Date(filters.endDate));
    }
    if (filters.meterIds) setMeterIds(filters.meterIds);
  }, [filters, setDates, setMeterIds]);

  // Filter data exactly like the admin dashboard
  const heatDevices = filteredData?.filter((item: any) => item["Device Type"] === "Heat");
  const coldWaterDevices = filteredData?.filter((item: any) => item["Device Type"] === "Water");
  const hotWaterDevices = filteredData?.filter((item: any) => item["Device Type"] === "WWater");

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <ContentWrapper className="max-h-[90%] grid grid-cols-3 gap-2 grid-rows-10">
        <WaterChart
          csvText={coldWaterDevices}
          color="#6083CC"
          title="Kaltwasser"
          chartType="cold"
        />
        <GaugeChart />
        
        {/* Only fix: Benachrichtigungen - Better space usage */}
        <div className="rounded-2xl row-span-7 shadow p-4 bg-white px-5">
          <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-gray-800">
              Benachrichtigungen
            </h2>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6"
              src={notification}
              alt="notification"
            />
          </div>
          <div className="space-y-2 h-[calc(100%-6rem)] overflow-y-auto">
            {[
              { leftIcon: keys, rightIcon: green_check, leftBg: "#E7E8EA", rightBg: "#E7F2E8", title: "Mieter eingezogen", subtitle: "WE PL12VH3OGr" },
              { leftIcon: hot_water, rightIcon: blue_info, leftBg: "#E7E8EA", rightBg: "#E5EBF5", title: "Mieter eingezogen", subtitle: "WE PL12VH3OGr" },
              { leftIcon: heater, rightIcon: blue_info, leftBg: "#E7E8EA", rightBg: "#E5EBF5", title: "Mieter eingezogen", subtitle: "WE PL12VH3OGr" },
              { leftIcon: pipe_water, rightIcon: alert_triangle, leftBg: "#E7E8EA", rightBg: "#F7E7D5", title: "Mieter eingezogen", subtitle: "WE PL12VH3OGr" },
              { leftIcon: keys, rightIcon: blue_info, leftBg: "#E7E8EA", rightBg: "#E5EBF5", title: "Mieter eingezogen", subtitle: "WE PL12VH3OGr" }
            ].map((n, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: n.leftBg }}
                  >
                    <Image width={16} height={16} src={n.leftIcon} alt="icon" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500">{n.subtitle}</p>
                  </div>
                </div>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: n.rightBg }}
                >
                  <Image width={12} height={12} src={n.rightIcon} alt="status" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-b-dark_green/10">
            <Link
              className="text-[10px] text-link text-center underline w-full inline-block"
              href={ROUTE_HOME}>
              Weitere Benachrichtigungen anzeigen
            </Link>
          </div>
        </div>

        <HeatingCosts csvText={heatDevices} />
        <WaterChart
          csvText={hotWaterDevices}
          color="#E74B3C"
          title="Warmwasser"
          chartType="hot"
        />
        <EinsparungChart />
      </ContentWrapper>
    </div>
  );
}
