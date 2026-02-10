"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/Basic/ui/Form";
import { Button } from "@/components/Basic/ui/Button";
import FormRoundedCheckbox from "../FormRoundedCheckbox";
import FormSelectField from "../FormSelectField";
import FormDocuments from "../FormDocuments";
import { useRouter } from "next/navigation";
import FormDateInput from "../FormDateInput";
import FormMoneyInput from "../FormMoneyInput";
import { custodyTypeOptions } from "@/static/formSelectOptions";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { toast } from "sonner";
import { editContract } from "@/actions/edit/editContract";
import Image from "next/image";
import { admin_plus } from "@/static/icons";
import { useUploadDocuments } from "@/apiClient";
import { UploadedDocument } from "@/types";
import { useDocumentDeletion } from "@/hooks/useDocumentDeletion";
import { deleteDocumentById } from "@/actions/delete/deleteDocument";
import { useContractorActions } from "@/hooks/useContractorActions";
import FormContractorField from "../FormContractorFields";

const contractSchema = z.object({
  is_current: z.boolean(),
  is_unbefristet: z.boolean(),
  rental_start_date: z.coerce
    .date({
      errorMap: () => ({ message: "Ungültiges Datum" }),
    })
    .refine((val) => !isNaN(val.getTime()), { message: "Ungültiges Datum" }),
  rental_end_date: z.coerce
    .date({
      errorMap: () => ({ message: "Ungültiges Datum" }),
    })
    .refine((val) => !isNaN(val.getTime()), { message: "Ungültiges Datum" })
    .optional()
    .nullable(),
  contractors: z
    .array(
      z.object({
        first_name: z.string().min(1, "Pflichtfeld"),
        last_name: z.string().min(1, "Pflichtfeld"),
        birth_date: z.coerce
          .date({
            errorMap: () => ({ message: "Ungültiges Datum" }),
          })
          .refine((val) => !isNaN(val.getTime()), {
            message: "Ungültiges Datum",
          })
          .nullable(),
        email: z.preprocess(
          (val) => (val === "" ? undefined : val),
          z.string().email("Ungültige E-Mail-Adresse").optional().nullable()
        ),

        phone: z.preprocess(
          (val) => (val === "" ? undefined : val),
          z
            .string()
            .regex(/^\+?[0-9\s\-()]{7,}$/, "Ungültige Telefonnummer")
            .optional()
            .nullable()
        ),
      })
    )
    .min(1, "Mindestens ein Mieter erforderlich"),
  cold_rent: z.coerce.number().min(0, "Pflichtfeld"),
  additional_costs: z.coerce.number().min(0, "Pflichtfeld"),
  deposit: z.coerce.number().min(0, "Pflichtfeld"),
  custody_type: z.string().nullable().optional(),
  documents: z.array(z.instanceof(File)).nullable(),
});

export type EditContractFormValues = z.infer<typeof contractSchema>;

const defaultValues: EditContractFormValues = {
  is_current: false,
  is_unbefristet: true,
  rental_start_date: new Date(),
  rental_end_date: null,
  contractors: [
    {
      first_name: "",
      last_name: "",
      birth_date: null,
      email: "",
      phone: "",
    },
  ],
  cold_rent: 0,
  additional_costs: 0,
  deposit: 0,
  custody_type: null,
  documents: [],
};

export type EditContractFormProps = {
  id: string;
  localID: string;
  contractID: string;
  initialValues?: EditContractFormValues;
  uploadedDocuments?: UploadedDocument[];
};

export default function EditContractForm({
  id: objekteID,
  localID,
  contractID,
  initialValues,
  uploadedDocuments,
}: EditContractFormProps) {
  const router = useRouter();
  const uploadDocuments = useUploadDocuments();
  const methods = useForm({
    resolver: zodResolver(contractSchema),
    defaultValues: initialValues ?? defaultValues,
  });
  const { existingDocuments, deletedDocumentIds, handleRemoveExistingFile } =
    useDocumentDeletion(uploadedDocuments);

  const { addContractor } = useContractorActions(methods);

  const watchContractors = methods.watch("contractors");
  const isUnbefristet = methods.watch("is_unbefristet");

  return (
    <Form {...methods}>
      <form
        id="contract-form"
        className="w-10/12 max-medium:w-full"
        onSubmit={methods.handleSubmit(async (data: EditContractFormValues) => {
          try {
            data.is_unbefristet = !data.rental_end_date;
            await editContract(contractID, localID, data);

            if (data.documents && data.documents.length > 0) {
              await uploadDocuments.mutateAsync({
                files: data.documents,
                relatedId: contractID,
                relatedType: "contract",
              });
            }

            if (deletedDocumentIds.length > 0) {
              await Promise.all(
                deletedDocumentIds.map((id) => deleteDocumentById(id))
              );
            }

            toast.success("Erfolgreich aktualisiert");
            router.push(`${ROUTE_OBJEKTE}/${objekteID}`);
            methods.reset();
          } catch (err) {
            toast.error("Fehler beim Aktualisieren");
            console.error(err);
          }
        })}>
        <div className="w-full border-b py-5 max-medium:py-3 space-y-5 max-medium:space-y-3 border-dark_green/10">
          <div className="flex items-center justify-start gap-4 max-medium:flex-col max-medium:items-start max-medium:gap-2">
            <h1 className="text-2xl max-medium:text-lg text-dark_green">
              {watchContractors.length > 1 ? "Mieter -" : "Mieter -"}{" "}
              {watchContractors
                .map((c) => `${c.first_name} ${c.last_name}`)
                .join(", ")}
            </h1>
            <FormRoundedCheckbox<EditContractFormValues>
              control={methods.control}
              name="is_current"
              label="Aktueller Mieter"
              className="!mt-0"
            />
          </div>
          <div className="space-y-4 max-medium:space-y-3">
            <h2 className="text-sm font-bold">Mietzeitraum</h2>
            <div className="items-center gap-7 max-medium:gap-3 grid grid-cols-[1fr_auto_1fr] max-medium:grid-cols-1 w-full">
              <FormDateInput<EditContractFormValues>
                control={methods.control}
                label="Mietbeginn*"
                name="rental_start_date"
              />
              <span className="mt-8 max-medium:hidden inline-block">-</span>
              <FormDateInput<EditContractFormValues>
                control={methods.control}
                label="Mietende"
                name="rental_end_date"
                placeholder="Unbefristet"
                showClearButton={true}
                clearLabel="Unbefristet"
                onClear={() => methods.setValue("is_current", true)}
              />
            </div>
          </div>
          <h2 className="text-sm font-bold">Mietverhältnis</h2>
          {methods.watch("contractors").map((_, index) => (
            <FormContractorField<EditContractFormValues>
              key={index}
              control={methods.control}
              index={index}
              methods={methods}
            />
          ))}
          <button
            type="button"
            onClick={addContractor}
            className="flex items-center w-fit max-medium:w-full justify-center gap-2 px-6 py-5 max-medium:px-4 max-medium:py-3 border border-dark_green/50 rounded-md text-sm font-medium text-dark_green/50">
            <Image
              width={16}
              height={16}
              loading="lazy"
              className="max-w-4 max-h-4"
              src={admin_plus}
              alt="admin_plus"
            />
            Weiteren Mieter hinzufügen
          </button>
        </div>
        <div className="w-full border-b py-5 max-medium:py-3 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Monatliche Gesamtmiete</h2>
          <div className="grid grid-cols-3 max-medium:grid-cols-1 gap-4 max-medium:gap-3">
            <FormMoneyInput<EditContractFormValues>
              control={methods.control}
              name="cold_rent"
              label="Kaltmiete *"
            />
            <FormMoneyInput<EditContractFormValues>
              control={methods.control}
              name="additional_costs"
              label="Nebenkosten-Vorauszahlung *"
            />
          </div>
        </div>
        <div className="w-full border-b py-5 max-medium:py-3 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Mietkaution</h2>
          <div className="grid grid-cols-3 max-medium:grid-cols-1 gap-4 max-medium:gap-3">
            <FormMoneyInput<EditContractFormValues>
              control={methods.control}
              name="deposit"
              label="Kautionshöhe"
            />
            <FormSelectField<EditContractFormValues>
              control={methods.control}
              name="custody_type"
              label="Art der Verwahrung"
              placeholder="Art der Verwahrung"
              options={custodyTypeOptions}
            />
          </div>
        </div>
        <FormDocuments<EditContractFormValues>
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
          className="mt-6 max-medium:mt-4 ml-auto mr-0 block max-medium:w-full">
          {methods.formState.isSubmitting || uploadDocuments.isPending
            ? "Lädt..."
            : "Speichern"}
        </Button>
      </form>
    </Form>
  );
}
