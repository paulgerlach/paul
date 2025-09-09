"use client";

import { useDialogStore } from "@/store/useDialogStore";
import DialogBase from "../ui/DialogBase";
import { DialogStoreActionType } from "@/types";
import { Button } from "../ui/Button";
import { Form } from "../ui/Form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormMoneyInput from "@/components/Admin/Forms/FormMoneyInput";
import FormDateInput from "@/components/Admin/Forms/FormDateInput";
import FormInputField from "@/components/Admin/Forms/FormInputField";
import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";
import FormSelectField from "@/components/Admin/Forms/FormSelectField";
import FormRoundedCheckbox from "@/components/Admin/Forms/FormRoundedCheckbox";
import { useDocumentDeletion } from "@/hooks/useDocumentDeletion";
import FormDocument from "@/components/Admin/Forms/FormDocument";
import { format } from "date-fns";
import { toast } from "sonner";
import { useLocalsByObjektID, useUploadDocuments } from "@/apiClient";
import { buildLocalName } from "@/utils";
import { createInvoiceDocument } from "@/actions/create/createInvoiceDocument";
import FormLocalsultiselect from "@/components/Admin/Forms/FormLocalsMultiselect";

const addDocBetriebskostenabrechnungDialogSchema = z.object({
  invoice_date: z.coerce
    .date({
      errorMap: () => ({ message: "Ungültiges Datum" }),
    })
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

export type AddDocBetriebskostenabrechnungDialogFormValues = z.infer<
  typeof addDocBetriebskostenabrechnungDialogSchema
>;

const defaultValues: AddDocBetriebskostenabrechnungDialogFormValues = {
  invoice_date: new Date(),
  total_amount: 0,
  service_period: false,
  for_all_tenants: true,
  purpose: "",
  notes: "",
  document: [],
  direct_local_id: null,
};

export default function AddDocBetriebskostenabrechnungDialog() {
  const { openDialogByType, closeDialog } = useDialogStore();
  const {
    purposeOptions,
    activeCostType,
    updateDocumentGroup,
    objektID,
    operatingDocID,
  } = useBetriebskostenabrechnungStore();
  const { data: locals } = useLocalsByObjektID(objektID);
  const isOpen = Object.entries(openDialogByType).some(
    ([key, value]) =>
      key.endsWith("_betriebskostenabrechnung_upload") && value === true
  );
  const activeDialog = Object.entries(openDialogByType).find(
    ([_, value]) => value === true
  )?.[0];
  const methods = useForm({
    resolver: zodResolver(addDocBetriebskostenabrechnungDialogSchema),
    defaultValues,
  });
  const uploadDocuments = useUploadDocuments();
  const { deletedDocumentIds } = useDocumentDeletion([]);

  const servicePeriod = methods.watch("service_period");
  const forAllTenants = methods.watch("for_all_tenants");

  const onSubmit = async (
    data: AddDocBetriebskostenabrechnungDialogFormValues
  ) => {
    if (!activeCostType) return;

    const { document, ...rest } = data;
    const formattedPayload = {
      invoice_date: rest.invoice_date
        ? format(rest.invoice_date, "yyyy-MM-dd")
        : null,
      total_amount:
        rest.total_amount != null ? String(rest.total_amount) : null,
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
    } else {
      await createInvoiceDocument(
        {
          ...formattedPayload,
          invoice_date: rest.invoice_date,
          total_amount: rest.total_amount != null ? rest.total_amount : null,
        },
        objektID,
        operatingDocID,
        activeCostType
      );

      updateDocumentGroup(activeCostType, formattedPayload);

      if (data.document && data.document.length > 0) {
        await uploadDocuments.mutateAsync({
          files: data.document,
          relatedId: operatingDocID ?? "",
          relatedType: "operating_costs",
        });
      }

      closeDialog(activeDialog as DialogStoreActionType);
      toast.success("Rechnung erfolgreich hinzugefügt");
      methods.resetField("document");
      methods.reset(defaultValues);
    }
  };

  if (!isOpen) return null;

  return (
    <DialogBase dialogName={activeDialog as DialogStoreActionType}>
      <p className="font-bold text-lg text-admin_dark_text -mt-6">
        Neue Ausgaben
      </p>
      <Form {...methods}>
        <form
          className="flex flex-col justify-between space-y-6 max-xl:space-y-3 h-full"
          id="heizkostenabrechnung-dialog-form"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="items-start gap-7 grid grid-cols-2 w-full">
            <FormDateInput<AddDocBetriebskostenabrechnungDialogFormValues>
              control={methods.control}
              label="Rechnungsdatum"
              name="invoice_date"
            />
            <FormMoneyInput<AddDocBetriebskostenabrechnungDialogFormValues>
              control={methods.control}
              label="Gesamtbetrag *"
              name="total_amount"
            />
          </div>
          <div className="gap-2 grid grid-cols-2 max-xl:items-center">
            <p className="text-lg max-xl:text-base text-admin_dark_text">
              Leistungszeitraum entspricht dem Rechnungsdatum.
            </p>
            <div className="rounded-full h-fit w-fit p-0.5 bg-[#EAEAEA] flex items-center justify-center mr-0 ml-auto">
              <button
                type="button"
                onClick={() => methods.setValue("service_period", false)}
                className={`text-admin_dark_text text-lg max-xl:text-sm max-xl:px-4 py-1 px-8 max-xl: rounded-full ${
                  servicePeriod === false ? "bg-white" : "bg-[#EAEAEA]"
                } cursor-pointer transition-all duration-300`}
              >
                Nein
              </button>
              <button
                type="button"
                onClick={() => methods.setValue("service_period", true)}
                className={`text-admin_dark_text text-lg max-xl:text-sm max-xl:px-4 py-1 px-8 rounded-full ${
                  servicePeriod === true ? "bg-white" : "bg-[#EAEAEA]"
                } cursor-pointer transition-all duration-300`}
              >
                Ja
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[#757575] text-sm">Zahlungsempfänger</p>
            <div className="px-3.5 py-4 space-y-6 max-xl:p-2 border border-black/20 rounded-md">
              <FormRoundedCheckbox<AddDocBetriebskostenabrechnungDialogFormValues>
                control={methods.control}
                name="for_all_tenants"
                label="Für Alle Mieter der Leigenschaft"
                className="!mt-0 h-fit"
              />
              {!forAllTenants && (
                <FormLocalsultiselect<AddDocBetriebskostenabrechnungDialogFormValues>
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
                />
              )}
            </div>
          </div>

          <FormSelectField<AddDocBetriebskostenabrechnungDialogFormValues>
            control={methods.control}
            name="purpose"
            label="Zweck auswählen *"
            placeholder=""
            options={purposeOptions}
          />
          <FormInputField<AddDocBetriebskostenabrechnungDialogFormValues>
            control={methods.control}
            name="notes"
            label="Anmerkungen"
            placeholder=""
          />
          <FormDocument<AddDocBetriebskostenabrechnungDialogFormValues>
            control={methods.control}
            name="document"
            deletedFileIds={deletedDocumentIds}
            label=""
            title=""
          />
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="px-6 py-4 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm border border-black/20 cursor-pointer rounded-md bg-white text-admin_dark_text text-lg font-medium shadow-xs transition-all duration-300 hover:opacity-80"
              onClick={() => {
                methods.reset(defaultValues);
                closeDialog(activeDialog as DialogStoreActionType);
              }}
            >
              Abbrechen
            </button>
            <Button
              type="submit"
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
