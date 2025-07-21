import Link from "next/link";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import CostTypesSelects from "../../Docs/CostTypes/CostTypesSelects";
import type { DocCostCategoryType } from "@/types";
import SaveLocalCostButton from "./SaveLocalCostButton";

export default function UmlageschlüsselFrom({
  objektId,
  localId,
  docId,
  initialDocumentGroups,
}: {
  objektId: string;
  localId: string;
  docId: string;
  initialDocumentGroups: DocCostCategoryType[];
}) {
  return (
    <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] overflow-y-auto col-span-2 rounded-2xl px-4 flex items-start justify-center">
      <div className="bg-white py-4 px-[18px] rounded w-full shadow-sm space-y-8">
        <CostTypesSelects localId={localId} objektId={objektId} />
        <div className="flex items-center justify-between">
          <Link
            href={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/${localId}/${docId}/gesamtkosten`}
            className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300"
          >
            Zurück
          </Link>
          <SaveLocalCostButton
            objektId={objektId}
            initialDocumentGroups={initialDocumentGroups}
            documentType="heizkostenabrechnung"
            operatingDocId={docId}
            localId={localId}
          />
        </div>
      </div>
    </div>
  );
}
