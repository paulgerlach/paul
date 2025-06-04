import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Basic/ui/Form";
import { RoundedCheckbox } from "@/components/Basic/ui/RoundedCheckbox";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormRoundedCheckboxProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  label: string;
  name: Path<T>;
  disabled?: boolean;
  className?: string;
};

export default function FormRoundedCheckbox<
  T extends FieldValues = FieldValues,
>({ control, label, name, disabled, className }: FormRoundedCheckboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem
          className={`flex border-[#c4c4c4] transition-all duration-300 border w-fit rounded-full px-2.5 items-center gap-2 form-rounded-checkbox mt-4 ${className}`}>
          <FormControl>
            <RoundedCheckbox
              disabled={disabled}
              className="border border-[#c4c4c4]"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel className="text-[#333333] py-2 text-xs">{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
