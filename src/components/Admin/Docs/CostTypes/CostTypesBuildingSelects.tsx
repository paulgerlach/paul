"use client";

import CostTypeBuildingSelectItem from "./CostTypeBuildingSelectItem";
import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";

export default function CostTypesBuildingSelects() {
  const { documentGroups } = useBetriebskostenabrechnungStore();

  return (
    <div className="overflow-y-auto space-y-4">
      {documentGroups?.map((type) => (
        <CostTypeBuildingSelectItem key={type.type} type={type} />
      ))}
    </div>
  );
}
