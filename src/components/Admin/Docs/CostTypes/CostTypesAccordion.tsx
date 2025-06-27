"use client";

import { useState } from "react";
import CostTypeItem from "./CostTypeItem";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import Image from "next/image";
import { cost_type_fuel_costs } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";

export default function CostTypesAccordion({
  objektId,
  localId,
}: {
  objektId: string;
  localId: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { documentGroups } = useHeizkostenabrechnungStore();
  const { openDialog } = useDialogStore();

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {documentGroups?.map((type, index) => (
        <CostTypeItem
          isOpen={openIndex === index}
          onClick={handleClick}
          key={type.type}
          type={type}
          index={index}
          localId={localId}
          objektId={objektId}
        />
      ))}
      <button
        onClick={() => openDialog("cost_type_heizkostenabrechnung_create")}
        className="border-dashed w-full cursor-pointer flex p-5 flex-col items-center justify-center text-xl text-dark_green/50 border border-dark_green rounded-2xl">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-7 opacity-50 max-h-7"
          src={cost_type_fuel_costs}
          alt="objekte"
        />
        Weiteres cost type
      </button>
    </div>
  );
}
