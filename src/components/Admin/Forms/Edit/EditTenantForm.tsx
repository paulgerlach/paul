"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/Basic/ui/Form";
import { Button } from "@/components/Basic/ui/Button";
import FormRoundedCheckbox from "../FormRoundedCheckbox";
import FormSelectField from "../FormSelectField";
import FormInputField from "../FormInputField";
import FormDocuments from "../FormDocuments";
import { useRouter } from "next/navigation";
import FormDateInput from "../FormDateInput";
import FormMoneyInput from "../FormMoneyInput";
import { custodyTypeOptions } from "@/static/formSelectOptions";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { toast } from "sonner";
import { editTenant } from "@/actions/editTenant";
import Link from "next/link";
import Image from "next/image";
import { admin_plus } from "@/static/icons";
import { useUploadDocuments } from "@/apiClient";
import { UploadedDocument } from "@/types";
import { useDocumentDeletion } from "@/utils/client";
import { deleteDocumentById } from "@/actions/deleteDocument";

const tenantSchema = z.object({
  is_current: z.boolean(),
  rental_start_date: z.coerce
    .date({
      errorMap: () => ({ message: "Ungültiges Datum" }),
    })
    .refine((val) => !isNaN(val.getTime()), { message: "Ungültiges Datum" }),
  rental_end_date: z.coerce
    .date({
      errorMap: () => ({ message: "Ungültiges Datum" }),
    })
    .refine((val) => !isNaN(val.getTime()), { message: "Ungültiges Datum" }),
  first_name: z.string().min(1, "Pflichtfeld"),
  last_name: z.string().min(1, "Pflichtfeld"),
  birth_date: z.coerce
    .date({
      errorMap: () => ({ message: "Ungültiges Datum" }),
    })
    .refine((val) => !isNaN(val.getTime()), { message: "Ungültiges Datum" }),
  email: z.string().min(1, "Pflichtfeld").email("Ungültige E-Mail-Adresse"),
  phone: z
    .string()
    .min(1, "Pflichtfeld")
    .regex(/^\+?[0-9\s\-()]{7,}$/, "Ungültige Telefonnummer"),
  cold_rent: z.coerce.number().min(0, "Pflichtfeld"),
  additional_costs: z.coerce.number().min(0, "Pflichtfeld"),
  deposit: z.coerce.number().min(0, "Pflichtfeld"),
  custody_type: z.string().nullable().optional(),
  documents: z.array(z.instanceof(File)).nullable(),
});

export type EditTenantFormValues = z.infer<typeof tenantSchema>;

const defaultValues: EditTenantFormValues = {
  is_current: false,
  rental_start_date: new Date(),
  rental_end_date: new Date(),
  first_name: "",
  last_name: "",
  birth_date: new Date(),
  email: "",
  phone: "",
  cold_rent: 0,
  additional_costs: 0,
  deposit: 0,
  custody_type: null,
  documents: [],
};

export type EditTenantFormProps = {
  id: string;
  localID: string;
  tenantID: string;
  initialValues?: EditTenantFormValues;
  uploadedDocuments?: UploadedDocument[];
};

export default function EditTenantForm({
  id: objekteID,
  localID,
  tenantID,
  initialValues,
  uploadedDocuments,
}: EditTenantFormProps) {
  const router = useRouter();
  const uploadDocuments = useUploadDocuments();
  const methods = useForm({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialValues ?? defaultValues,
  });
  const { existingDocuments, deletedDocumentIds, handleRemoveExistingFile } =
    useDocumentDeletion(uploadedDocuments);

  return (
    <Form {...methods}>
      <form
        id="tenant-form"
        className="w-10/12"
        onSubmit={methods.handleSubmit(async (data: EditTenantFormValues) => {
          try {
            await editTenant(tenantID, data);

            if (data.documents && data.documents.length > 0) {
              await uploadDocuments.mutateAsync({
                files: data.documents,
                relatedId: tenantID,
                relatedType: "tenant",
              });
            }

            if (deletedDocumentIds.length > 0) {
              await Promise.all(
                deletedDocumentIds.map((id) => deleteDocumentById(id))
              );
            }

            toast.success("Updated successfully");
            router.push(`${ROUTE_OBJEKTE}/${objekteID}`);
            methods.reset();
          } catch (err) {
            toast.error("error");
            console.error(err);
          }
        })}>
        <div className="w-full border-b py-5 space-y-5 border-dark_green/10">
          <div className="flex items-center justify-start gap-4">
            <h1 className="text-2xl text-dark_green">
              Mieter - {methods.watch("first_name")}{" "}
              {methods.watch("last_name")}
            </h1>
            <FormRoundedCheckbox<EditTenantFormValues>
              control={methods.control}
              name="is_current"
              label="Aktueller Mieter"
              className="!mt-0"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-bold">Mietzeitraum</h2>
            <div className="flex items-center justify-start gap-7">
              <FormDateInput<EditTenantFormValues>
                control={methods.control}
                label="Mietbeginn*"
                name="rental_start_date"
              />
              <span className="mt-8 inline-block">-</span>
              <FormDateInput<EditTenantFormValues>
                control={methods.control}
                label="Mietende"
                name="rental_end_date"
              />
            </div>
          </div>
          <h2 className="text-sm font-bold">Mietverhältnis</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormInputField<EditTenantFormValues>
              control={methods.control}
              name="first_name"
              label="Vorname*"
              placeholder="Vorname"
            />
            <FormInputField<EditTenantFormValues>
              control={methods.control}
              name="last_name"
              label="Famillienname*"
              placeholder="Famillienname"
            />
            <FormDateInput<EditTenantFormValues>
              control={methods.control}
              label="Geburtsdatum"
              name="birth_date"
            />
            <FormInputField<EditTenantFormValues>
              control={methods.control}
              name="email"
              type="email"
              label="Emailadresse"
              placeholder="Emailadresse"
            />
            <FormInputField<EditTenantFormValues>
              control={methods.control}
              name="phone"
              type="phone"
              label="Telefonnummer"
              placeholder="Telefonnummer"
            />
          </div>
          <Link
            className="flex items-center w-fit justify-center gap-2 px-6 py-5 border border-dark_green/50 rounded-md text-sm font-medium text-dark_green/50"
            href={`${ROUTE_OBJEKTE}/${objekteID}/${localID}/create-tenant`}>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-4 max-h-4"
              src={admin_plus}
              alt="admin_plus"
            />
            Weiteren Mieter hinzufügen
          </Link>
        </div>
        <div className="w-full border-b py-5 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Monatliche Gesamtmiete</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormMoneyInput<EditTenantFormValues>
              control={methods.control}
              name="cold_rent"
              label="Kaltmiete *"
            />
            <FormMoneyInput<EditTenantFormValues>
              control={methods.control}
              name="additional_costs"
              label="Nebenkosten-Vorauszahlung *"
            />
          </div>
        </div>
        <div className="w-full border-b py-5 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Mietkaution</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormMoneyInput<EditTenantFormValues>
              control={methods.control}
              name="deposit"
              label="Kautionshöhe"
            />
            <FormSelectField<EditTenantFormValues>
              control={methods.control}
              name="custody_type"
              label="Art der Verwahrung"
              placeholder="Art der Verwahrung"
              options={custodyTypeOptions}
            />
          </div>
        </div>
        <FormDocuments<EditTenantFormValues>
          control={methods.control}
          name="documents"
          label="Dokumente"
          existingFiles={existingDocuments}
          deletedFileIds={deletedDocumentIds}
          onRemoveExistingFile={handleRemoveExistingFile}
        />
        <Button
          disabled={methods.formState.isSubmitting}
          type="submit"
          className="mt-6 ml-auto mr-0 block">
          {methods.formState.isSubmitting || uploadDocuments.isPending
            ? "Lädt..."
            : "Speichern"}
        </Button>
      </form>
    </Form>
  );
}
