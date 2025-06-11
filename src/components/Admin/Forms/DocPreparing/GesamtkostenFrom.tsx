"use client";

import { admin_form_info } from "@/static/icons";
import Image from "next/image";
import CostTypesAccordion from "../../Docs/CostTypes/CostTypesAccordion";

export default function GesamtkostenForm({
  objektId,
  localId,
}: {
  objektId: string;
  localId: string;
}) {
  return (
    <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] max-h-[75%] overflow-y-auto col-span-2 rounded-2xl px-4 flex items-start justify-center">
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
          <span>0,00 €</span>
        </div>
        <h2 className="font-bold text-admin_dark_text">Kostenarten</h2>
        <CostTypesAccordion />
      </div>
    </div>
  );
}
