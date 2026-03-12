"use client";

import {
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Button } from "../ui/Button";
import Image from "next/image";
import { chevron_admin, clock_dark } from "@/static/icons";
import { useState, useEffect } from "react";
import { useChartStore } from "@/store/useChartStore";
import TimeFilterPresets from "./TimeFilterPresets";

export default function AdminDatetimeDropdown({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {

  const { setDates, startDate, endDate } = useChartStore()
  const [open, setOpen] = useState(false);

  // Set initial dates in the store when component mounts
  useEffect(() => {
    // Only set dates if they don't exist in the store
    if (!startDate || !endDate) {
      const initialFrom = startDate ?? startOfYear(new Date());
      const initialTo = endDate ?? endOfMonth(new Date());
      setDates(initialFrom, initialTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount


  const getDefaultPreset = () => {
    const today = new Date();
    if (startDate && endDate) {
      // Exact day matches
      if (isSameDay(startDate, today) && isSameDay(endDate, today))
        return "today" as const;
      const yesterday = subDays(today, 1);
      if (isSameDay(startDate, yesterday) && isSameDay(endDate, yesterday))
        return "yesterday" as const;

      // Rolling windows ending today
      if (isSameDay(endDate, today)) {
        if (isSameDay(startDate, subDays(today, 6))) return "7d" as const;
        if (isSameDay(startDate, subDays(today, 29))) return "30d" as const;
        if (isSameDay(startDate, subDays(today, 89))) return "90d" as const;
      }

      // Month presets
      if (
        isSameDay(startDate, startOfMonth(today)) &&
        isSameDay(endDate, endOfMonth(today))
      ) {
        return "thisMonth" as const;
      }
      const prev = subMonths(today, 1);
      if (
        isSameDay(startDate, startOfMonth(prev)) &&
        isSameDay(endDate, endOfMonth(prev))
      ) {
        return "lastMonth" as const;
      }

      // this year
      if (
        isSameDay(startDate, startOfYear(today)) &&
        isSameDay(endDate, endOfMonth(today))
      ) {
        return "thisYear" as const;
      }

      return "custom" as const;
    }
    return "thisMonth" as const;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            className="flex w-full items-center gap-4 justify-between bg-transparent border-none cursor-pointer h-full shadow-none px-2 py-3 hover:!bg-transparent"
          >
            <div className="flex items-center justify-start whitespace-nowrap gap-5">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="max-w-4 max-h-4 max-xl:max-w-4 max-xl:max-h-4 w-4 h-4"
                loading="lazy"
                alt="clock_dark"
                src={clock_dark}
              />
              <div className="flex flex-col items-start justify-center">
                <span className="font-bold text-sm">Zeitraum</span>
                <span className="text-xs uppercase text-black/50">
                  {startDate ? (
                    endDate ? (
                      <>
                        {format(startDate, "LLL dd")} -{" "}
                        {format(endDate, "LLL dd")}
                      </>
                    ) : (
                      format(startDate, "LLL dd")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </span>
              </div>
            </div>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="max-w-2 max-h-5 transition-all duration-300 [.open_&]:rotate-180"
              loading="lazy"
              style={{ width: "100%", height: "auto" }}
              alt="chevron_admin"
              src={chevron_admin}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-none shadow-none max-medium:w-[calc(100vw-32px)] max-medium:max-h-[60vh] max-medium:overflow-auto"
          align="start"
          sideOffset={8}
        >
          <TimeFilterPresets
            defaultPreset={getDefaultPreset()}
            onClose={() => setOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
