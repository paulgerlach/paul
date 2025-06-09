import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Basic/ui/Form";
import { Input } from "@/components/Basic/ui/Input";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormPercentInputProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  className?: string;
};

export default function FormPercentInput<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  disabled,
  className,
}: FormPercentInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`relative ${className}`}>
          <FormLabel className="text-[#757575] text-sm">{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input {...field} disabled={disabled} value={field.value ?? ""} />
            </FormControl>
            <span className="absolute text-sm text-dark_green right-7 bottom-3">
              %
            </span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
