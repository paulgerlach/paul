import {
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/Basic/ui/Form";
import Select from "@/components/Basic/ui/Select";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormSelectFieldProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  options: string[];
  disabled?: boolean;
  className?: string;
};

export default function FormSelectField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  disabled = false,
  className = "",
}: FormSelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <Select
            disabled={disabled}
            selectedValue={field.value}
            onChange={field.onChange}
            label={label}
            placeholder={placeholder}
            options={options}
          />
          <FormMessage className="text-red-500 text-sm absolute -bottom-5 left-0" />
        </FormItem>
      )}
    />
  );
}
