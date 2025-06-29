"use client";

import { admin_form_info } from "@/static/icons";
import Image from "next/image";
import CostTypesAccordion from "../../Docs/CostTypes/CostTypesAccordion";
import { type HeizkostenabrechnungCostType, useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import Link from "next/link";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import type { DocCostCategoryType } from "@/types";
import { useEffect } from "react";

export default function GesamtkostenForm({
  objektId,
  localId,
  basicDocCosyCategories,
  userDocCostCategories
}: {
  objektId: string;
  localId: string;
  userDocCostCategories: DocCostCategoryType[];
  basicDocCosyCategories: DocCostCategoryType[];
}) {
  const { setDocumentGroups, documentGroups } = useHeizkostenabrechnungStore();

  const toHeizkostenabrechnungCostType = (
    doc: DocCostCategoryType
  ): HeizkostenabrechnungCostType => {
    return {
      ...doc,
      data: []
    };
  }

  useEffect(() => {
    const mergedByType = new Map<string, HeizkostenabrechnungCostType>();

    userDocCostCategories.forEach((doc) => {
      if (doc.type) {
        mergedByType.set(doc.type, toHeizkostenabrechnungCostType(doc));
      }
    });

    basicDocCosyCategories.forEach((doc) => {
      if (doc.type && !mergedByType.has(doc.type)) {
        mergedByType.set(doc.type, toHeizkostenabrechnungCostType(doc));
      }
    });

    setDocumentGroups(Array.from(mergedByType.values()));
  }, [userDocCostCategories, basicDocCosyCategories, setDocumentGroups]);

  const totalAmount = documentGroups.reduce((acc, group) => {
    const groupTotal =
      group.data?.reduce(
        (sum, item) => sum + Number(item.total_amount || 0),
        0
      ) || 0;
    return acc + groupTotal;
  }, 0);

  return (
    <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] col-span-2 rounded-2xl px-4 flex items-start justify-center">
      <div className="bg-white py-16 pb-4 px-[18px] overflow-y-auto rounded w-full shadow-sm space-y-8">
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
          <span>{totalAmount} €</span>
        </div>
        <h2 className="font-bold text-admin_dark_text">Kostenarten</h2>
        <CostTypesAccordion localId={localId} objektId={objektId} />
        <div className="flex items-center justify-between">
          <Link
            href={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/${localId}/abrechnungszeitraum`}
            className="py-2 px-6 rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300">
            Zurück
          </Link>
          <Link
            href={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/${localId}/umlageschlussel`}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none shrink-0 outline-none cursor-pointer bg-green text-dark_text shadow-xs hover:bg-green/80 px-7 py-4">
            Weiter
          </Link>
        </div>
      </div>
    </div>
  );
}
