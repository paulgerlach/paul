"use client";

import { useState } from "react";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import AddCostTypeButton from "../AddCostTypeButton";
import AdminCostTypeItem from "./AdminCostTypeItem";

export default function AdminCostTypesAccordion({
  objektId,
  localId,
  docId,
}: {
  objektId: string;
  localId: string;
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
        <AdminCostTypeItem
          isOpen={openIndex === index}
          onClick={handleClick}
          key={type.type}
          type={type}
          index={index}
          localId={localId}
          docId={docId}
          objektId={objektId}
        />
      ))}
      <AddCostTypeButton dialogType="admin_cost_type_heizkostenabrechnung_create" />
    </div>
  );
}
