"use client";

import { endOfMonth, format, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { useEffect } from "react";

import { cn } from "@/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Button } from "../ui/Button";
import Image from "next/image";
import { chevron_admin, clock_dark } from "@/static/icons";
import { useState } from "react";
import { useChartStore } from "@/store/useChartStore";
import TimeFilterPresets from "./TimeFilterPresets";

export default function AdminDatetimeDropdown({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const { setDates, startDate, endDate } = useChartStore();
  const [open, setOpen] = useState(false);

  // Set initial dates in the store when component mounts
  useEffect(() => {
    const initialFrom = date?.from ?? startOfMonth(new Date());
    const initialTo = date?.to ?? endOfMonth(new Date());

    setDates(initialFrom, initialTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDates]);

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
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
                className="max-w-6 max-h-6 max-xl:max-w-6 max-xl:max-h-6 w-6 h-6"
                loading="lazy"
                alt="clock_dark"
                src={clock_dark}
              />
              <div className="flex flex-col items-start justify-center">
                <span className="font-bold text-sm">Zeitraum</span>
                <span className="text-xs uppercase text-black/50">
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd")} -{" "}
                        {format(date.to, "LLL dd")}
                      </>
                    ) : (
                      format(date.from, "LLL dd")
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
          className="w-auto p-0 border-none shadow-none"
          align="start"
        >
          <TimeFilterPresets
            date={date}
            setDate={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            onCommitRange={(from, to) => setDates(from, to)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
