"use client";

import { admin_form_info } from "@/static/icons";
import Image from "next/image";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import Link from "next/link";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import type { DocCostCategoryType, InvoiceDocumentType } from "@/types";
import { useEffect } from "react";
import CostTypesHeatObjektauswahlAccordion from "@/components/Admin/Docs/CostTypes/CostTypesHeatObjektauswahlAccordion";

export default function GesamtkostenHeatObjektauswahlForm({
  objektId,
  docId,
  userDocCostCategories,
  relatedInvoices,
}: {
  objektId: string;
  docId: string;
  userDocCostCategories: DocCostCategoryType[];
  relatedInvoices?: InvoiceDocumentType[];
}) {
  const { setDocumentGroups, documentGroups } = useHeizkostenabrechnungStore();
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
    ? `${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/weitermachen/${docId}/abrechnungszeitraum`
    : `${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/abrechnungszeitraum`;

  const nextLink = isEditMode
    ? `${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/weitermachen/${docId}/umlageschlussel`
    : `${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/${docId}/umlageschlussel`;

  return (
    <div className="bg-[#EFEEEC] border-y-[20px] max-medium:border-y-[10px] border-[#EFEEEC] col-span-2 max-medium:col-span-1 rounded-2xl max-medium:rounded-xl px-4 max-medium:px-2 flex items-start justify-center">
      <div className="bg-white py-16 max-xl:py-6 max-medium:py-4 overflow-y-auto h-full pb-4 px-[18px] max-medium:px-3 rounded w-full shadow-sm space-y-8 max-medium:space-y-4">
        <div className="flex items-center justify-between font-bold text-admin_dark_text pb-6 max-medium:pb-4 border-b border-gray-200">
          <h2 className="flex max-xl:text-sm max-medium:text-xs items-center justify-start gap-2">
            Gesamtkosten für das Gebäude{" "}
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6 max-xl:max-w-4 max-xl:max-h-4"
              src={admin_form_info}
              alt="admin_form_info"
            />
          </h2>
          <span className="max-medium:text-sm">{totalAmount} €</span>
        </div>
        <h2 className="font-bold text-admin_dark_text max-medium:text-sm">Kostenarten</h2>
        <CostTypesHeatObjektauswahlAccordion
          docId={docId}
          objektId={objektId}
        />
        <div className="flex items-center justify-between mt-6 max-medium:mt-4">
          <Link
            href={backLink}
            className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm max-medium:px-3 max-medium:py-2 max-medium:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300"
          >
            Zurück
          </Link>
          <Link
            href={nextLink}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none shrink-0 outline-none cursor-pointer bg-green text-dark_text shadow-xs hover:bg-green/80 px-7 py-4 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm max-medium:px-3 max-medium:py-2"
          >
            Weiter
          </Link>
        </div>
      </div>
    </div>
  );
}
