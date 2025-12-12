import Link from "next/link";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import { DocCostCategoryType } from "@/types";
import CostTypesBuildingSelects from "@/components/Admin/Docs/CostTypes/CostTypesBuildingSelects";
import SaveCostButton from "../Common/SaveCostButton";

export default function UmlageschlüsselBuildingForm({
  objektId,
  operatingDocId,
  initialDocumentGroups,
  isEditMode,
}: {
  objektId: string;
  operatingDocId: string;
  initialDocumentGroups: DocCostCategoryType[];
  isEditMode?: boolean;
}) {
  const backLink = isEditMode
    ? `${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${operatingDocId}/gesamtkosten`
    : `${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objektId}/${operatingDocId}/gesamtkosten`;

  return (
    <div className="bg-[#EFEEEC] border-y-[20px] max-medium:border-y-[10px] border-[#EFEEEC] overflow-y-auto col-span-2 max-medium:col-span-1 rounded-2xl max-medium:rounded-xl px-4 max-medium:px-2 flex items-start justify-center">
      <div className="bg-white py-4 max-medium:py-3 px-[18px] max-medium:px-3 rounded w-full shadow-sm space-y-8 max-medium:space-y-4">
        <CostTypesBuildingSelects />
        <div className="flex items-center justify-between mt-6 max-medium:mt-4">
          <Link
            aria-label="Zurück zu Gesamtkosten"
            href={backLink}
            className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm max-medium:px-3 max-medium:py-2 max-medium:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300"
          >
            Zurück
          </Link>
          <SaveCostButton
            objektId={objektId}
            initialDocumentGroups={initialDocumentGroups}
            documentType="betriebskostenabrechnung"
            operatingDocId={operatingDocId}
          />
        </div>
      </div>
    </div>
  );
}
