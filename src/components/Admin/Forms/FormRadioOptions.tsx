import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Basic/ui/Form";
import { RadioGroup, RadioGroupItem } from "@/components/Basic/ui/RadioGroup";
import { Fragment } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormRadioOption<O> = {
  type: O;
  name: string;
};

export type FormRadioOptionsProps<
  T extends FieldValues = FieldValues,
  O extends string | number = string,
> = {
  control: Control<T>;
  options: FormRadioOption<O>[];
  label: string;
  name: Path<T>;
  disabled?: boolean;
};

export default function FormRadioOptions<
  T extends FieldValues = FieldValues,
  O extends string | number = string,
>({ control, options, label, name, disabled }: FormRadioOptionsProps<T, O>) {
  return (
    <Fragment>
      {label && <h2 className="text-sm font-bold">{label}</h2>}
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                disabled={disabled}
                className="flex items-center flex-wrap gap-2.5 max-medium:gap-2 mt-2">
                {options.map((option) => (
                  <FormItem
                    key={option.type}
                    className="flex items-center form-radio-item px-3 rounded-full border w-fit border-[#c4c4c4] transition-all duration-300">
                    <RadioGroupItem
                      value={String(option.type)}
                      id={String(option.type)}
                      onClick={() => {
                        if (field.value === String(option.type)) {
                          setTimeout(() => field.onChange(""), 0);
                        }
                      }}
                    />
                    <FormLabel
                      htmlFor={String(option.type)}
                      className="text-xs py-2 font-medium cursor-pointer text-admin_dark_text"
                      onClick={(e) => {
                        if (field.value === String(option.type)) {
                          e.preventDefault();
                          setTimeout(() => field.onChange(""), 0);
                        }
                      }}
                    >
                      {option.name}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage className="text-red-500 text-sm absolute -bottom-5 left-0" />
          </FormItem>
        )}
      />
    </Fragment>
  );
}
