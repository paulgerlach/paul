"use client";

import CostTypeSelectItem from "./CostTypeSelectItem";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";

export default function CostTypesSelects() {
  const { documentGroups } = useHeizkostenabrechnungStore();

  return (
    <div className="overflow-y-auto space-y-4">
      {documentGroups?.map((type) => (
        <CostTypeSelectItem key={type.type} type={type} />
      ))}
    </div>
  );
}
