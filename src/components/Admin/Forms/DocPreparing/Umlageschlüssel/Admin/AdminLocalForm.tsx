import Link from "next/link";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import type { DocCostCategoryType } from "@/types";
import SaveLocalCostButton from "../../Common/SaveCostButton";
import CostTypesSelects from "@/components/Admin/Docs/CostTypes/CostTypesSelects";
import AdminSaveCostButton from "../../Common/AdminSaveCostButton";

export default function AdminUmlageschlüsselLocalForm({
  objektId,
  localId,
  docId,
  userId,
  initialDocumentGroups,
  isEditMode,
}: {
  objektId: string;
  localId: string;
  docId: string;
  userId: string;
  initialDocumentGroups: DocCostCategoryType[];
  isEditMode?: boolean;
}) {
  const backLink = isEditMode
    ? `${ROUTE_ADMIN}/${userId}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${docId}/gesamtkosten`
    : `${ROUTE_ADMIN}/${userId}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektId}/${localId}/${docId}/gesamtkosten`;

  return (
    <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] overflow-y-auto col-span-2 rounded-2xl px-4 flex items-start justify-center">
      <div className="bg-white py-4 px-[18px] rounded w-full shadow-sm space-y-8">
        <CostTypesSelects />
        <div className="flex items-center justify-between">
          <Link
            href={backLink}
            className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300"
          >
            Zurück
          </Link>
          <AdminSaveCostButton
            objektId={objektId}
            userId={userId}
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
