import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Basic/ui/Form";
import { Input } from "@/components/Basic/ui/Input";
import React, { useEffect, useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormInputFieldProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder: string;
  className?: string;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  replaceDotWithComma?: boolean;
  unit?: string;
};

export default function FormInputField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  type,
  className,
  disabled,
  onChange,
  replaceDotWithComma,
  unit,
}: FormInputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [displayValue, setDisplayValue] = useState("");

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (replaceDotWithComma && field.value !== undefined && field.value !== null) {
            const val = String(field.value).replace(/\./g, ",");
            if (val !== displayValue) {
              setDisplayValue(val);
            }
          } else {
            setDisplayValue(String(field.value ?? ""));
          }
        }, [field.value, replaceDotWithComma]);

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="text-[#757575] text-sm">{label}</FormLabel>
            )}
            <FormControl>
              <div className="relative">
                <Input
                  min={0}
                  disabled={disabled}
                  type={type}
                  placeholder={placeholder}
                  {...field}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (replaceDotWithComma) {
                      value = value.replace(/\./g, ",");
                      setDisplayValue(value);
                      // Pass dot-version to react-hook-form for validation
                      const logicValue = value.replace(/,/g, ".");
                      field.onChange(logicValue);
                    } else {
                      field.onChange(e);
                    }
                    onChange?.(e);
                  }}
                  value={displayValue}
                />
                {unit && (
                  <span className="absolute text-sm text-dark_green right-7 top-1/2 -translate-y-1/2">
                    {unit}
                  </span>
                )}
              </div>
            </FormControl>
            <FormMessage className="text-red-500 text-sm" />
          </FormItem>
        );
      }}
    />
  );
}
