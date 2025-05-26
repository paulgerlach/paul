import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Basic/ui/Form";
import { Input } from "@/components/Basic/ui/Input";
import { calendar } from "@/static/icons";
import Image from "next/image";
import { Control, FieldValues, Path } from "react-hook-form";

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
  disabled,
  className,
}: FormDateInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className={`relative ${className}`}>
          <FormLabel className="text-[#757575] text-sm">{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                type="date"
                {...field}
                disabled={disabled}
                value={field.value ?? ""}
              />
            </FormControl>
            <span className="absolute flex items-center justify-center text-dark_green right-7 bottom-4">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-5 max-h-5"
                src={calendar}
                alt="calendar"
              />
            </span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
