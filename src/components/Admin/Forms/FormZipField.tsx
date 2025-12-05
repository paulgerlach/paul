"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Basic/ui/Popover";
import FormInputField from "./FormInputField";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { useStreetSuggestions } from "@/hooks/useStreetSuggestions";
import { useEffect } from "react";

export type FormZipFieldProps<T extends FieldValues = FieldValues> = {
  methods: UseFormReturn<T>;
  name: Path<T>;
  className?: string;
};

export default function FormZipField<T extends FieldValues = FieldValues>({
  methods,
  name,
  className,
}: FormZipFieldProps<T>) {
  const {
    streetOptions,
    handleStreetSelect,
    fetchStreets,
    showSuggestions,
    setShowSuggestions,
  } = useStreetSuggestions<T>();

  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === "zip") fetchStreets(value.zip ?? "");
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, fetchStreets, methods]);

  return (
    <div className={`relative col-span-3 ${className || ""}`}>
      <Popover
        onOpenChange={() => setShowSuggestions(false)}
        open={showSuggestions && streetOptions.length > 0}>
        <PopoverTrigger asChild>
          <div>
            <FormInputField<T>
              control={methods.control}
              name={name}
              type="number"
              label="Postleitzahl*"
              placeholder="Postleitzahl"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-full bg-white border-none shadow-sm p-0">
          <ul className="divide-y divide-gray-200">
            {streetOptions.map((street) => (
              <li
                key={street}
                className="text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md"
                onClick={() => handleStreetSelect(street, methods.setValue)}>
                {street}
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
