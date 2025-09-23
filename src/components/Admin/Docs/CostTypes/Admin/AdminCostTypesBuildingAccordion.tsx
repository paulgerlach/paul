"use client";

import { useState } from "react";
import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";
import AddCostTypeButton from "../AddCostTypeButton";
import AdminCostTypeBuildingItem from "./AdminCostTypeBuildingItem";

export default function AdminCostTypesBuildingAccordion({
  objektId,
  operatingDocId,
}: {
  objektId: string;
  operatingDocId: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { documentGroups } = useBetriebskostenabrechnungStore();

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {documentGroups?.map((type, index) => (
        <AdminCostTypeBuildingItem
          isOpen={openIndex === index}
          onClick={handleClick}
          key={type.type}
          type={type}
          index={index}
          objektId={objektId}
          operatingDocId={operatingDocId}
        />
      ))}
      <AddCostTypeButton dialogType="admin_cost_type_betriebskostenabrechnung_create" />
    </div>
  );
}
