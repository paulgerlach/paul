import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/Basic/ui/Form";
import { Textarea } from "@headlessui/react";
import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormTextareaFieldProps<T extends FieldValues = FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    rows?: number;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export default function FormTextareaField<T extends FieldValues = FieldValues>({
    control,
    name,
    label,
    placeholder,
    className,
    disabled,
    rows = 4,
    onChange,
}: FormTextareaFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && (
                        <FormLabel className="text-[#757575] text-sm">
                            {label}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Textarea
                            rows={rows}
                            disabled={disabled}
                            placeholder={placeholder}
                            {...field}
                            className="flex min-h-14 w-full bg-white px-3.5 border border-black/20 rounded-md text-base max-xl:text-sm ring-offset-background file:text-sm file:font-medium file:text-foreground placeholder:text-dark_text/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/40 focus-visible:border-green transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 max-medium:text-sm"
                            onChange={(e) => {
                                field.onChange(e);
                                onChange?.(e);
                            }}
                            value={field.value ?? ""}
                        />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                </FormItem>
            )}
        />
    );
}
