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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTE_ADMIN, ROUTE_OBJEKTE } from "@/routes/routes";
import { useEffect } from "react";
import { useStreetSuggestions } from "@/hooks/useStreetSuggestions";
import { adminCreateObjekt } from "@/actions/create/admin/adminCreateObjekt";
import FormTagsInput from "../../FormTagsInput";
import FormSelectField from "../../FormSelectField";
import FormZipField from "../../FormZipField";
import FormInputField from "../../FormInputField";
import FormRoundedCheckbox from "../../FormRoundedCheckbox";
import FormTechnicalEquipment from "../../FormTechnicalEquipment";

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
  zip: z.string().regex(/^\d{5}$/, "Ungültige PLZ"),
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

export default function AdminCreateObjekteForm({ userID }: { userID: string }) {
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

  const { fetchStreets } = useStreetSuggestions<CreateObjekteFormValues>();

  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === "zip") fetchStreets(value.zip ?? "");
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, fetchStreets, methods]);

  return (
    <Form {...methods}>
      <form
        id="objekte-form"
        className="w-10/12 max-medium:w-full"
        onSubmit={methods.handleSubmit(async (data) => {
          try {
            await adminCreateObjekt(data, userID);
            toast.success("Objekt wurde erfolgreich erstellt.");
            router.push(`${ROUTE_ADMIN}/${userID}${ROUTE_OBJEKTE}`);
            methods.reset();
          } catch (err) {
            toast.error(
              "Beim Erstellen des Objekts ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
            );
            console.error(err);
          }
        })}
      >
        <FormTagsInput<CreateObjekteFormValues> control={methods.control} />
        <div className="w-full border-b py-5 max-medium:py-3 space-y-5 max-medium:space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Angaben zum Objekt</h2>
          <FormField
            control={methods.control}
            name="objekt_type"
            render={({ field }) => (
              <div className="grid grid-cols-4 max-medium:grid-cols-2 gap-6 max-medium:gap-3">
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
                      className="cursor-pointer flex min-h-32 max-medium:min-h-24 rounded bg-white flex-col shadow-md py-5 px-7 max-medium:py-3 max-medium:px-3 items-center border-4 border-transparent justify-center gap-5 max-medium:gap-2 text-sm max-medium:text-xs transition-all duration-300 font-medium peer-checked:border-green peer-checked:[&_.objektTypeCheckmark]:opacity-100 relative"
                      htmlFor={option.type}
                    >
                      <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        loading="lazy"
                        className="max-w-9 max-h-9 max-medium:max-w-6 max-medium:max-h-6"
                        src={handleObjektTypeIcon(option.type) || ""}
                        alt="option image"
                      />
                      <span className="max-medium:text-center max-medium:leading-tight">{option.name}</span>
                      <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        loading="lazy"
                        className="max-w-6 opacity-0 transition-all duration-300 objektTypeCheckmark absolute -top-[1px] -right-[1px] max-h-6 max-medium:max-w-5 max-medium:max-h-5"
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
        <div className="w-full border-b py-5 max-medium:py-3 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Allgemeine Objektdaten</h2>
          <div className="grid grid-cols-9 max-medium:grid-cols-1 gap-4 max-medium:gap-3">
            <FormZipField<CreateObjekteFormValues>
              methods={methods}
              name="zip"
              className="max-medium:col-span-1"
            />
            <FormInputField<CreateObjekteFormValues>
              control={methods.control}
              name="street"
              label="Straßenname*"
              placeholder="Straßenname"
              className="col-span-5 max-medium:col-span-1"
            />
            <FormInputField<CreateObjekteFormValues>
              control={methods.control}
              name="livingArea"
              label="Wohnfläche"
              type="number"
              placeholder="Quadratmeter"
              className="col-span-3 max-medium:col-span-1"
            />
            <FormInputField<CreateObjekteFormValues>
              control={methods.control}
              name="usableArea"
              label="Nutzfläche"
              type="number"
              placeholder="Quadratmeter"
              className="col-span-3 max-medium:col-span-1"
            />
            <FormInputField<CreateObjekteFormValues>
              control={methods.control}
              name="landArea"
              label="Grundstücksfläche"
              type="number"
              placeholder="Quadratmeter"
              className="col-span-3 max-medium:col-span-1"
            />
            <FormInputField<CreateObjekteFormValues>
              control={methods.control}
              name="buildYear"
              label="Baujahr"
              type="number"
              placeholder="Jahr"
              className="col-span-3 max-medium:col-span-1"
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
          className="mt-6 max-medium:mt-4 ml-auto mr-0 block max-medium:w-full"
        >
          Speichern
        </Button>
      </form>
    </Form>
  );
}
