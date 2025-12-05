"use client";

import { admin_form_info } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";
import { ROUTE_ADMIN, ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import type { DocCostCategoryType, InvoiceDocumentType } from "@/types";
import { useEffect } from "react";
import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";
import { formatEuro } from "@/utils";
import AdminCostTypesBuildingAccordion from "@/components/Admin/Docs/CostTypes/Admin/AdminCostTypesBuildingAccordion";

export default function AdminGesamtkostenBuildingForm({
  objektId,
  userId,
  operatingDocId,
  userDocCostCategories,
  relatedInvoices,
}: {
  objektId: string;
  userId: string;
  operatingDocId: string;
  userDocCostCategories: DocCostCategoryType[];
  relatedInvoices?: InvoiceDocumentType[];
}) {
  const { setDocumentGroups, documentGroups } =
    useBetriebskostenabrechnungStore();
  const isEditMode = !!relatedInvoices;

  useEffect(() => {
    const groups = userDocCostCategories.map((doc) => ({
      ...doc,
      data: isEditMode
        ? relatedInvoices.filter((invoice) => invoice.cost_type === doc.type)
        : [],
    }));
    setDocumentGroups(groups);
  }, [userDocCostCategories, setDocumentGroups, relatedInvoices, isEditMode]);

  const totalAmount = documentGroups.reduce((acc, group) => {
    const groupTotal =
      group.data?.reduce(
        (sum, item) => sum + Number(item.total_amount || 0),
        0
      ) || 0;
    return acc + groupTotal;
  }, 0);

  const backLink = isEditMode
    ? `${ROUTE_ADMIN}/${userId}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${operatingDocId}/abrechnungszeitraum`
    : `${ROUTE_ADMIN}/${userId}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objektId}/abrechnungszeitraum`;

  const nextLink = isEditMode
    ? `${ROUTE_ADMIN}/${userId}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${operatingDocId}/umlageschlussel`
    : `${ROUTE_ADMIN}/${userId}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objektId}/${operatingDocId}/umlageschlussel`;

  return (
    <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] overflow-y-auto col-span-2 rounded-2xl px-4 flex items-start justify-center">
      <div className="bg-white py-16 pb-4 px-[18px] rounded w-full shadow-sm space-y-8">
        <div className="flex items-center justify-between font-bold text-admin_dark_text pb-6 border-b border-gray-200">
          <h2 className="flex items-center justify-start gap-2">
            Gesamtkosten für das Gebäude{" "}
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6"
              src={admin_form_info}
              alt="admin_form_info"
            />
          </h2>
          <span>{formatEuro(totalAmount)}</span>
        </div>
        <h2 className="font-bold text-admin_dark_text">Kostenarten</h2>
        <AdminCostTypesBuildingAccordion
          objektId={objektId}
          operatingDocId={operatingDocId}
        />
        <div className="flex items-center justify-between mt-6 max-medium:mt-4">
          <Link
            href={backLink}
            className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300"
          >
            Zurück
          </Link>
          <Link
            href={nextLink}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none shrink-0 outline-none cursor-pointer bg-green text-dark_text shadow-xs hover:bg-green/80 px-7 py-4 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm"
          >
            Weiter
          </Link>
        </div>
      </div>
    </div>
  );
}
