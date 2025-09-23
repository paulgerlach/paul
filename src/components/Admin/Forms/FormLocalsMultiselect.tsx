import { type SelectOptionType } from "@/components/Basic/ui/AdvancedSelect";
import { Badge } from "@/components/Basic/ui/Badge";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/Basic/ui/Command";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Basic/ui/Form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Basic/ui/Popover";
import { X } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormLocalsultiselectProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  disabled?: boolean;
  options: SelectOptionType[];
  name: Path<T>;
  label: string;
};

export default function FormLocalsultiselect<
  T extends FieldValues = FieldValues
>({ control, disabled, options, name, label }: FormLocalsultiselectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues = (field.value || []) as string[];

        const handleSelect = (value: string | number) => {
          if (disabled) return;

          if (selectedValues.includes(String(value))) {
            field.onChange(selectedValues.filter((v) => v !== value));
          } else {
            field.onChange([...selectedValues, value]);
          }
        };

        return (
          <FormItem>
            <FormLabel className="text-[#757575] text-sm">{label}</FormLabel>
            <Popover>
              <PopoverTrigger
                onClick={(e) => disabled && e.preventDefault()}
                asChild
              >
                <div className="border-black/20 data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring aria-invalid:ring-green/20 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded border bg-transparent px-3 py-4 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-green disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full">
                  {selectedValues.length > 0
                    ? `${selectedValues.length} ausgewählt`
                    : "Optionen auswählen"}
                </div>
              </PopoverTrigger>
              <PopoverContent className="min-w-xs w-full bg-white border-none shadow-sm p-0">
                <Command disablePointerSelection={disabled}>
                  <CommandList className="w-full">
                    <CommandEmpty>Keine Option gefunden.</CommandEmpty>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => handleSelect(option.value)}
                        className={`cursor-pointer ${
                          selectedValues.includes(String(option.value))
                            ? "bg-muted"
                            : ""
                        }`}
                      >
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedValues.map((item) => {
              const option = options.find(
                (opt) => String(opt.value) === String(item)
              );
              return (
                <Badge
                  key={item}
                  variant="secondary"
                  className="flex items-center flex-wrap w-fit gap-1"
                >
                  {option?.label ?? item}
                  <X
                    className={`h-3 w-3 transition-all duration-300 hover:text-red-500 ${
                      disabled ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    onClick={() =>
                      !disabled &&
                      field.onChange(
                        selectedValues.filter((val) => val !== item)
                      )
                    }
                  />
                </Badge>
              );
            })}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
