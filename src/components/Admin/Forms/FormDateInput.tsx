"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Basic/ui/Form";
import { format } from "date-fns";
import { cn } from "@/utils";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Basic/ui/Popover";
import { Calendar } from "@/components/Basic/ui/Calendar";
import { calendar } from "@/static/icons";
import Image from "next/image";

export type FormDateInputProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  className?: string;
};

export default function FormDateInput<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  disabled = false,
  className = "",
}: FormDateInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          <FormLabel className="text-[#757575] text-sm">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <button
                  disabled={disabled}
                  className={
                    "w-full flex items-center justify-between text-left px-6 py-[7px] rounded-md border max-xl:text-sm max-xl:min-h-10 min-h-14 border-black/20 shadow-xs font-normal"
                  }>
                  {field.value ? format(field.value, "PPP") : <span>-</span>}
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-5 max-h-5"
                    src={calendar}
                    alt="calendar"
                  />
                </button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              disablePortal
              className="border-none shadow-none w-fit p-0 relative"
              align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
