"use client";

import type { ObjektType } from "@/types";
import { useState } from "react";
import ObjekteItemDocWithHistory from "../ObjekteItem/ObjekteItemDocWithHistory";

export default function ObjekteItemDocAccordion({
  objekts,
  id,
}: {
  id: string;
  objekts?: ObjektType[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {/* {objekts?.map((objekt, index) => (
        <ObjekteItemDocWithHistory
          objektID={objekt.id}
          isOpen={openIndex === index}
          onClick={handleClick}
          key={objekt.id}
          index={index}
          item={objekt}
        />
      ))} */}
    </div>
  );
}
