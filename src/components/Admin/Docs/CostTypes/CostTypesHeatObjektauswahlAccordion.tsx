"use client";

import { useState } from "react";
import CostTypeItem from "./CostTypeItem";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import AddCostTypeButton from "./AddCostTypeButton";
import CostTypeHeatObjektauswahlItem from "./CostTypeHeatObjektauswahlItem";

export default function CostTypesHeatObjektauswahlAccordion({
  objektId,
  docId,
}: {
  objektId: string;
  docId: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { documentGroups } = useHeizkostenabrechnungStore();

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {documentGroups?.map((type, index) => (
        <CostTypeHeatObjektauswahlItem
          isOpen={openIndex === index}
          onClick={handleClick}
          key={type.type}
          type={type}
          index={index}
          docId={docId}
          objektId={objektId}
        />
      ))}
      <AddCostTypeButton dialogType="cost_type_heizkostenabrechnung_create" />
    </div>
  );
}
