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
import type { UnitType, UploadedDocument } from "@/types";
import {
  apartmentTypeOptions,
  floorOptions,
  heatingSystemOptions,
  houseLocatonOptions,
  outdoorOptions,
  residentialAreaOptions,
} from "@/static/formSelectOptions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTE_ADMIN, ROUTE_OBJEKTE } from "@/routes/routes";
import { editLocal } from "@/actions/edit/editLocal";
import { useUploadDocuments } from "@/apiClient";
import { deleteDocumentById } from "@/actions/delete/deleteDocument";
import { useDocumentDeletion } from "@/hooks/useDocumentDeletion";
import { buildLocalName } from "@/utils";
import { createLocalMeters } from "@/actions/create/createLocalMeters";
import FormTagsInput from "../../FormTagsInput";
import FormRadioOptions, { type FormRadioOption } from "../../FormRadioOptions";
import FormSelectField from "../../FormSelectField";
import FormInputField from "../../FormInputField";
import FormRoundedCheckbox from "../../FormRoundedCheckbox";
import FormTechnicalEquipment from "../../FormTechnicalEquipment";
import FormDocuments from "../../FormDocuments";
import FormMetersField from "../../FormMetersField";

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
  id: z.string().nullable(),
  rooms: z.coerce.number().nullable(),
  house_fee: z.coerce.number().nullable(),
  outdoor_area: z.coerce.number().nullable(),
  residential_area: z.string().nullable(),
  apartment_type: z.string().nullable(),
  meters: z
    .array(
      z.object({
        meter_number: z.string().nullable(),
        meter_note: z.string().nullable(),
        meter_type: z.string().nullable(),
      })
    )
    .nullable(),
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

export type AdminEditObjekteUnitFormValues = z.infer<typeof localSchema>;

const defaultValues: AdminEditObjekteUnitFormValues = {
  usage_type: "residential",
  floor: "",
  living_space: 0,
  house_location: "",
  outdoor: "",
  id: "",
  rooms: null,
  house_fee: null,
  outdoor_area: null,
  residential_area: "",
  apartment_type: "",
  cellar_available: false,
  tags: [],
  heating_systems: [],
  documents: [],
  meters: [{ meter_number: "", meter_note: "", meter_type: "" }],
};

type EditObjekteUnitFormProps = {
  localID: string;
  objektID: string;
  userID: string;
  initialValues?: AdminEditObjekteUnitFormValues;
  uploadedDocuments?: UploadedDocument[];
};

export default function AdminEditObjekteUnitForm({
  objektID,
  localID,
  userID,
  initialValues,
  uploadedDocuments,
}: EditObjekteUnitFormProps) {
  const router = useRouter();
  const uploadDocuments = useUploadDocuments();
  const methods = useForm({
    resolver: zodResolver(localSchema),
    defaultValues: initialValues ?? defaultValues,
  });
  const { existingDocuments, deletedDocumentIds, handleRemoveExistingFile } =
    useDocumentDeletion(uploadedDocuments);

  const floor = methods.watch("floor");
  const house_location = methods.watch("house_location");
  const residential_area = methods.watch("residential_area");
  const living_space = methods.watch("living_space");

  return (
    <Form {...methods}>
      <form
        id="objekte-form"
        className="w-10/12"
        onSubmit={methods.handleSubmit(async (data) => {
          try {
            await editLocal(localID, data);

            if (data.meters && data.meters.length > 0) {
              await createLocalMeters(data.meters, localID);
            }

            if (data.documents && data.documents.length > 0) {
              await uploadDocuments.mutateAsync({
                files: data.documents,
                relatedId: localID,
                relatedType: "local",
              });
            }

            if (deletedDocumentIds.length > 0) {
              await Promise.all(
                deletedDocumentIds.map((id) => deleteDocumentById(id))
              );
            }

            toast.success("Erfolgreich aktualisiert");
            router.push(`${ROUTE_ADMIN}/${userID}${ROUTE_OBJEKTE}/${objektID}`);
            methods.reset();
          } catch (err) {
            toast.error("Fehler beim Aktualisieren");
            console.error(err);
          }
        })}
      >
        <FormTagsInput<AdminEditObjekteUnitFormValues>
          control={methods.control}
        />
        <div className="w-full border-b py-5 space-y-5 border-dark_green/10">
          <h1 className="text-2xl mb-5 text-dark_green">
            {buildLocalName({
              floor,
              house_location,
              residential_area,
              living_space: String(living_space),
            })}
          </h1>
          <FormRadioOptions<AdminEditObjekteUnitFormValues, UnitType>
            options={unitTypeOptions}
            control={methods.control}
            label="Nutzungsart auswählen"
            name="usage_type"
          />
          <h2 className="text-sm font-bold">Wohnungsdetails</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormSelectField<AdminEditObjekteUnitFormValues>
              control={methods.control}
              name="floor"
              label="Etage*"
              placeholder="Etage*"
              options={floorOptions}
            />
            <FormSelectField<AdminEditObjekteUnitFormValues>
              control={methods.control}
              name="house_location"
              label="Hauslage"
              placeholder="Hauslage"
              options={houseLocatonOptions}
            />
            <FormSelectField<AdminEditObjekteUnitFormValues>
              control={methods.control}
              name="residential_area"
              label="Wohnlage"
              placeholder="Wohnlage"
              options={residentialAreaOptions}
            />
            <FormSelectField<AdminEditObjekteUnitFormValues>
              control={methods.control}
              name="apartment_type"
              label="Wohnungstyp"
              placeholder="Wohnungstyp"
              options={apartmentTypeOptions}
            />
            <FormInputField<AdminEditObjekteUnitFormValues>
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
            <FormInputField<AdminEditObjekteUnitFormValues>
              control={methods.control}
              label="Zimmeranzahl"
              placeholder="Anzahl der Zimmer"
              name="rooms"
            />
            <FormSelectField<AdminEditObjekteUnitFormValues>
              control={methods.control}
              name="outdoor"
              label="Außenbereich"
              placeholder="Außenbereich"
              options={outdoorOptions}
            />
            <FormInputField<AdminEditObjekteUnitFormValues>
              control={methods.control}
              label="Fläche Außenbereich"
              placeholder="Quadratmeter"
              name="outdoor_area"
            />
          </div>
          <FormRoundedCheckbox<AdminEditObjekteUnitFormValues>
            control={methods.control}
            name="cellar_available"
            label="Keller vorhanden"
          />
        </div>
        <FormTechnicalEquipment<AdminEditObjekteUnitFormValues>
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
        <FormMetersField control={methods.control} />
        <FormDocuments<AdminEditObjekteUnitFormValues>
          control={methods.control}
          name="documents"
          label="Dokumente"
          existingFiles={existingDocuments}
          deletedFileIds={deletedDocumentIds}
          onRemoveExistingFile={handleRemoveExistingFile}
        />
        <Button
          disabled={methods.formState.isSubmitting || uploadDocuments.isPending}
          type="submit"
          className="mt-6 ml-auto mr-0 block"
        >
          {methods.formState.isSubmitting || uploadDocuments.isPending
            ? "Lädt..."
            : "Speichern"}
        </Button>
      </form>
    </Form>
  );
}
