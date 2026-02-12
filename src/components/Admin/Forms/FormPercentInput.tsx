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
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
};

export default function FormPercentInput<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  disabled,
  className,
  onChange,
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
              <Input
                type="number"
                min={0}
                step="any"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e);
                }}
                disabled={disabled}
                value={field.value ?? ""}
              />
            </FormControl>
            <span className="absolute text-sm text-dark_green right-7 top-1/2 -translate-y-1/2">
              %
            </span>
          </div>
          <FormMessage className="text-red-500 text-sm absolute -bottom-5 left-0" />
        </FormItem>
      )}
    />
  );
}
