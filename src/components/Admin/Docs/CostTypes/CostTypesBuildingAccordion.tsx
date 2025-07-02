"use client";

import { useState } from "react";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import CostTypeBuildingItem from "./CostTypeBuildingItem";
import { useDialogStore } from "@/store/useDIalogStore";
import Image from "next/image";
import { cost_type_fuel_costs } from "@/static/icons";

export default function CostTypesBuildingAccordion({
  objektId,
}: {
  objektId: string;
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
        <CostTypeBuildingItem
          isOpen={openIndex === index}
          onClick={handleClick}
          key={type.type}
          type={type}
          index={index}
          objektId={objektId}
        />
      ))}
      <button
        onClick={() => openDialog("cost_type_betriebskostenabrechnung_create")}
        className="border-dashed w-full cursor-pointer flex p-5 flex-col items-center justify-center text-xl text-dark_green/50 border border-dark_green rounded-2xl max-xl:p-3 max-xl:text-sm">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-7 opacity-50 max-h-7 max-xl:max-w-4 max-xl:max-h-4"
          src={cost_type_fuel_costs}
          alt="objekte"
        />
        Weiteres cost type
      </button>
    </div>
  );
}
