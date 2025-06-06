"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/Basic/ui/Form";
import { Button } from "@/components/Basic/ui/Button";
import Image from "next/image";
import { white_check_green_box } from "@/static/icons";
import type { BuildingType } from "@/types";
import { handleObjektTypeIcon } from "@/utils";
import {
  heatingSystemOptions,
  administrationTypeOptions,
} from "@/static/formSelectOptions";
import FormTechnicalEquipment from "../FormTechnicalEquipment";
import FormTagsInput from "../FormTagsInput";
import FormRoundedCheckbox from "../FormRoundedCheckbox";
import FormSelectField from "../FormSelectField";
import FormInputField from "../FormInputField";
import { createObjekt } from "@/actions/create/createObjekt";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTE_OBJEKTE } from "@/routes/routes";

const objektTypeOptions: {
  type: BuildingType;
  name: string;
}[] = [
  {
    type: "condominium",
    name: "Eigentumswohnung",
  },
  {
    type: "multi_family",
    name: "Mehrfamilienhaus",
  },
  {
    type: "commercial",
    name: "Gewerbeimmobilie",
  },
  {
    type: "special_purpose",
    name: "Sonderimmobilie",
  },
];

const objectSchema = z.object({
  objekt_type: z.string().min(1, "Pflichtfeld"),
  street: z.string().min(1, "Pflichtfeld"),
  zip: z.string().min(4, "Pflichtfeld"),
  administration_type: z.string().min(1, "Pflichtfeld"),
  hot_water_preparation: z.string().min(1, "Pflichtfeld"),
  livingArea: z.coerce.number().optional(),
  usableArea: z.coerce.number().optional(),
  landArea: z.coerce.number().optional(),
  buildYear: z.coerce.number().optional(),
  hasElevator: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  heating_systems: z
    .array(z.string())
    .refine((val) => val.every((item) => heatingSystemOptions.includes(item)), {
      message: "Ungültige Auswahl",
    })
    .optional(),
});

export type CreateObjekteFormValues = z.infer<typeof objectSchema>;

export default function CreateObjekteForm() {
  const router = useRouter();
  const methods = useForm<CreateObjekteFormValues>({
    resolver: zodResolver(objectSchema),
    defaultValues: {
      hasElevator: false,
      objekt_type: "condominium",
      tags: [],
      street: "",
      zip: "",
      administration_type: "",
      hot_water_preparation: "",
      livingArea: undefined,
      usableArea: undefined,
      landArea: undefined,
      buildYear: undefined,
      heating_systems: [],
    },
  });

  return (
    <Form {...methods}>
      <form
        id="objekte-form"
        className="w-10/12"
        onSubmit={methods.handleSubmit(async (data) => {
          try {
            await createObjekt(data);
            toast.success("Created");
            router.push(ROUTE_OBJEKTE);
            methods.reset();
          } catch (err) {
            toast.error("error");
            console.error(err);
          }
        })}>
        <FormTagsInput<CreateObjekteFormValues> control={methods.control} />
        <div className="w-full border-b py-5 space-y-5 border-dark_green/10">
          <h2 className="text-sm font-bold">Angaben zum Objekt</h2>
          <FormField
            control={methods.control}
            name="objekt_type"
            render={({ field }) => (
              <div className="grid grid-cols-4 gap-6">
                {objektTypeOptions.map((option) => (
                  <div key={option.type}>
                    <input
                      id={option.type}
                      type="radio"
                      className="sr-only peer"
                      aria-label={option.name}
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
                        src={handleObjektTypeIcon(option.type) || ""}
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
          <FormSelectField<CreateObjekteFormValues>
            control={methods.control}
            name="administration_type"
            label="Art der Verwaltung*"
            placeholder="Art der Verwaltung"
            options={administrationTypeOptions}
          />
        </div>
        <div className="w-full border-b py-5 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Allgemeine Objektdaten</h2>
          <div className="grid grid-cols-9 gap-4">
            <FormInputField<CreateObjekteFormValues>
              control={methods.control}
              name="street"
              label="Straßenname*"
              placeholder="Straßenname"
              className="col-span-5"
            />
            <FormInputField<CreateObjekteFormValues>
              control={methods.control}
              name="zip"
              label="Postleizahl*"
              placeholder="Postleizahl"
              className="col-span-3"
            />
            <FormInputField<CreateObjekteFormValues>
              control={methods.control}
              name="livingArea"
              label="Wohnfläche"
              type="number"
              placeholder="Quadratmeter"
              className="col-span-3"
            />
            <FormInputField<CreateObjekteFormValues>
              control={methods.control}
              name="usableArea"
              label="Nutzfläche"
              type="number"
              placeholder="Quadratmeter"
              className="col-span-3"
            />
            <FormInputField<CreateObjekteFormValues>
              control={methods.control}
              name="landArea"
              label="Grundstücksfläche"
              type="number"
              placeholder="Quadratmeter"
              className="col-span-3"
            />
            <FormInputField<CreateObjekteFormValues>
              control={methods.control}
              name="buildYear"
              label="Baujahr"
              type="number"
              placeholder="Jahr"
              className="col-span-3"
            />
          </div>
          <FormRoundedCheckbox<CreateObjekteFormValues>
            control={methods.control}
            name="hasElevator"
            label="Aufzug vorhanden"
          />
        </div>
        <FormTechnicalEquipment<CreateObjekteFormValues>
          control={methods.control}
        />
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
