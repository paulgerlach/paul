"use client";

import { Form } from "@/components/Basic/ui/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormDateInput from "../../../FormDateInput";
import FormPercentInput from "../../../FormPercentInput";
import { Button } from "@/components/Basic/ui/Button";
import Link from "next/link";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { editHeatingBillDocument } from "@/actions/edit/editHeatingBillDocument";
import type { HeatingBillDocumentType } from "@/types";
import { adminCreateHeatingBillDocuments } from "@/actions/create/admin/adminCreateHeatingBillDocuments";

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
  start_date: new Date(new Date().getFullYear(), 0, 1),
  end_date: new Date(),
  consumption_dependent: 70,
  living_space_share: 30,
};

export default function AdminAbrechnungszeitraumLocalForm({
  objektID,
  userID,
  localId,
  docValues,
}: {
  objektID: string;
  userID: string;
  localId: string;
  docValues?: HeatingBillDocumentType;
}) {
  const router = useRouter();
  const { setStartDate, setEndDate } = useHeizkostenabrechnungStore();
  const isEditMode = !!docValues;

  const methods = useForm({
    resolver: zodResolver(abrechnungszeitraumSchema),
    defaultValues: docValues
      ? {
          ...docValues,
          start_date: new Date(
            docValues.start_date ?? defaultValues.start_date
          ),
          end_date: new Date(docValues.end_date ?? defaultValues.end_date),
          consumption_dependent: Number(docValues.consumption_dependent),
          living_space_share: Number(docValues.living_space_share),
        }
      : defaultValues,
  });
  const { setValue, watch, getValues } = methods;

  useEffect(() => {
    const subscription = watch((values) => {
      if (values.start_date) setStartDate(values.start_date);
      if (values.end_date) setEndDate(values.end_date);
    });

    return () => subscription.unsubscribe();
  }, [watch, setStartDate, setEndDate]);

  useEffect(() => {
    const start_date = getValues("start_date");
    const end_date = getValues("end_date");
    if (start_date) setStartDate(start_date);
    if (end_date) setEndDate(end_date);
  }, []);

  const handleSubmit = async (data: AbrechnungszeitraumFormValues) => {
    try {
      const payload = {
        ...data,
        start_date: data.start_date?.toISOString() ?? null,
        end_date: data.end_date?.toISOString() ?? null,
        consumption_dependent: String(data.consumption_dependent),
        living_space_share: String(data.living_space_share),
      };

      if (isEditMode) {
        await editHeatingBillDocument(docValues.id ?? "", payload);
        router.push(
          `${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${docValues.id}/gesamtkosten`
        );
      } else {
        const result = await adminCreateHeatingBillDocuments(
          objektID,
          localId,
          userID,
          payload
        );
        const insertedDoc = result?.[0];
        if (insertedDoc?.id) {
          router.push(
            `${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektID}/${localId}/${insertedDoc.id}/gesamtkosten`
          );
        } else {
          console.error("Kein Dokument wurde erstellt.");
        }
      }
    } catch (err) {
      console.error("Fehler beim Verarbeiten des Dokuments:", err);
    }
  };

  const backLink = isEditMode
    ? `${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/zwischenstand`
    : `${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektID}`;

  return (
    <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] overflow-y-auto col-span-2 rounded-2xl px-4 flex items-center justify-center">
      <div className="bg-white h-full py-4 px-[18px] rounded w-full shadow-sm space-y-8 max-xl:space-y-4">
        <Form {...methods}>
          <form
            className="flex flex-col justify-between h-full"
            id="abrechnungszeitraum-form"
            onSubmit={methods.handleSubmit(handleSubmit)}
          >
            <div className="space-y-9 max-xl:space-y-4">
              <div className="space-y-3">
                <h2 className="font-bold text-admin_dark_text">
                  Abrechnungszeitraum
                </h2>
                <div className="items-center gap-7 max-xl:gap-3.5 grid grid-cols-[1fr_auto_1fr] w-full">
                  <FormDateInput<AbrechnungszeitraumFormValues>
                    control={methods.control}
                    label="Verbrauchabhänig*"
                    name="start_date"
                  />
                  <span className="mt-8 inline-block">-</span>
                  <FormDateInput<AbrechnungszeitraumFormValues>
                    control={methods.control}
                    label="Wohnflächenanteil*"
                    name="end_date"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="font-bold text-admin_dark_text">
                  Verteilerschlüssel
                </h2>
                <div className="grid grid-cols-2 gap-12 max-xl:gap-8">
                  <FormPercentInput<AbrechnungszeitraumFormValues>
                    control={methods.control}
                    label="Verbrauchsabhänig*"
                    onChange={(e) => {
                      setValue(
                        "living_space_share",
                        100 - Number(e.target.value)
                      );
                    }}
                    name="consumption_dependent"
                  />
                  <FormPercentInput<AbrechnungszeitraumFormValues>
                    control={methods.control}
                    label="Wohnflächenanteil*"
                    onChange={(e) => {
                      setValue(
                        "consumption_dependent",
                        100 - Number(e.target.value)
                      );
                    }}
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
                href={backLink}
                className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300"
              >
                Zurück
              </Link>
              <Button type="submit">Weiter</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
