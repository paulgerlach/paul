"use client";

import { Form } from "@/components/Basic/ui/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormDateInput from "../FormDateInput";
import FormPercentInput from "../FormPercentInput";
import { Button } from "@/components/Basic/ui/Button";
import Link from "next/link";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

const abrechnungszeitraumSchema = z.object({
  start_date: z.coerce
    .date({
      errorMap: () => ({ message: "Ungültiges Datum" }),
    })
    .refine((val) => !isNaN(val.getTime()), { message: "Ungültiges Datum" }),
  end_date: z.coerce
    .date({
      errorMap: () => ({ message: "Ungültiges Datum" }),
    })
    .refine((val) => !isNaN(val.getTime()), { message: "Ungültiges Datum" }),
  consumption_dependent: z.coerce.number().min(0, "Pflichtfeld"),
  living_space_share: z.coerce.number().min(0, "Pflichtfeld"),
});

export type AbrechnungszeitraumFormValues = z.infer<
  typeof abrechnungszeitraumSchema
>;

const defaultValues: AbrechnungszeitraumFormValues = {
  start_date: new Date(),
  end_date: new Date(),
  consumption_dependent: 0,
  living_space_share: 0,
};

export default function AbrechnungszeitraumForm({
  id: objekteID,
}: {
  id: string;
}) {
  const methods = useForm({
    resolver: zodResolver(abrechnungszeitraumSchema),
    defaultValues,
  });
  return (
    <div className="bg-[#EFEEEC] h-full col-span-2 rounded-2xl px-4 py-5 flex items-center justify-center">
      <div className="bg-white h-full py-4 px-[18px] rounded w-full shadow-sm space-y-8">
        <Form {...methods}>
          <form
            className="flex flex-col h-full justify-between"
            id="abrechnungszeitraum-form">
            <div className="space-y-9">
              <div className="space-y-3">
                <h2 className="font-bold text-admin_dark_text">
                  Abrechnungszeitraum
                </h2>
                <div className="items-center gap-7 grid grid-cols-[1fr_auto_1fr] w-full">
                  <FormDateInput<AbrechnungszeitraumFormValues>
                    control={methods.control}
                    label="Beginn*"
                    name="start_date"
                  />
                  <span className="mt-8 inline-block">-</span>
                  <FormDateInput<AbrechnungszeitraumFormValues>
                    control={methods.control}
                    label="Ende*"
                    name="end_date"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="font-bold text-admin_dark_text">
                  Verteilerschlüssel
                </h2>
                <div className="grid grid-cols-2 gap-12">
                  <FormPercentInput<AbrechnungszeitraumFormValues>
                    control={methods.control}
                    label="Beginn*"
                    name="consumption_dependent"
                  />
                  <FormPercentInput<AbrechnungszeitraumFormValues>
                    control={methods.control}
                    label="Ende*"
                    name="living_space_share"
                  />
                </div>
                <p className="text-sm text-[#757575]">
                  Die Heizkosten werden in der Regel verbrauchsabhängig und
                  anteilig nach Wohnfläche verteilt - gesetzlich vorgeschrieben
                  ist dabei ein verbrauchsbezogener Anteil von mindestens 50 %.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link
                href={`${ROUTE_HEIZKOSTENABRECHNUNG}/local/${objekteID}`}
                className="py-2 px-6 rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300">
                Zurück
              </Link>
              <Button type="submit">Loslegen</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
