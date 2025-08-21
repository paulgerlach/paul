import Link from "next/link";
import { ROUTE_ADMIN, ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import { DocCostCategoryType } from "@/types";
import AdminCostTypesBuildingSelects from "@/components/Admin/Docs/CostTypes/Admin/AdminCostTypesBuildingSelects";
import AdminSaveCostButton from "../../Common/AdminSaveCostButton";

export default function AdminUmlageschlüsselBuildingForm({
  objektId,
  userId,
  operatingDocId,
  initialDocumentGroups,
  isEditMode,
}: {
  objektId: string;
  userId: string;
  operatingDocId: string;
  initialDocumentGroups: DocCostCategoryType[];
  isEditMode?: boolean;
}) {
  const backLink = isEditMode
    ? `${ROUTE_ADMIN}/${userId}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${operatingDocId}/gesamtkosten`
    : `${ROUTE_ADMIN}/${userId}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objektId}/${operatingDocId}/gesamtkosten`;

  return (
    <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] overflow-y-auto col-span-2 rounded-2xl px-4 flex items-start justify-center">
      <div className="bg-white py-4 px-[18px] rounded w-full shadow-sm space-y-8">
        <AdminCostTypesBuildingSelects />
        <div className="flex items-center justify-between">
          <Link
            aria-label="Zurück zu Gesamtkosten"
            href={backLink}
            className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300"
          >
            Zurück
          </Link>
          <AdminSaveCostButton
            objektId={objektId}
            userId={objektId}
            initialDocumentGroups={initialDocumentGroups}
            documentType="betriebskostenabrechnung"
            operatingDocId={operatingDocId}
          />
        </div>
      </div>
    </div>
  );
}
