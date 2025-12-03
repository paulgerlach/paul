"use client";

import CostTypeSelectItem from "./CostTypeSelectItem";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";

export default function CostTypesHeatObjektauswahlSelects() {
  const { documentGroups } = useHeizkostenabrechnungStore();

  return (
    <div className="overflow-y-auto space-y-4">
      {documentGroups?.map((type, index) => (
        <CostTypeSelectItem key={`${type.type}-${index}`} type={type} />
      ))}
    </div>
  );
}
