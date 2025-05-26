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
import type { UnitType } from "@/types";
import {
  apartmentTypeOptions,
  floorOptions,
  heatingSystemOptions,
  houseLocatonOptions,
  outdoorOptions,
  residentialAreaOptions,
} from "@/static/formSelectOptions";
import FormTagsInput from "../FormTagsInput";
import FormRadioOptions, { FormRadioOption } from "../FormRadioOptions";
import FormTechnicalEquipment from "../FormTechnicalEquipment";
import FormRoundedCheckbox from "../FormRoundedCheckbox";
import FormSelectField from "../FormSelectField";
import FormInputField from "../FormInputField";
import FormDocuments from "../FormDocuments";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import Link from "next/link";

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
  house_location: z.string().nullable(),
  outdoor: z.string().nullable(),
  rooms: z.coerce.number().nullable(),
  house_fee: z.coerce.number().nullable(),
  outdoor_area: z.coerce.number().nullable(),
  residential_area: z.string().nullable(),
  apartment_type: z.string().nullable(),
  cellar_available: z.boolean().nullable(),
  tags: z.array(z.string()).nullable(),
  heating_systems: z
    .array(z.string())
    .refine((val) => val.every((item) => heatingSystemOptions.includes(item)), {
      message: "Ungültige Auswahl",
    })
    .nullable(),
  documents: z.array(z.instanceof(File)).nullable(),
});

export type InfoObjekteUnitFormValues = z.infer<typeof localSchema>;

const defaultValues: InfoObjekteUnitFormValues = {
  usage_type: "residential",
  floor: "",
  living_space: 0,
  house_location: "",
  outdoor: "",
  rooms: null,
  house_fee: null,
  outdoor_area: null,
  residential_area: "",
  apartment_type: "",
  cellar_available: false,
  tags: [],
  heating_systems: [],
  documents: [],
};

type InfoObjekteUnitFormProps = {
  objektID: string;
  initialValues?: InfoObjekteUnitFormValues;
};

export default function InfoObjekteUnitForm({
  objektID,
  initialValues,
}: InfoObjekteUnitFormProps) {
  const methods = useForm({
    resolver: zodResolver(localSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  return (
    <Form {...methods}>
      <form id="objekte-form" className="w-10/12">
        <FormTagsInput<InfoObjekteUnitFormValues>
          disabled
          control={methods.control}
        />
        <div className="w-full border-b py-5 space-y-5 border-dark_green/10">
          <h1 className="text-2xl mb-5 text-dark_green">
            1. OG Vorderhaus rechts, 76qm
          </h1>
          <FormRadioOptions<InfoObjekteUnitFormValues, UnitType>
            options={unitTypeOptions}
            control={methods.control}
            disabled
            label="Nutzungsart auswählen"
            name="usage_type"
          />
          <h2 className="text-sm font-bold">Wohnungsdetails</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormSelectField<InfoObjekteUnitFormValues>
              control={methods.control}
              name="floor"
              label="Etage*"
              disabled
              placeholder="Etage*"
              options={floorOptions}
            />
            <FormSelectField<InfoObjekteUnitFormValues>
              control={methods.control}
              name="house_location"
              label="Hauslage"
              disabled
              placeholder="Hauslage"
              options={houseLocatonOptions}
            />
            <FormSelectField<InfoObjekteUnitFormValues>
              control={methods.control}
              name="residential_area"
              label="Wohnlage"
              disabled
              placeholder="Wohnlage"
              options={residentialAreaOptions}
            />
            <FormSelectField<InfoObjekteUnitFormValues>
              control={methods.control}
              name="apartment_type"
              label="Wohnungstyp"
              disabled
              placeholder="Wohnungstyp"
              options={apartmentTypeOptions}
            />
            <FormInputField<InfoObjekteUnitFormValues>
              control={methods.control}
              name="living_space"
              label="Wohnfläche*"
              disabled
              placeholder="Quadratmeter"
            />
          </div>
        </div>
        <div className="w-full border-b py-5 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Allgemeine Informationen</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormInputField<InfoObjekteUnitFormValues>
              control={methods.control}
              label="Zimmeranzahl"
              disabled
              placeholder="Anzahl der Zimmer"
              name="rooms"
            />
            <FormSelectField<InfoObjekteUnitFormValues>
              control={methods.control}
              name="outdoor"
              disabled
              label="Außenbereich"
              placeholder="Außenbereich"
              options={outdoorOptions}
            />
            <FormInputField<InfoObjekteUnitFormValues>
              control={methods.control}
              label="Fläche Außenbereich"
              placeholder="Quadratmeter"
              disabled
              name="outdoor_area"
            />
          </div>
          <FormRoundedCheckbox<InfoObjekteUnitFormValues>
            control={methods.control}
            name="cellar_available"
            label="Keller vorhanden"
            disabled
          />
        </div>
        <FormTechnicalEquipment<InfoObjekteUnitFormValues>
          control={methods.control}
          disabled
        />
        <div className="w-full border-b py-5 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">
            Verwaltungstechnische Informationen
          </h2>
          <FormField
            control={methods.control}
            name="house_fee"
            disabled
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-[#757575] text-sm">
                  Hausgeld
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input disabled {...field} value={field.value ?? ""} />
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
        <FormDocuments<InfoObjekteUnitFormValues>
          control={methods.control}
          name="documents"
          disabled
          label="Dokumente"
        />
        <Link
          href={`${ROUTE_OBJEKTE}/${objektID}`}
          className="mt-6 ml-auto mr-0 flex bg-green text-dark_text shadow-xs hover:bg-green/80 px-7 py-4 duration-300 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none cursor-pointer">
          Zurück zur Liste
        </Link>
      </form>
    </Form>
  );
}
