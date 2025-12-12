import Link from "next/link";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import type { DocCostCategoryType } from "@/types";
import SaveLocalCostButton from "../Common/SaveCostButton";
import CostTypesSelects from "@/components/Admin/Docs/CostTypes/CostTypesSelects";

export default function UmlageschlüsselLocalForm({
  objektId,
  localId,
  docId,
  initialDocumentGroups,
  isEditMode,
}: {
  objektId: string;
  localId: string;
  docId: string;
  initialDocumentGroups: DocCostCategoryType[];
  isEditMode?: boolean;
}) {
  const backLink = isEditMode
    ? `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${docId}/gesamtkosten`
    : `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektId}/${localId}/${docId}/gesamtkosten`;

  return (
    <div className="bg-[#EFEEEC] border-y-[20px] max-medium:border-y-[10px] border-[#EFEEEC] overflow-y-auto col-span-2 max-medium:col-span-1 rounded-2xl max-medium:rounded-xl px-4 max-medium:px-2 flex items-start justify-center">
      <div className="bg-white py-4 max-medium:py-3 px-[18px] max-medium:px-3 rounded w-full shadow-sm space-y-8 max-medium:space-y-4">
        <CostTypesSelects />
        <div className="flex items-center justify-between mt-6 max-medium:mt-4">
          <Link
            href={backLink}
            className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm max-medium:px-3 max-medium:py-2 max-medium:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300"
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
