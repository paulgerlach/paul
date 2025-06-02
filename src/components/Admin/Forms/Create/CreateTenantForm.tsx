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
import { createTenant } from "@/actions/createTenant";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { toast } from "sonner";

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

export type CreateTenantFormValues = z.infer<typeof tenantSchema>;

const defaultValues: CreateTenantFormValues = {
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

export default function CreateTenantForm({
  id: objekteID,
  localID,
}: {
  id: string;
  localID: string;
}) {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(tenantSchema),
    defaultValues,
  });

  return (
    <Form {...methods}>
      <form
        id="tenant-form"
        className="w-10/12"
        onSubmit={methods.handleSubmit(async (data) => {
          try {
            await createTenant(data, localID);
            toast.success("Created");
            router.push(`${ROUTE_OBJEKTE}/${objekteID}`);
            methods.reset();
          } catch (err) {
            toast.error("error");
            console.error(err);
          }
        })}>
        <div className="w-full border-b py-5 space-y-5 border-dark_green/10">
          <div className="flex items-center justify-start gap-4">
            <FormRoundedCheckbox<CreateTenantFormValues>
              control={methods.control}
              name="is_current"
              label="Aktueller Mieter"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-bold">Mietzeitraum</h2>
            <div className="flex items-center justify-start gap-7">
              <FormDateInput<CreateTenantFormValues>
                control={methods.control}
                label="Mietbeginn*"
                name="rental_start_date"
              />
              <span className="mt-8 inline-block">-</span>
              <FormDateInput<CreateTenantFormValues>
                control={methods.control}
                label="Mietende"
                name="rental_end_date"
              />
            </div>
          </div>
          <h2 className="text-sm font-bold">Mietverhältnis</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormInputField<CreateTenantFormValues>
              control={methods.control}
              name="first_name"
              label="Vorname*"
              placeholder="Vorname"
            />
            <FormInputField<CreateTenantFormValues>
              control={methods.control}
              name="last_name"
              label="Famillienname*"
              placeholder="Famillienname"
            />
            <FormDateInput<CreateTenantFormValues>
              control={methods.control}
              label="Geburtsdatum"
              name="birth_date"
            />
            <FormInputField<CreateTenantFormValues>
              control={methods.control}
              name="email"
              type="email"
              label="Emailadresse"
              placeholder="Emailadresse"
            />
            <FormInputField<CreateTenantFormValues>
              control={methods.control}
              name="phone"
              type="phone"
              label="Telefonnummer"
              placeholder="Telefonnummer"
            />
          </div>
        </div>
        <div className="w-full border-b py-5 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Monatliche Gesamtmiete</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormMoneyInput<CreateTenantFormValues>
              control={methods.control}
              name="cold_rent"
              label="Kaltmiete *"
            />
            <FormMoneyInput<CreateTenantFormValues>
              control={methods.control}
              name="additional_costs"
              label="Nebenkosten-Vorauszahlung *"
            />
          </div>
        </div>
        <div className="w-full border-b py-5 space-y-3 border-dark_green/10">
          <h2 className="text-sm font-bold">Mietkaution</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormMoneyInput<CreateTenantFormValues>
              control={methods.control}
              name="deposit"
              label="Kautionshöhe"
            />
            <FormSelectField<CreateTenantFormValues>
              control={methods.control}
              name="custody_type"
              label="Art der Verwahrung"
              placeholder="Art der Verwahrung"
              options={custodyTypeOptions}
            />
          </div>
        </div>
        <Button disabled={methods.formState.isSubmitting} type="submit" className="mt-6 ml-auto mr-0 block">
          Speichern
        </Button>
      </form>
    </Form>
  );
}
