"use client";

import CostTypeBuildingSelectItem from "./CostTypeBuildingSelectItem";
import {
  useBetriebskostenabrechnungStore,
  type BetriebskostenabrechnungCostType,
} from "@/store/useBetriebskostenabrechnungStore";

export default function CostTypesBuildingSelects({
  objektId,
}: {
  objektId: string;
}) {
  const { documentGroups } = useBetriebskostenabrechnungStore();

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
