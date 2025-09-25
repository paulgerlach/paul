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
import FormTagsInput from "../FormTagsInput";
import FormRadioOptions, { FormRadioOption } from "../FormRadioOptions";
import FormTechnicalEquipment from "../FormTechnicalEquipment";
import FormRoundedCheckbox from "../FormRoundedCheckbox";
import FormSelectField from "../FormSelectField";
import FormInputField from "../FormInputField";
import { useRouter } from "next/navigation";
import { createLocal } from "@/actions/create/createLocal";
import { toast } from "sonner";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { buildLocalName } from "@/utils";

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
  {
    type: "basement",
    name: "Keller",
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

export type CreateObjekteUnitFormValues = z.infer<typeof localSchema>;

const defaultValues: CreateObjekteUnitFormValues = {
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

export default function CreateObjekteUnitForm({
  id: objekteID,
}: {
  id: string;
}) {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(localSchema),
    defaultValues,
  });

  const floor = methods.watch("floor");
  const house_location = methods.watch("house_location");
  const residential_area = methods.watch("residential_area");
  const living_space = methods.watch("living_space");

  return (
    <Form {...methods}>
      <form
        id="local-form"
        className="w-10/12"
        onSubmit={methods.handleSubmit(async (data) => {
          try {
            await createLocal(data, objekteID);
            toast.success("Einheit wurde erfolgreich erstellt.");
            router.push(`${ROUTE_OBJEKTE}/${objekteID}`);
            methods.reset();
          } catch (err) {
            toast.error(
              "Beim Erstellen der Einheit ist ein Fehler aufgetreten."
            );
            console.error(err);
          }
        })}>
        <FormTagsInput<CreateObjekteUnitFormValues> control={methods.control} />
        <div className="w-full border-b py-5 space-y-5 border-dark_green/10">
          <h1 className="text-2xl mb-5 text-dark_green">
            {buildLocalName({
              floor,
              house_location,
              residential_area,
              living_space: String(living_space),
            })}
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
                    <Input {...field} value={field.value ?? ""} />
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
        <Button
          disabled={methods.formState.isSubmitting}
          type="submit"
          className="mt-6 ml-auto mr-0 block">
          Speichern
        </Button>
      </form>
    </Form>
  );
}
