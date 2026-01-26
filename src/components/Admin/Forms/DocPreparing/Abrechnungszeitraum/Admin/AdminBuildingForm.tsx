"use client";

import { Form } from "@/components/Basic/ui/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/Basic/ui/Button";
import Link from "next/link";
import { ROUTE_ADMIN, ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";
import { createBuildingDocuments } from "@/actions/create/createBuildingDocuments";
import { editBuildingDocument } from "@/actions/edit/editBuildingDocument";
import type { OperatingCostDocumentType } from "@/types";
import FormDateInput from "../../../FormDateInput";
import { adminCreateBuildingDocuments } from "@/actions/create/admin/adminCreateBuildingDocuments";

const abrechnungszeitraumBuildingSchema = z.object({
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
});

export type AbrechnungszeitraumBuildingFormValues = z.infer<
  typeof abrechnungszeitraumBuildingSchema
>;

const defaultValues: AbrechnungszeitraumBuildingFormValues = {
  start_date: new Date(new Date().getFullYear(), 0, 1),
  end_date: new Date(),
};

export default function AdminAbrechnungszeitraumBuildingForm({
  objekteID,
  userID,
  docValues,
}: {
  objekteID: string;
  userID: string;
  docValues?: OperatingCostDocumentType;
}) {
  const router = useRouter();
  const { setStartDate, setEndDate } = useBetriebskostenabrechnungStore();
  const isEditMode = !!docValues;

  const methods = useForm({
    resolver: zodResolver(abrechnungszeitraumBuildingSchema),
    defaultValues: docValues
      ? {
          ...docValues,
          start_date: new Date(
            docValues.start_date ?? defaultValues.start_date,
          ),
          end_date: new Date(docValues.end_date ?? defaultValues.end_date),
        }
      : defaultValues,
  });
  const { watch, getValues } = methods;

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

  const handleSubmit = async (data: AbrechnungszeitraumBuildingFormValues) => {
    try {
      const payload = {
        ...data,
        start_date: data.start_date?.toISOString() ?? null,
        end_date: data.end_date?.toISOString() ?? null,
      };

      if (isEditMode) {
        await editBuildingDocument(docValues.id ?? "", payload);
        router.push(
          `${ROUTE_ADMIN}/${userID}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${docValues.id}/gesamtkosten`,
        );
      } else {
        const result = await adminCreateBuildingDocuments(
          objekteID,
          userID,
          payload,
        );
        const insertedDoc = result?.[0];
        if (insertedDoc?.id) {
          router.push(
            `${ROUTE_ADMIN}/${userID}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objekteID}/${insertedDoc.id}/gesamtkosten`,
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
    ? `${ROUTE_ADMIN}/${userID}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/zwischenstand`
    : `${ROUTE_ADMIN}/${userID}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl`;

  return (
    <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] overflow-y-auto col-span-2 rounded-2xl px-4 flex items-center justify-center">
      <div className="bg-white overflow-y-auto h-full py-4 px-[18px] rounded w-full shadow-sm space-y-8">
        <Form {...methods}>
          <form
            className="flex flex-col justify-between h-full"
            id="abrechnungszeitraum-form"
            onSubmit={methods.handleSubmit(handleSubmit)}
          >
            <div className="space-y-9">
              <div className="space-y-3">
                <h2 className="font-bold text-admin_dark_text">
                  Abrechnungszeitraum
                </h2>
                <div className="items-center gap-7 grid grid-cols-[1fr_auto_1fr] w-full">
                  <FormDateInput<AbrechnungszeitraumBuildingFormValues>
                    control={methods.control}
                    label="Start*"
                    name="start_date"
                  />
                  <span className="mt-8 inline-block">-</span>
                  <FormDateInput<AbrechnungszeitraumBuildingFormValues>
                    control={methods.control}
                    label="Ende*"
                    name="end_date"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 max-medium:mt-4">
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
