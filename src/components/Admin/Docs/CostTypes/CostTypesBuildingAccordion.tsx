"use client";

import { useState } from "react";
import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";
import CostTypeBuildingItem from "./CostTypeBuildingItem";
import AddCostTypeButton from "./AddCostTypeButton";

export default function CostTypesBuildingAccordion({
  objektId,
}: {
  objektId: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { documentGroups } = useBetriebskostenabrechnungStore();

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {documentGroups?.map((type, index) => (
        <CostTypeBuildingItem
          isOpen={openIndex === index}
          onClick={handleClick}
          key={type.type}
          type={type}
          index={index}
          objektId={objektId}
        />
      ))}
      <AddCostTypeButton dialogType="cost_type_betriebskostenabrechnung_create" />
    </div>
  );
}
