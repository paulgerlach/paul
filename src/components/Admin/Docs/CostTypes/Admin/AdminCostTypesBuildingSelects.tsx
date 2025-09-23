"use client";

import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";
import AdminCostTypeBuildingSelectItem from "./AdminCostTypeBuildingSelectItem";

export default function AdminCostTypesBuildingSelects() {
  const { documentGroups } = useBetriebskostenabrechnungStore();

  return (
    <div className="overflow-y-auto space-y-4">
      {documentGroups?.map((type) => (
        <AdminCostTypeBuildingSelectItem key={type.type} type={type} />
      ))}
    </div>
  );
}
