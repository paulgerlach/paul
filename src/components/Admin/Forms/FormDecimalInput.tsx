"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Basic/ui/Form";
import { Input } from "@/components/Basic/ui/Input";
import { normalizeDecimalInput } from "@/utils/germanNumber";
import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormDecimalInputProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  /** Symbol shown on the right side of the input (e.g. "€", "%", "m²") */
  suffix?: string;
  /** Allow negative values. Default: false */
  allowNegative?: boolean;
  /** Additional onChange handler */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

/**
 * A decimal input component that supports German number format.
 *
 * - Users can type "1,5" or "1.5" — both work
 * - Uses `inputMode="decimal"` for proper mobile keyboard
 * - Normalizes to standard number format on blur for form storage
 * - Displays the value as the user typed it during editing
 */
export default function FormDecimalInput<
  T extends FieldValues = FieldValues,
>({
  control,
  name,
  label,
  disabled,
  className,
  placeholder,
  suffix,
  allowNegative = false,
  onChange,
}: FormDecimalInputProps<T>) {
  // Track whether the user is actively editing
  const [displayValue, setDisplayValue] = useState<string | null>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Show the user's raw input while editing, otherwise show the form value
        const shownValue =
          displayValue !== null
            ? displayValue
            : field.value != null && field.value !== ""
              ? String(field.value)
              : "";

        return (
          <FormItem className={`relative ${className}`}>
            <FormLabel className="text-[#757575] text-sm">{label}</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder={placeholder}
                  disabled={disabled}
                  value={shownValue}
                  onChange={(e) => {
                    const raw = e.target.value;

                    // Allow: digits, comma, period, minus (if allowed), and empty
                    const allowedPattern = allowNegative
                      ? /^-?[\d.,]*$/
                      : /^[\d.,]*$/;

                    if (raw !== "" && !allowedPattern.test(raw)) {
                      return; // Block invalid characters
                    }

                    setDisplayValue(raw);

                    // Normalize for form state (comma → period)
                    const normalized = normalizeDecimalInput(raw);
                    field.onChange(normalized === "" ? "" : normalized);

                    // Call additional onChange if provided
                    onChange?.(e);
                  }}
                  onFocus={() => {
                    // On focus, show the current value for editing
                    // Convert stored "1.5" back to display as-is (user can type in either format)
                    const val =
                      field.value != null && field.value !== ""
                        ? String(field.value)
                        : "";
                    setDisplayValue(val);
                  }}
                  onBlur={() => {
                    // On blur, normalize and clear display override
                    if (displayValue !== null) {
                      const normalized = normalizeDecimalInput(displayValue);
                      field.onChange(normalized === "" ? "" : normalized);
                    }
                    setDisplayValue(null);
                    field.onBlur();
                  }}
                />
              </FormControl>
              {suffix && (
                <span className="absolute text-sm text-dark_green right-7 top-1/2 -translate-y-1/2">
                  {suffix}
                </span>
              )}
            </div>
            <FormMessage className="text-red-500 text-sm" />
          </FormItem>
        );
      }}
    />
  );
}
