import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Basic/ui/Form";
import { Input } from "@/components/Basic/ui/Input";
import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormInputFieldProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder: string;
  className?: string;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
};

export default function FormInputField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  type,
  className,
  disabled,
}: FormInputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="text-[#757575] text-sm">{label}</FormLabel>
          )}
          <FormControl>
            <Input
              min={0}
              disabled={disabled}
              type={type}
              placeholder={placeholder}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          {/* <FormMessage className="text-red-500 text-sm" /> */}
        </FormItem>
      )}
    />
  );
}
