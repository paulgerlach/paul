"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
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
import type { UnitType } from "@/types";
import {
  apartmentTypeOptions,
  floorOptions,
  heatingSystemOptions,
  houseLocatonOptions,
  outdoorOptions,
  residentialAreaOptions,
} from "@/static/formSelectOptions";
import FormTagsInput from "./FormTagsInput";
import FormRadioOptions, { FormRadioOption } from "./FormRadioOptions";
import FormTechnicalEquipment from "./FormTechnicalEquipment";
import FormRoundedCheckbox from "./FormRoundedCheckbox";
import FormSelectField from "./FormSelectField";
import FormInputField from "./FormInputField";
import FormDocuments from "./FormDocuments";

const unitTypeOptions: FormRadioOption<UnitType>[] = [
  {
    type: "residential",
    name: "Wohneinheit",
  },
  {
    type: "commercial",
    name: "Gewerbeeinheit",
  },
  {
    type: "parking",
    name: "Stellplatz",
  },
  {
    type: "warehouse",
    name: "Lager",
  },
];

const localSchema = z.object({
  usage_type: z.string().min(1, "Pflichtfeld"),
  floor: z.string().min(1, "Pflichtfeld"),
  living_space: z.coerce.number().min(1, "Pflichtfeld"),
  house_location: z.string().optional(),
  outdoor: z.string().optional(),
  rooms: z.coerce.number().optional(),
  house_fee: z.coerce.number().optional(),
  outdoor_area: z.coerce.number().optional(),
  residential_area: z.string().optional(),
  apartment_type: z.string().optional(),
  cellar_available: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  heating_systems: z
    .array(z.string())
    .refine((val) => val.every((item) => heatingSystemOptions.includes(item)), {
      message: "Ungültige Auswahl",
    })
    .optional(),
  documents: z.array(z.instanceof(File)).optional(),
});

export type CreateObjekteUnitFormValues = z.infer<typeof localSchema>;

const defaultValues: CreateObjekteUnitFormValues = {
  usage_type: "residential",
  floor: "",
  living_space: 0,
  house_location: "",
  outdoor: "",
  rooms: undefined,
  house_fee: undefined,
  outdoor_area: undefined,
  residential_area: "",
  apartment_type: "",
  cellar_available: false,
  tags: [],
  heating_systems: [],
  documents: [],
};

export default function CreateObjekteUnitForm() {
  const methods = useForm({
    resolver: zodResolver(localSchema),
    defaultValues,
  });

  return (
    <Form {...methods}>
      <form
        id="objekte-form"
        className="w-10/12"
        onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <FormTagsInput<CreateObjekteUnitFormValues> control={methods.control} />
        <div className="w-full border-b py-5 space-y-5 border-dark_green/10">
          <h1 className="text-2xl mb-5 text-dark_green">
            1. OG Vorderhaus rechts, 76qm
          </h1>
          <FormRadioOptions<CreateObjekteUnitFormValues, UnitType>
            options={unitTypeOptions}
            control={methods.control}
            label="Nutzungsart auswählen"
            name="usage_type"
          />
          <h2 className="text-sm font-bold">Wohnungsdetails</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormSelectField<CreateObjekteUnitFormValues>
              control={methods.control}
              name="floor"
              label="Etage*"
              placeholder="Etage*"
              options={floorOptions}
            />
            <FormSelectField<CreateObjekteUnitFormValues>
              control={methods.control}
              name="house_location"
              label="Hauslage"
              placeholder="Hauslage"
              options={houseLocatonOptions}
            />
            <FormSelectField<CreateObjekteUnitFormValues>
              control={methods.control}
              name="residential_area"
              label="Wohnlage"
              placeholder="Wohnlage"
              options={residentialAreaOptions}
            />
            <FormSelectField<CreateObjekteUnitFormValues>
              control={methods.control}
              name="apartment_type"
              label="Wohnungstyp"
              placeholder="Wohnungstyp"
              options={apartmentTypeOptions}
            />
            <FormInputField<CreateObjekteUnitFormValues>
              control={methods.control}
              name="living_space"
              label="Wohnfläche*"
              placeholder="Quadratmeter"
            />
          </div>
        </div>
        <div className="w-full border-b py-5 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Allgemeine Informationen</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormInputField<CreateObjekteUnitFormValues>
              control={methods.control}
              label="Zimmeranzahl"
              placeholder="Anzahl der Zimmer"
              name="rooms"
            />
            <FormSelectField<CreateObjekteUnitFormValues>
              control={methods.control}
              name="outdoor"
              label="Außenbereich"
              placeholder="Außenbereich"
              options={outdoorOptions}
            />
            <FormInputField<CreateObjekteUnitFormValues>
              control={methods.control}
              label="Fläche Außenbereich"
              placeholder="Quadratmeter"
              name="outdoor_area"
            />
          </div>
          <FormRoundedCheckbox<CreateObjekteUnitFormValues>
            control={methods.control}
            name="cellar_available"
            label="Keller vorhanden"
          />
        </div>
        <FormTechnicalEquipment<CreateObjekteUnitFormValues>
          control={methods.control}
        />
        <div className="w-full border-b py-5 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">
            Verwaltungstechnische Informationen
          </h2>
          <FormField
            control={methods.control}
            name="house_fee"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-[#757575] text-sm">
                  Hausgeld
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <span className="absolute text-sm text-dark_green right-7 bottom-3">
                    €
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormDocuments<CreateObjekteUnitFormValues>
          control={methods.control}
          name="documents"
          label="Dokumente"
        />
        <Button type="submit" className="mt-6 ml-auto mr-0 block">
          Speichern
        </Button>
      </form>
    </Form>
  );
}
