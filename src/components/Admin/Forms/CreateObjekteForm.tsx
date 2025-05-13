"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/Basic/ui/Form";
import { Input } from "@/components/Basic/ui/Input";
import { Button } from "@/components/Basic/ui/Button";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/Basic/ui/Select";
import Image, { type StaticImageData } from "next/image";
import {
  commercial,
  keys,
  multi_family,
  special_purpose,
  white_check_green_box,
} from "@/static/icons";
import { useState } from "react";
import { RoundedCheckbox } from "@/components/Basic/ui/RoundedCheckbox";
import { X } from "lucide-react";
import { Badge } from "@/components/Basic/ui/Badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Basic/ui/Popover";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/Basic/ui/Command";

const objektTypeOptions: {
  type: string;
  name: string;
  image: StaticImageData;
}[] = [
  {
    type: "condominium",
    name: "Eigentumswohnung",
    image: keys,
  },
  {
    type: "multi_family",
    name: "Mehrfamilienhaus",
    image: multi_family,
  },
  {
    type: "commercial",
    name: "Gewerbeimmobilie",
    image: commercial,
  },
  {
    type: "special_purpose",
    name: "Sonderimmobilie",
    image: special_purpose,
  },
];

const heizungssytemOptions = [
  "Fernwärme",
  "Gas",
  "Fußbodenheizung",
  "Solaranlage",
  "Wärmepumpe",
  "Strom",
  "Sonstige",
];

const objectSchema = z.object({
  objektType: z.string().min(1, "Pflichtfeld"),
  street: z.string().min(1, "Pflichtfeld"),
  zip: z.string().min(4, "Pflichtfeld"),
  verwaltungType: z.string().min(1, "Pflichtfeld"),
  warmwasserbereitungType: z.string().min(1, "Pflichtfeld"),
  livingArea: z.string().optional(),
  usableArea: z.string().optional(),
  landArea: z.string().optional(),
  buildYear: z.string().optional(),
  hasElevator: z.boolean().optional(),
  tags: z.array(z.object({ value: z.string() })).optional(),
  heizungssysteme: z
    .array(z.string())
    .refine((val) => val.every((item) => heizungssytemOptions.includes(item)), {
      message: "Ungültige Auswahl",
    })
    .optional(),
});

export default function CreateObjekteForm() {
  const [tagInput, setTagInput] = useState("");

  const methods = useForm({
    resolver: zodResolver(objectSchema),
    defaultValues: {
      hasElevator: false,
      objektType: "condominium",
      tags: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "tags",
  });

  return (
    <Form {...methods}>
      <form
        id="objekte-form"
        className="w-10/12"
        onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <FormField
          control={methods.control}
          name="tags"
          render={() => {
            const handleTagKeyDown = (
              e: React.KeyboardEvent<HTMLInputElement>
            ) => {
              if (e.key === "Enter" && tagInput.trim() !== "") {
                e.preventDefault();
                if (!fields.find((tag) => tag.value === tagInput.trim())) {
                  append({ value: tagInput.trim() });
                }
                setTagInput("");
              }
            };

            return (
              <FormItem className="spice-y-4 pb-4 border-b border-dark_green/20">
                <FormControl>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Tag eingeben und Enter drücken"
                    className="w-6/12 block px-3 py-2 text-sm border border-dark_green bg-dark_green/40 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:border-green focus:ring-green"
                  />
                </FormControl>
                <div className="flex flex-wrap gap-2 mb-2">
                  {fields.map((field, index) => (
                    <span
                      key={field.id}
                      className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {field.value}
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-green-600 hover:text-red-500 font-bold text-sm">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="w-full border-b py-5 space-y-5 border-dark_green/10">
          <h2 className="text-sm font-bold">Angaben zum Objekt</h2>
          <FormField
            control={methods.control}
            name="objektType"
            render={({ field }) => (
              <div className="grid grid-cols-4 gap-6">
                {objektTypeOptions.map((option) => (
                  <div key={option.type}>
                    <input
                      id={option.type}
                      type="radio"
                      className="sr-only peer"
                      value={option.type}
                      checked={field.value === option.type}
                      onChange={field.onChange}
                    />
                    <label
                      className="cursor-pointer flex min-h-32 rounded bg-white flex-col shadow-md py-5 px-7 items-center border-4 border-transparent justify-center gap-5 text-sm transition-all duration-300 font-medium peer-checked:border-green peer-checked:[&_.objektTypeCheckmark]:opacity-100 relative"
                      htmlFor={option.type}>
                      <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        loading="lazy"
                        className="max-w-9 max-h-9"
                        src={option.image}
                        alt="option image"
                      />
                      {option.name}
                      <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        loading="lazy"
                        className="max-w-6 opacity-0 transition-all duration-300 objektTypeCheckmark absolute -top-[1px] -right-[1px] max-h-6"
                        src={white_check_green_box}
                        alt="white_check_green_box"
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}
          />
          <h2 className="text-sm font-bold">Verwaltungsrelevante Merkmale </h2>
          <FormField
            control={methods.control}
            name="verwaltungType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#757575] text-sm">
                  Art der Verwaltung*
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-6/12">
                      <SelectValue placeholder="Mietverwaltung" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="WEG Verwaltung">
                        WEG Verwaltung
                      </SelectItem>
                      <SelectItem value="Mietverwaltung">
                        Mietverwaltung
                      </SelectItem>
                      <SelectItem value="Sondereigentumsverwaltung">
                        Sondereigentumsverwaltung
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full border-b py-5 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Allgemeine Objektdaten</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={methods.control}
              name="street"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-[#757575] text-sm">
                    Straßenname*
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#757575] text-sm">
                    Postleitzahl*
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="livingArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#757575] text-sm">
                    Wohnfläche
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="m²" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="usableArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#757575] text-sm">
                    Nutzfläche
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="m²" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="landArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#757575] text-sm">
                    Grundstücksfläche
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="m²" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="buildYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#757575] text-sm">
                    Baujahr
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Jahr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={methods.control}
            name="hasElevator"
            render={({ field }) => (
              <FormItem className="flex bg-green/20 border w-fit border-green rounded-full px-2.5 py-2 items-center gap-2 mt-4">
                <FormControl>
                  <RoundedCheckbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-[#333333] text-xs">
                  Aufzug vorhanden
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full border-b py-5 space-y-5 border-dark_green/10">
          <h2 className="text-sm font-bold">Technische Ausstattung</h2>
          <div className="grid grid-cols-2 items-start gap-5">
            <FormField
              control={methods.control}
              name="heizungssysteme"
              render={({ field }) => {
                const selectedValues = field.value || [];

                const handleSelect = (value: string) => {
                  if (selectedValues.includes(value)) {
                    field.onChange(selectedValues.filter((v) => v !== value));
                  } else {
                    field.onChange([...selectedValues, value]);
                  }
                };

                return (
                  <FormItem>
                    <FormLabel className="text-[#757575] text-sm">
                      Heizungssystem
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="border-black/20 data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring aria-invalid:ring-green/20 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-green disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full">
                          {selectedValues.length > 0
                            ? `${selectedValues.length} ausgewählt`
                            : "Optionen auswählen"}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="min-w-xs w-full bg-white border-none shadow-sm p-0">
                        <Command>
                          <CommandList className="w-full">
                            <CommandEmpty>Keine Option gefunden.</CommandEmpty>
                            {heizungssytemOptions.map((option) => (
                              <CommandItem
                                key={option}
                                onSelect={() => handleSelect(option)}
                                className={`cursor-pointer ${
                                  selectedValues.includes(option)
                                    ? "bg-muted"
                                    : ""
                                }`}>
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
                            className="flex items-center gap-1">
                            {item}
                            <X
                              className="h-3 w-3 transition-all duration-300 hover:text-red-500 cursor-pointer"
                              onClick={() =>
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

            <FormField
              control={methods.control}
              name="warmwasserbereitungType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#757575] text-sm">
                    Warmwasserbereitung
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          className="line-clamp-1"
                          placeholder="Zentrale/Dezentrale"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Zentrale Wassererwärmung">
                          Zentrale Wassererwärmung
                        </SelectItem>
                        <SelectItem value="Dezentrale Wassererwärmung">
                          Dezentrale Wassererwärmung
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" className="mt-6 ml-auto mr-0 block">
          Speichern
        </Button>
      </form>
    </Form>
  );
}
