import Link from "next/link";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import { Button } from "@/components/Basic/ui/Button";
import CostTypesBuildingSelects from "../../Docs/CostTypes/CostTypesBuildingSelects";

export default function UmlageschlüsselBuildingFrom({
  objektId,
}: {
  objektId: string;
}) {
  return (
    <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] max-h-[90%] overflow-y-auto col-span-2 rounded-2xl px-4 flex items-start justify-center">
      <div className="bg-white py-4 px-[18px] rounded w-full shadow-sm space-y-8">
        <CostTypesBuildingSelects objektId={objektId} />
        <div className="flex items-center justify-between">
          <Link
            href={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objektId}/gesamtkosten`}
            className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300">
            Zurück
          </Link>
          <Button>Weiter</Button>
        </div>
      </div>
    </div>
  );
}
