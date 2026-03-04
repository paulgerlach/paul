"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Basic/ui/Form";
import { format, parse, isValid } from "date-fns";
import { de } from "date-fns/locale";
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
  placeholder?: string;
  showClearButton?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  onSelect?: (date: Date | undefined) => void;
  /** When true, stores value as "yyyy-MM-dd" string instead of Date (for forms that need string) */
  valueAsString?: boolean;
};

export default function FormDateInput<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  disabled = false,
  className = "",
  placeholder = "Datum auswählen",
  showClearButton = false,
  clearLabel = "Löschen",
  onClear,
  onSelect,
  valueAsString = false,
}: FormDateInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const displayDate = valueAsString && typeof field.value === "string"
          ? (() => {
            if (!field.value) return undefined;
            const parsed = parse(field.value, "yyyy-MM-dd", new Date());
            return isValid(parsed) ? parsed : undefined;
          })()
          : field.value;
        const handleSelect = (date: Date | undefined) => {
          if (valueAsString) {
            field.onChange(date ? format(date, "yyyy-MM-dd") : null);
          } else {
            field.onChange(date);
          }
          onSelect?.(date);
        };
        return (
          <FormItem className={cn("flex flex-col", className)}>
            <FormLabel className="text-[#757575] text-sm">{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    disabled={disabled}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-6 max-medium:px-3 rounded-md border max-xl:text-sm max-medium:text-xs h-14 border-black/20 shadow-xs font-normal gap-2",
                      displayDate ? "text-admin_dark_text" : "text-gray-400"
                    )}
                  >
                    {displayDate ? (
                      format(displayDate, "dd.MM.yyyy", { locale: de })
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      loading="lazy"
                      className="max-w-5 max-h-5 max-medium:max-w-4 max-medium:max-h-4 flex-shrink-0"
                      src={calendar}
                      alt="calendar"
                    />
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                disablePortal
                className="border-none shadow-none w-fit p-0 relative"
                align="start"
              >
                <div className="flex flex-col bg-white border border-black/20 rounded-md shadow-lg overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={displayDate}
                    onSelect={handleSelect}
                    disabled={disabled}
                    initialFocus
                  />
                  {showClearButton && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSelect(undefined);
                        onClear?.();
                      }}
                      className="w-full py-3 text-sm font-medium text-dark_green hover:bg-gray-50 border-t border-black/10 transition-colors cursor-pointer"
                    >
                      {clearLabel}
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage className="text-red-500 text-sm absolute -bottom-5 left-0" />
          </FormItem>
        );
      }}
    />
  );
}
