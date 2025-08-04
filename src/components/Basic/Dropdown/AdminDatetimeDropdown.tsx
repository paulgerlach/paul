"use client";

import { endOfMonth, format, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Button } from "../ui/Button";
import { Calendar } from "../ui/Calendar";
import Image from "next/image";
import { chevron_admin, clock_dark } from "@/static/icons";
import { useState } from "react";
import { useChartStore } from "@/store/useChartStore";

export default function AdminDatetimeDropdown({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const { setDates } = useChartStore();

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (date?.from && date?.to) {
      setDates(date?.from, date?.to);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            className="flex w-full items-center gap-4 justify-between bg-transparent border-none cursor-pointer h-fit shadow-none px-6 hover:!bg-transparent py-3"
          >
            <div className="flex items-center justify-start whitespace-nowrap gap-5">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="max-w-4 max-h-5"
                loading="lazy"
                style={{ width: "100%", height: "auto" }}
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
              className="max-w-4 max-h-5 transition-all duration-300 [.open_&]:rotate-180"
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
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
