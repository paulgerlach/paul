"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { de } from "date-fns/locale";

import { cn } from "@/utils";
import { buttonVariants } from "./Button";
import Image from "next/image";
import { chevron_admin } from "@/static/icons";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={de}
      showOutsideDays={showOutsideDays}
      className={cn("border-none", className)}
      classNames={{
        months: "flex max-small:flex-col flex-row gap-3",
        month: "flex flex-col gap-4 bg-white p-5 rounded-2xl",
        caption:
          "flex justify-between items-center w-full [&:has(.monthBack)]:flex-row-reverse",
        caption_label: "text-2xl text-black font-black",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "border-none cursor-pointer monthBack !shadow-none",
        nav_button_next: "border-none cursor-pointer !shadow-none",
        table: "w-full border-collapse space-x-1",
        head_row: "flex justify-between",
        head_cell: "text-muted-foreground w-10 font-normal text-[0.8rem]",
        row: "flex w-full",
        cell: cn(
          "relative p-0 border-[0.5px] border-[#D5D4DF] text-center text-sm focus-within:relative focus-within:z-20 aria-selected:opacity-100 [&:has([aria-selected])]:!bg-green [&:has([aria-selected])]:bg-accent"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-10 h-10 p-0 font-normal rounded-none text-sm"
        ),
        day_range_start:
          "day-range-start aria-selected:!bg-[#9AD993] aria-selected:!text-black aria-selected:hover:!bg-[#9AD993] aria-selected:focus:!bg-[#9AD993]",
        day_range_end:
          "day-range-end aria-selected:!bg-[#9AD993] aria-selected:!text-black aria-selected:hover:!bg-[#9AD993] aria-selected:focus:!bg-[#9AD993]",
        day_selected:
          "bg-[#C3F3C0] text-black hover:bg-[#C3F3C0] hover:text-black focus:bg-[#C3F3C0] focus:text-black",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-[#A0A0A0] opacity-70",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-[#C3F3C0] aria-selected:text-black",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className={cn(
              "max-w-3 max-h-3 rotate-90 transition-all duration-300",
              className
            )}
            src={chevron_admin}
            {...props}
            alt="chevron_admin"
          />
        ),
        IconRight: ({ className, ...props }) => (
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className={cn(
              "max-w-3 max-h-3 -rotate-90 transition-all duration-300",
              className
            )}
            src={chevron_admin}
            alt="chevron_admin"
            {...props}
          />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
