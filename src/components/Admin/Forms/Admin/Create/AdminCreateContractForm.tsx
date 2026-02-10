"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/Basic/ui/Form";
import { Button } from "@/components/Basic/ui/Button";
import { useRouter } from "next/navigation";
import { custodyTypeOptions } from "@/static/formSelectOptions";
import { ROUTE_ADMIN, ROUTE_OBJEKTE } from "@/routes/routes";
import { toast } from "sonner";
import Image from "next/image";
import { admin_plus } from "@/static/icons";
import { useContractorActions } from "@/hooks/useContractorActions";
import FormRoundedCheckbox from "../../FormRoundedCheckbox";
import FormDateInput from "../../FormDateInput";
import FormContractorField from "../../FormContractorFields";
import FormMoneyInput from "../../FormMoneyInput";
import FormSelectField from "../../FormSelectField";
import { adminCreateContract } from "@/actions/create/admin/adminCreateContract";

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
          .optional()
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

export type CreateContractFormValues = z.infer<typeof contractSchema>;

const defaultValues: CreateContractFormValues = {
  is_current: false,
  is_unbefristet: true,
  rental_start_date: new Date(),
  rental_end_date: null,
  contractors: [
    {
      first_name: "",
      last_name: "",
      birth_date: new Date(),
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

export default function AdminCreateContractForm({
  objekteID,
  localID,
  userID,
}: {
  objekteID: string;
  localID: string;
  userID: string;
}) {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(contractSchema),
    defaultValues,
  });
  const { addContractor } = useContractorActions(methods);

  const watchContractors = methods.watch("contractors");
  const isUnbefristet = methods.watch("is_unbefristet");

  return (
    <Form {...methods}>
      <form
        id="contract-form"
        className="w-10/12 max-medium:w-full"
        onSubmit={methods.handleSubmit(async (data) => {
          try {
            await adminCreateContract(data, localID, userID);
            toast.success("Vertrag wurde erfolgreich erstellt.");
            router.push(
              `${ROUTE_ADMIN}/${userID}${ROUTE_OBJEKTE}/${objekteID}`
            );
            methods.reset();
          } catch (err) {
            toast.error(
              "Beim Erstellen des Vertrags ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
            );
            console.error(err);
          }
        })}
      >
        <div className="w-full border-b py-5 max-medium:py-3 space-y-5 max-medium:space-y-3 border-dark_green/10">
          <div className="flex max-medium:flex-col items-center max-medium:items-start justify-start gap-4 max-medium:gap-2">
            <h1 className="text-2xl max-medium:text-xl text-dark_green">
              {watchContractors.length > 1 ? "Mieter -" : "Mieter -"}{" "}
              {watchContractors
                .map((c) => `${c.first_name} ${c.last_name}`)
                .join(", ")}
            </h1>
            <FormRoundedCheckbox<CreateContractFormValues>
              control={methods.control}
              name="is_current"
              label="Aktueller Mieter"
              className="!mt-0"
            />
          </div>
          <div className="space-y-4 max-medium:space-y-3">
            <h2 className="text-sm font-bold">Mietzeitraum</h2>
            <div className="items-center gap-7 max-medium:gap-3 grid grid-cols-[1fr_auto_1fr] max-medium:grid-cols-1 w-full">
              <FormDateInput<CreateContractFormValues>
                control={methods.control}
                label="Mietbeginn*"
                name="rental_start_date"
                className="max-w-[300px]"
              />
              <span className="mt-8 max-medium:hidden inline-block">-</span>
              <div className="flex items-center gap-4">
                {!isUnbefristet && (
                  <FormDateInput<CreateContractFormValues>
                    control={methods.control}
                    label="Mietende"
                    name="rental_end_date"
                    className="max-w-[300px]"
                  />
                )}
                <div className="flex items-center justify-center h-full">
                  <FormRoundedCheckbox<CreateContractFormValues>
                    control={methods.control}
                    name="is_unbefristet"
                    label="Unbefristet"
                    className="!mt-0"
                  />
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-sm font-bold">Mietverhältnis</h2>
          {methods.watch("contractors").map((_, index) => (
            <FormContractorField<CreateContractFormValues>
              key={index}
              control={methods.control}
              index={index}
              methods={methods}
            />
          ))}
          <button
            type="button"
            onClick={addContractor}
            className="flex items-center w-fit max-medium:w-full justify-center gap-2 px-6 py-5 max-medium:px-4 max-medium:py-3 border border-dark_green/50 rounded-md text-sm font-medium text-dark_green/50"
          >
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
            <FormMoneyInput<CreateContractFormValues>
              control={methods.control}
              name="cold_rent"
              label="Kaltmiete *"
            />
            <FormMoneyInput<CreateContractFormValues>
              control={methods.control}
              name="additional_costs"
              label="Nebenkosten-Vorauszahlung *"
            />
          </div>
        </div>
        <div className="w-full border-b py-5 max-medium:py-3 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Mietkaution</h2>
          <div className="grid grid-cols-3 max-medium:grid-cols-1 gap-4 max-medium:gap-3">
            <FormMoneyInput<CreateContractFormValues>
              control={methods.control}
              name="deposit"
              label="Kautionshöhe"
            />
            <FormSelectField<CreateContractFormValues>
              control={methods.control}
              name="custody_type"
              label="Art der Verwahrung"
              placeholder="Art der Verwahrung"
              options={custodyTypeOptions}
            />
          </div>
        </div>
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
