"use client";

import {
  endOfMonth,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { useState } from "react";

import { cn } from "@/utils";
import { Calendar } from "../ui/Calendar";
import { useChartStore } from "@/store/useChartStore";
import { TimePreset } from "@/types/TimeFilterPresets";

interface TimeFilterPresetsProps {
  className?: string;
  defaultPreset?: TimePreset;
  onClose?: () => void;
}

export default function TimeFilterPresets({
  className,
  defaultPreset = "thisMonth",
  onClose,
}: TimeFilterPresetsProps) {
  const [activePreset, setActivePreset] = useState<TimePreset>(defaultPreset);
  const { setDates, startDate, endDate } = useChartStore()

  const applyPreset = (preset: TimePreset) => {
    setActivePreset(preset);
    const today = new Date();

    switch (preset) {
      case "today": {
        handleSetDate(0, today);
        break;
      }
      case "yesterday":
        handleSetDate(1, today);
        break;
      case "7d":
        handleSetDate(6, today);
        break;
      case "30d":
        handleSetDate(29, today);
        break;
      case "90d":
        handleSetDate(89, today);
        break;
      case "thisMonth":
        setDates(startOfMonth(today), endOfMonth(today))
        break;
      case "lastMonth":
        const prev = subMonths(today, 1);
        setDates(startOfMonth(prev), endOfMonth(prev))
        break;
      case "thisYear":
        setDates(startOfYear(today), today)
        break;
      case "custom":
        setDates(startDate || startOfMonth(today), endDate || endOfMonth(today));
        break;
    }
  };


  const handleSetDate = (daysOffset: number, today: Date) => {
    const from = subDays(today, daysOffset);
    from.setHours(0, 0, 0, 0);
    const to = daysOffset == 1 ? from : today; //For the "yesterday" case. This adjusts it to not use today
    to.setHours(23, 59, 59, 999);
    setDates(from, to);
    onClose?.();
  };

  return (
    <div
      className={cn(
        "flex max-medium:flex-col bg-white rounded-2xl border border-[#EAEAEA] max-medium:max-h-[50vh] max-medium:overflow-auto",
        className
      )}
    >
      <div className="min-w-48 max-medium:min-w-0 max-medium:w-full border-r max-medium:border-r-0 max-medium:border-b border-[#EAEAEA] py-1">
        <ul className="flex flex-col">
          <li>
            <button
              className={cn(
                "w-full text-left text-xs p-3 hover:bg-[#c3f3c096]",
                activePreset === "today" && "bg-[#C3F3C0]"
              )}
              onClick={() => applyPreset("today")}
            >
              Heute
            </button>
          </li>
          <li>
            <button
              className={cn(
                "w-full text-left text-xs p-3 hover:bg-[#c3f3c096]",
                activePreset === "yesterday" && "bg-[#C3F3C0]"
              )}
              onClick={() => applyPreset("yesterday")}
            >
              Gestern
            </button>
          </li>
          <li>
            <button
              className={cn(
                "w-full text-left text-xs p-3 hover:bg-[#c3f3c096]",
                activePreset === "7d" && "bg-[#C3F3C0]"
              )}
              onClick={() => applyPreset("7d")}
            >
              Letzte 7 Tage
            </button>
          </li>
          <li>
            <button
              className={cn(
                "w-full text-left text-xs p-3 hover:bg-[#c3f3c096]",
                activePreset === "30d" && "bg-[#C3F3C0]"
              )}
              onClick={() => applyPreset("30d")}
            >
              Letzte 30 Tage
            </button>
          </li>
          <li>
            <button
              className={cn(
                "w-full text-left text-xs p-3 hover:bg-[#c3f3c096]",
                activePreset === "90d" && "bg-[#C3F3C0]"
              )}
              onClick={() => applyPreset("90d")}
            >
              Letzte 90 Tage
            </button>
          </li>
          <li>
            <button
              className={cn(
                "w-full text-left text-xs p-3 hover:bg-[#c3f3c096]",
                activePreset === "thisMonth" && "bg-[#C3F3C0]"
              )}
              onClick={() => applyPreset("thisMonth")}
            >
              Dieser Monat
            </button>
          </li>
          <li>
            <button
              className={cn(
                "w-full text-left text-xs p-3 hover:bg-[#c3f3c096]",
                activePreset === "lastMonth" && "bg-[#C3F3C0]"
              )}
              onClick={() => applyPreset("lastMonth")}
            >
              Letzter Monat
            </button>
          </li>
          <li>
            <button
              className={cn(
                "w-full text-left text-xs p-3 hover:bg-[#c3f3c096]",
                activePreset === "thisYear" && "bg-[#C3F3C0]"
              )}
              onClick={() => applyPreset("thisYear")}
            >
              Dieses Jahr
            </button>
          </li>
          <li>
            <button
              className={cn(
                "w-full text-left text-xs p-3 hover:bg-[#c3f3c096]",
                activePreset === "custom" && "bg-[#C3F3C0]"
              )}
              onClick={() => applyPreset("custom")}
            >
              Benutzerdefinierter Zeitraum
            </button>
          </li>
        </ul>
      </div>

      {activePreset === "custom" && (
        <Calendar
          mode="range"
          defaultMonth={startDate ?? undefined}
          selected={(startDate && endDate) ? { from: startDate, to: endDate } : undefined}
          onSelect={(r) => {
            if (r?.from && r?.to) {
              console.log('From', r.from);
              console.log('To', r.to);

              setDates(r?.from, r?.to);
            }
          }}
          numberOfMonths={2}
        />
      )}
    </div>
  );
}
