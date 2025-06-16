"use client";

import CostTypeBuildingSelectItem from "./CostTypeBuildingSelectItem";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";

export default function CostTypesBuildingSelects({
  objektId,
}: {
  objektId: string;
}) {
  const { documentGroups } = useHeizkostenabrechnungStore();

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
