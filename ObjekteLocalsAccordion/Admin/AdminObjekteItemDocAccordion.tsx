"use client";

import type { ObjektType } from "@/types";
import { useState } from "react";
import AdminObjekteItemDocWithHistory from "../../src/components/Admin/ObjekteItem/Admin/AdminObjekteItemDocWithHistory";

export default function AdminObjekteItemDocAccordion({
  objekts,
}: {
  objekts?: ObjektType[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {objekts?.map((objekt, index) => (
        <AdminObjekteItemDocWithHistory
          isOpen={openIndex === index}
          onClick={handleClick}
          key={objekt.id}
          index={index}
          item={objekt}
        />
      ))}
    </div>
  );
}
