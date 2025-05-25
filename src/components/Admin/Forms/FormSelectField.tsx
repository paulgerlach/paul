import {
  FormMessage,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/Basic/ui/Form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Basic/ui/Select";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormSelectFieldProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  options: string[];
  disabled?: boolean;
};

export default function FormSelectField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  disabled = false,
}: FormSelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[#757575] text-sm">{label}</FormLabel>
          <Select
            disabled={disabled}
            value={field.value}
            onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue
                  className="line-clamp-1"
                  placeholder={placeholder}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* <FormMessage className="text-red-500 text-sm" /> */}
        </FormItem>
      )}
    />
  );
}
