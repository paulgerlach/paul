import Link from "next/link";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { Button } from "@/components/Basic/ui/Button";
import CostTypesSelects from "../../Docs/CostTypes/CostTypesSelects";

export default function UmlageschlüsselFrom({
  objektId,
  localId,
}: {
  objektId: string;
  localId: string;
}) {
  return (
    <div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] max-h-[90%] overflow-y-auto col-span-2 rounded-2xl px-4 flex items-start justify-center">
      <div className="bg-white py-4 px-[18px] rounded w-full shadow-sm space-y-8">
        <CostTypesSelects localId={localId} objektId={objektId} />
        <div className="flex items-center justify-between">
          <Link
            href={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/${localId}/gesamtkosten`}
            className="py-2 px-6 rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300">
            Zurück
          </Link>
          <Button>Weiter</Button>
        </div>
      </div>
    </div>
  );
}
