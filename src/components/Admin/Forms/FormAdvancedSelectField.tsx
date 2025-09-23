import AdvancedSelect, { type SelectOptionType } from "@/components/Basic/ui/AdvancedSelect";
import {
  FormMessage,
  FormField,
  FormItem,
} from "@/components/Basic/ui/Form";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormAdvancedSelectFieldProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  options: SelectOptionType[];
  disabled?: boolean;
  className?: string;
};

export default function FormAdvancedSelectField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  disabled = false,
  className = "",
}: FormAdvancedSelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <AdvancedSelect
            disabled={disabled}
            selectedValue={field.value}
            onChange={field.onChange}
            label={label}
            placeholder={placeholder}
            options={options}
          />
          <FormMessage className="text-red-500 text-sm" />
        </FormItem>
      )}
    />
  );
}
