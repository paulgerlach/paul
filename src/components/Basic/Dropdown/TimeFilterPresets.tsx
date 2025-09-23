"use client";

import {
  endOfMonth,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { useState } from "react";

import { cn } from "@/utils";
import { Calendar } from "../ui/Calendar";

export type TimePreset =
  | "today"
  | "yesterday"
  | "7d"
  | "30d"
  | "90d"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "custom";

interface TimeFilterPresetsProps {
  date: DateRange | undefined;
  setDate: (range: DateRange | undefined) => void;
  startDate?: Date | null;
  endDate?: Date | null;
  onCommitRange: (from: Date, to: Date) => void;
  className?: string;
  defaultPreset?: TimePreset;
}

export default function TimeFilterPresets({
  date,
  setDate,
  startDate,
  endDate,
  onCommitRange,
  className,
  defaultPreset = "thisMonth",
}: TimeFilterPresetsProps) {
  const [activePreset, setActivePreset] = useState<TimePreset>(defaultPreset);

  const applyPreset = (preset: TimePreset) => {
    const today = new Date();

    if (preset === "custom") {
      setActivePreset("custom");
      setDate({
        from: startDate || startOfMonth(today),
        to: endDate || endOfMonth(today),
      });
      return;
    }

    let from: Date = today;
    let to: Date = today;

    switch (preset) {
      case "today":
        from = today;
        to = today;
        break;
      case "yesterday":
        from = subDays(today, 1);
        to = subDays(today, 1);
        break;
      case "7d":
        from = subDays(today, 6);
        to = today;
        break;
      case "30d":
        from = subDays(today, 29);
        to = today;
        break;
      case "90d":
        from = subDays(today, 89);
        to = today;
        break;
      case "thisMonth":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case "lastMonth":
        const prev = subMonths(today, 1);
        from = startOfMonth(prev);
        to = endOfMonth(prev);
        break;
      case "thisYear":
        from = startOfYear(today);
        to = endOfMonth(today);
        break;
    }

    setActivePreset(preset);
    setDate({ from, to });
    onCommitRange(from, to);
  };

  return (
    <div
      className={cn(
        "flex bg-white rounded-2xl border border-[#EAEAEA]",
        className
      )}
    >
      <div className="min-w-48 border-r border-[#EAEAEA] py-1">
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
          defaultMonth={date?.from}
          selected={date}
          onSelect={(r) => {
            setDate(r);
            if (r?.from && r?.to) {
              onCommitRange(r.from, r.to);
            }
          }}
          numberOfMonths={2}
        />
      )}
    </div>
  );
}
