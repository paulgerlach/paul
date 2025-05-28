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
import FormDocuments from "../FormDocuments";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { editLocal } from "@/actions/editLocal";
// import { useUploadDocuments } from "@/apiClient";

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

export type EditObjekteUnitFormValues = z.infer<typeof localSchema>;

const defaultValues: EditObjekteUnitFormValues = {
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

type EditObjekteUnitFormProps = {
  localID: string;
  objektID: string;
  initialValues?: EditObjekteUnitFormValues;
};

export default function EditObjekteUnitForm({
  objektID,
  localID,
  initialValues,
}: EditObjekteUnitFormProps) {
  const router = useRouter();
  // const uploadDocuments = useUploadDocuments();
  const methods = useForm({
    resolver: zodResolver(localSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  return (
    <Form {...methods}>
      <form
        id="objekte-form"
        className="w-10/12"
        onSubmit={methods.handleSubmit(async (data) => {
          try {
            await editLocal(localID, data);

            // if (data.documents && data.documents.length > 0) {
            //   await uploadDocuments.mutateAsync({
            //     files: data.documents,
            //     relatedId: localID,
            //     relatedType: "local",
            //   });
            // }

            toast.success("Created");
            router.push(`${ROUTE_OBJEKTE}/${objektID}`);
            methods.reset();
          } catch (err) {
            toast.error("error");
            console.error(err);
          }
        })}>
        <FormTagsInput<EditObjekteUnitFormValues> control={methods.control} />
        <div className="w-full border-b py-5 space-y-5 border-dark_green/10">
          <h1 className="text-2xl mb-5 text-dark_green">
            {methods.watch("floor")}, {methods.watch("living_space")}qm
          </h1>
          <FormRadioOptions<EditObjekteUnitFormValues, UnitType>
            options={unitTypeOptions}
            control={methods.control}
            label="Nutzungsart auswählen"
            name="usage_type"
          />
          <h2 className="text-sm font-bold">Wohnungsdetails</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormSelectField<EditObjekteUnitFormValues>
              control={methods.control}
              name="floor"
              label="Etage*"
              placeholder="Etage*"
              options={floorOptions}
            />
            <FormSelectField<EditObjekteUnitFormValues>
              control={methods.control}
              name="house_location"
              label="Hauslage"
              placeholder="Hauslage"
              options={houseLocatonOptions}
            />
            <FormSelectField<EditObjekteUnitFormValues>
              control={methods.control}
              name="residential_area"
              label="Wohnlage"
              placeholder="Wohnlage"
              options={residentialAreaOptions}
            />
            <FormSelectField<EditObjekteUnitFormValues>
              control={methods.control}
              name="apartment_type"
              label="Wohnungstyp"
              placeholder="Wohnungstyp"
              options={apartmentTypeOptions}
            />
            <FormInputField<EditObjekteUnitFormValues>
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
            <FormInputField<EditObjekteUnitFormValues>
              control={methods.control}
              label="Zimmeranzahl"
              placeholder="Anzahl der Zimmer"
              name="rooms"
            />
            <FormSelectField<EditObjekteUnitFormValues>
              control={methods.control}
              name="outdoor"
              label="Außenbereich"
              placeholder="Außenbereich"
              options={outdoorOptions}
            />
            <FormInputField<EditObjekteUnitFormValues>
              control={methods.control}
              label="Fläche Außenbereich"
              placeholder="Quadratmeter"
              name="outdoor_area"
            />
          </div>
          <FormRoundedCheckbox<EditObjekteUnitFormValues>
            control={methods.control}
            name="cellar_available"
            label="Keller vorhanden"
          />
        </div>
        <FormTechnicalEquipment<EditObjekteUnitFormValues>
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
        <FormDocuments<EditObjekteUnitFormValues>
          control={methods.control}
          name="documents"
          label="Dokumente"
        />
        <Button type="submit" className="mt-6 ml-auto mr-0 block">
          {/* {uploadDocuments.isPending ? "Lädt..." : ""} */}
          Speichern
        </Button>
      </form>
    </Form>
  );
}
