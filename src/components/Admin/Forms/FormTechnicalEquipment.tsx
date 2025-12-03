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
import {
  heatingSystemOptions,
  hotWaterPreparationOptions,
} from "@/static/formSelectOptions";
import { X } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";
import FormSelectField from "./FormSelectField";

export type FormTechnicalEquipmentProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  disabled?: boolean;
};

export default function FormTechnicalEquipment<
  T extends FieldValues = FieldValues
>({ control, disabled }: FormTechnicalEquipmentProps<T>) {
  return (
    <div className="w-full border-b py-5 max-medium:py-3 space-y-5 max-medium:space-y-3 border-dark_green/10">
      <h2 className="text-sm font-bold">Technische Ausstattung</h2>
      <div className="grid grid-cols-2 max-medium:grid-cols-1 items-start gap-5 max-medium:gap-3">
        <FormField
          control={control}
          name={"heating_systems" as Path<T>}
          render={({ field }) => {
            const selectedValues = (field.value || []) as string[];

            const handleSelect = (value: string) => {
              if (selectedValues.includes(value)) {
                field.onChange(selectedValues.filter((v) => v !== value));
              } else {
                field.onChange([...selectedValues, value]);
              }
            };

            return (
              <FormItem className="h-full">
                <FormLabel className="text-[#757575] text-sm">
                  Heizungssystem*
                </FormLabel>
                <Popover>
                  <PopoverTrigger
                    onClick={(e) => disabled && e.preventDefault()}
                    asChild
                  >
                    <div className="border-black/20 aria-invalid:ring-green/20 aria-invalid:border-destructive flex items-center justify-between gap-2 rounded border bg-transparent px-3 py-4 text-sm max-xl:text-sm max-xl:py-2 whitespace-nowrap outline-none focus-visible:ring-[3px] focus-visible:ring-green disabled:cursor-not-allowed disabled:opacity-50  *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 w-full">
                      {selectedValues.length > 0
                        ? `${selectedValues.length} ausgewählt`
                        : "Optionen auswählen"}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-xs w-full bg-white border-none shadow-sm p-0">
                    <Command disablePointerSelection={disabled}>
                      <CommandList className="w-full">
                        <CommandEmpty>Keine Option gefunden.</CommandEmpty>
                        {heatingSystemOptions.map((option) => (
                          <CommandItem
                            key={option}
                            onSelect={() => handleSelect(option)}
                            className={`cursor-pointer ${
                              selectedValues.includes(option) ? "bg-muted" : ""
                            }`}
                          >
                            {option}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedValues.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedValues.map((item) => (
                      <Badge
                        key={item}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {item}
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
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormSelectField<T>
          disabled={disabled}
          options={hotWaterPreparationOptions}
          label="Warmwasserbereitung*"
          placeholder="Zentrale/Dezentrale"
          control={control}
          name={"hot_water_preparation" as Path<T>}
        />
      </div>
    </div>
  );
}
