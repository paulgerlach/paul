"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../ui/DialogBase";
import { DialogStoreActionType } from "@/types";
import { Button } from "../ui/Button";
import { Form } from "../ui/Form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormMoneyInput from "@/components/Admin/Forms/FormMoneyInput";
import FormDateInput from "@/components/Admin/Forms/FormDateInput";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import FormSelectField from "@/components/Admin/Forms/FormSelectField";
import FormRoundedCheckbox from "@/components/Admin/Forms/FormRoundedCheckbox";
import { useDocumentDeletion } from "@/hooks/useDocumentDeletion";
import FormDocument from "@/components/Admin/Forms/FormDocument";
import { format, parse } from "date-fns";
import { toast } from "sonner";
import { useLocalsByObjektID, useUploadDocuments } from "@/apiClient";
import FormLocalsultiselect from "@/components/Admin/Forms/FormLocalsMultiselect";
import { buildLocalName, isFuelCostType } from "@/utils";
import { createHeatingInvoice } from "@/actions/create/createHeatingInvoice";
import { useEffect, useMemo, useRef } from "react";
import {
  buildInvoiceNotes,
  mapCostCategoryToPurpose,
  processInvoicesViaNext,
} from "@/api/invoices";
import FormTextareaField from "@/components/Admin/Forms/FormTextareaField";
import { useMutation } from "@tanstack/react-query";

const addDocHeizkostenabrechnungDialogSchema = z.object({
  invoice_date: z.coerce
    .date({ errorMap: () => ({ message: "Ungültiges Datum" }) })
    .refine((val) => !isNaN(val.getTime()), { message: "Ungültiges Datum" })
    .nullable(),
  total_amount: z.coerce.number().min(1, "Pflichtfeld").nullable(),
  service_period: z.boolean().nullable(),
  for_all_tenants: z.boolean().nullable(),
  direct_local_id: z.array(z.string()).nullable(),
  purpose: z.string().min(1, "Pflichtfeld").nullable(),
  notes: z.string().nullable(),
  document: z.array(z.instanceof(File)).optional(),
});

export type AddDocHeizkostenabrechnungDialogFormValues = z.infer<
  typeof addDocHeizkostenabrechnungDialogSchema
>;

const defaultValues: AddDocHeizkostenabrechnungDialogFormValues = {
  invoice_date: new Date(),
  total_amount: 0,
  service_period: false,
  for_all_tenants: true,
  purpose: "",
  notes: "",
  document: [],
  direct_local_id: null,
};

export default function AddDocHeizkostenabrechnungDialog() {
  const { openDialogByType, closeDialog } = useDialogStore();
  const {
    purposeOptions,
    activeCostType,
    updateDocumentGroup,
    objektID,
    operatingDocID,
  } = useHeizkostenabrechnungStore();

  const { data: locals } = useLocalsByObjektID(objektID);

  const activeDialog = useMemo(() => {
    return Object.entries(openDialogByType).find(
      ([key, value]) =>
        key.endsWith("_heizkostenabrechnung_upload") &&
        value === true &&
        !key.includes("admin_")
    )?.[0];
  }, [openDialogByType]);

  const isOpen = Boolean(activeDialog);

  const methods = useForm<AddDocHeizkostenabrechnungDialogFormValues>({
    resolver: zodResolver(addDocHeizkostenabrechnungDialogSchema),
    defaultValues,
  });

  const uploadDocuments = useUploadDocuments();
  const { deletedDocumentIds } = useDocumentDeletion([]);
  const forAllTenants = methods.watch("for_all_tenants");
  const watchedDocs = methods.watch("document") ?? [];
  const servicePeriod = methods.watch("service_period");
  const isFuelCost = isFuelCostType(activeCostType);

  const processedFilesRef = useRef<Set<string>>(new Set());
  const fileKey = (f: File) => `${f.name}_${f.size}_${f.lastModified}`;

  // ✅ TanStack mutation for invoice processing
  const parseInvoicesMutation = useMutation({
    mutationFn: async (files: File[]) => processInvoicesViaNext(files),
    onSuccess: (result) => {
      const invoice = result.invoices?.[0];
      if (!invoice) return;

      if (invoice.invoice_date) {
        const d = parse(invoice.invoice_date, "dd.MM.yyyy", new Date());
        if (!isNaN(d.getTime())) {
          methods.setValue("invoice_date", d, { shouldValidate: true });
        }
      }

      if (typeof invoice.gross_amount === "number") {
        methods.setValue("total_amount", invoice.gross_amount, {
          shouldValidate: true,
        });
      }

      const mappedPurpose = mapCostCategoryToPurpose(
        invoice.cost_category,
        purposeOptions
      );
      if (mappedPurpose) {
        methods.setValue("purpose", mappedPurpose, { shouldValidate: true });
      }

      if (invoice.building_check?.is_whole_building === true) {
        methods.setValue("for_all_tenants", true);
        methods.setValue("direct_local_id", null);
      }

      if (!isFuelCost) {
        const autoNotes = buildInvoiceNotes(invoice);
        if (autoNotes) {
          const currentNotes = methods.getValues("notes") ?? "";
          const nextNotes = currentNotes
            ? `${currentNotes}${autoNotes}`
            : autoNotes.trimStart();
          methods.setValue("notes", nextNotes, { shouldValidate: false });
        }
      }
    },
    onError: (e: any) => {
      toast.error(e?.message || "Invoice parsing failed");
    },
  });

  const isProcessingInvoice = parseInvoicesMutation.isPending;

  // ✅ run invoice parsing whenever new documents are added (skip for fuel costs)
  useEffect(() => {
    if (isFuelCost) return;
    if (!watchedDocs.length) return;

    const newFiles = watchedDocs.filter(
      (f) => !processedFilesRef.current.has(fileKey(f))
    );
    if (!newFiles.length) return;

    parseInvoicesMutation.mutate(newFiles, {
      onSettled: () => {
        newFiles.forEach((f) => processedFilesRef.current.add(fileKey(f)));
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDocs, isFuelCost]);

  const onSubmit = async (data: AddDocHeizkostenabrechnungDialogFormValues) => {
    if (isProcessingInvoice) return; // ✅ don't submit while parsing
    if (!activeCostType || !activeDialog) return;

    if (isFuelCostType(activeCostType)) {
      if (!data.notes || String(data.notes).trim() === "") {
        methods.setError("notes", { message: "Pflichtfeld" });
        return;
      }
      // Validate against the same regex pattern as the database constraint: positive numbers and decimals only
      const notesString = String(data.notes).trim();
      if (!/^\d+(\.\d+)?$/.test(notesString)) {
        methods.setError("notes", { message: "Nur positive Zahlen erlaubt" });
        return;
      }
    }

    const { document, ...rest } = data;

    const formattedPayload = {
      invoice_date: rest.invoice_date
        ? format(rest.invoice_date, "yyyy-MM-dd")
        : null,
      total_amount: rest.total_amount != null ? String(rest.total_amount) : null,
      service_period: rest.service_period,
      for_all_tenants: rest.for_all_tenants,
      purpose: rest.purpose,
      notes: rest.notes,
      direct_local_id:
        rest.for_all_tenants === false ? rest.direct_local_id : null,
      document,
    };

    if (!document?.length) {
      toast.error("Rechnung beifügen");
      return;
    }

    const res = await createHeatingInvoice(
      {
        ...formattedPayload,
        invoice_date: rest.invoice_date,
        total_amount: rest.total_amount != null ? rest.total_amount : null,
      },
      objektID,
      operatingDocID,
      activeCostType
    );

    updateDocumentGroup(activeCostType, res);

    await uploadDocuments.mutateAsync({
      files: document,
      relatedId: operatingDocID ?? "",
      relatedType: "heating_bill",
    });

    closeDialog(activeDialog as DialogStoreActionType);
    toast.success("Rechnung erfolgreich hinzugefügt");
    methods.reset(defaultValues);
    processedFilesRef.current.clear();
  };

  if (!isOpen) return null;

  return (
    <DialogBase dialogName={activeDialog as DialogStoreActionType}>
      <p className="font-bold text-lg text-admin_dark_text -mt-6">
        Neue Ausgaben
      </p>

      <Form {...methods}>
        <form
          className="relative flex flex-col justify-between space-y-6 max-xl:space-y-3 h-full"
          id="heizkostenabrechnung-dialog-form"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          {/* ✅ Loader overlay while invoice processing */}
          {isProcessingInvoice && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-white/70">
              <div className="flex items-center gap-3 text-admin_dark_text">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />
                <span className="text-sm">Rechnung wird verarbeitet…</span>
              </div>
            </div>
          )}

          <div className="items-start gap-7 grid grid-cols-2 w-full">
            <FormDateInput<AddDocHeizkostenabrechnungDialogFormValues>
              control={methods.control}
              label="Rechnungsdatum"
              name="invoice_date"
              disabled={isProcessingInvoice}
            />
            <FormMoneyInput<AddDocHeizkostenabrechnungDialogFormValues>
              control={methods.control}
              label="Gesamtbetrag *"
              name="total_amount"
              disabled={isProcessingInvoice}
            />
          </div>

          <div className="gap-2 grid grid-cols-2 max-xl:items-center">
            <p className="text-lg max-xl:text-base text-admin_dark_text">
              Leistungszeitraum entspricht dem Rechnungsdatum.
            </p>

            <div className="rounded-full h-fit w-fit p-0.5 bg-[#EAEAEA] flex items-center justify-center mr-0 ml-auto">
              <button
                type="button"
                disabled={isProcessingInvoice}
                onClick={() => methods.setValue("service_period", false)}
                className={`text-admin_dark_text text-lg max-xl:text-sm max-xl:px-4 py-1 px-8 max-xl: rounded-full ${servicePeriod === false ? "bg-white" : "bg-[#EAEAEA]"
                  } cursor-pointer transition-all duration-300`}
              >
                Nein
              </button>
              <button
                type="button"
                disabled={isProcessingInvoice}
                onClick={() => methods.setValue("service_period", true)}
                className={`text-admin_dark_text text-lg max-xl:text-sm max-xl:px-4 py-1 px-8 rounded-full ${servicePeriod === true ? "bg-white" : "bg-[#EAEAEA]"
                  } cursor-pointer transition-all duration-300`}
              >
                Ja
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[#757575] text-sm">Zahlungsempfänger</p>
            <div className="px-3.5 py-4 space-y-6 max-xl:p-2 border border-black/20 rounded-md">
              <FormRoundedCheckbox<AddDocHeizkostenabrechnungDialogFormValues>
                control={methods.control}
                name="for_all_tenants"
                label="Für Alle Mieter der Leigenschaft"
                className="!mt-0 h-fit"
                disabled={isProcessingInvoice}
              />

              {!forAllTenants && (
                <FormLocalsultiselect<AddDocHeizkostenabrechnungDialogFormValues>
                  options={
                    locals
                      ?.filter((local) => local.id !== undefined)
                      .map((local) => ({
                        label: buildLocalName(local),
                        value: local.id as string,
                      })) || []
                  }
                  control={methods.control}
                  name="direct_local_id"
                  label="Mieter auswählen *"
                  disabled={isProcessingInvoice}
                />
              )}
            </div>
          </div>

          <FormSelectField<AddDocHeizkostenabrechnungDialogFormValues>
            control={methods.control}
            name="purpose"
            label="Zweck auswählen *"
            placeholder=""
            options={purposeOptions}
            disabled={isProcessingInvoice}
          />

          <FormTextareaField<AddDocHeizkostenabrechnungDialogFormValues>
            control={methods.control}
            name="notes"
            label={isFuelCost ? "Menge in kWh *" : "Anmerkungen"}
            placeholder=""
            rows={4}
            disabled={isProcessingInvoice}
          />

          <FormDocument<AddDocHeizkostenabrechnungDialogFormValues>
            control={methods.control}
            name="document"
            deletedFileIds={deletedDocumentIds}
            label=""
            title=""
            disabled={isProcessingInvoice}
          />

          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={isProcessingInvoice}
              className="!font-medium !text-lg max-xl:!text-sm !bg-white !border-black/20 !text-admin_dark_text hover:!bg-gray-100 hover:!text-admin_dark_text"
              onClick={() => {
                if (isProcessingInvoice) return;
                methods.reset(defaultValues);
                processedFilesRef.current.clear();
                closeDialog(activeDialog as DialogStoreActionType);
              }}
            >
              Abbrechen
            </Button>

            <Button
              type="submit"
              disabled={isProcessingInvoice}
              className="!font-medium !text-lg max-xl:!text-sm"
            >
              Speichern
            </Button>
          </div>
        </form>
      </Form>
    </DialogBase>
  );
}
