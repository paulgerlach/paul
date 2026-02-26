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
      render={({ field }) => (
        <FormInnerInput
          field={field}
          className={className}
          label={label}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          replaceDotWithComma={replaceDotWithComma}
          onChange={onChange}
          unit={unit}
        />
      )}
    />
  );
}

function FormInnerInput({
  field,
  className,
  label,
  placeholder,
  type,
  disabled,
  replaceDotWithComma,
  onChange,
  unit,
}: {
  field: any;
  className?: string;
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  replaceDotWithComma?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  unit?: string;
}) {
  const [displayValue, setDisplayValue] = useState("");

  const isNumericProp = type === "number" || replaceDotWithComma;

  useEffect(() => {
    let strVal = "";
    if (field.value !== undefined && field.value !== null) {
      strVal = String(field.value);
    }

    if (replaceDotWithComma) {
      strVal = strVal.replace(/\./g, ",");
    }

    if (strVal !== displayValue) {
      setDisplayValue(strVal);
    }
  }, [field.value, replaceDotWithComma]);

  // Just show the placeholder if the value is "0"
  let finalDisplayValue = displayValue;
  if (isNumericProp && displayValue === "0") {
    finalDisplayValue = "";
  }

  return (
    <FormItem className={className}>
      {label && (
        <FormLabel className="text-[#757575] text-sm">{label}</FormLabel>
      )}
      <FormControl>
        <div className="relative">
          <Input
            min={isNumericProp ? 0 : undefined}
            disabled={disabled}
            type={isNumericProp && replaceDotWithComma ? "text" : type}
            placeholder={placeholder}
            {...field}
            onKeyDown={(e) => {
              if (isNumericProp && ["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              let value = e.target.value;

              if (isNumericProp) {
                // only allow numbers and decimals
                value = value.replace(/[^0-9.,]/g, "");
              }

              if (replaceDotWithComma) {
                value = value.replace(/\./g, ",");
                setDisplayValue(value);
                const logicValue = value.replace(/,/g, ".");
                field.onChange(logicValue ? logicValue : "");
              } else {
                setDisplayValue(value);
                field.onChange(value);
              }
              onChange?.(e);
            }}
            value={finalDisplayValue}
          />
          {unit && (
            <span className="absolute text-sm text-dark_green right-7 top-1/2 -translate-y-1/2">
              {unit}
            </span>
          )}
        </div>
      </FormControl>
      <FormMessage className="text-red-500 text-sm absolute -bottom-5 left-0" />
    </FormItem>
  );
}
