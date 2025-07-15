"use client";

import CostTypeBuildingSelectItem from "./CostTypeBuildingSelectItem";
import { type BetriebskostenabrechnungCostType } from "@/store/useBetriebskostenabrechnungStore";

export default function CostTypesBuildingSelects({
  objektId,
  documentGroups
}: {
  objektId: string;
  documentGroups: BetriebskostenabrechnungCostType[];
}) {
  return (
    <div className="overflow-y-auto space-y-4">
      {documentGroups?.map((type) => (
        <CostTypeBuildingSelectItem
          key={type.type}
          type={type}
          objektId={objektId}
        />
      ))}
    </div>
  );
}
