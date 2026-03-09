"use client";

import type { ObjektType } from "@/types";
import { useState } from "react";
import AdminHeatObjekteItemDocWithHistory from "../../ObjekteItem/Admin/AdminHeatObjekteItemDocWithHistory";

export default function AdminHeatObjekteItemDocAccordion({
  objekts,
}: {
  objekts?: ObjektType[];
}) {
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set());

  const handleClick = (index: number) => {
    const objekt = objekts?.[index];
    if (!objekt || !objekt.id) return;
    setClosedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(objekt.id as string)) {
        newSet.delete(objekt.id as string);
      } else {
        newSet.add(objekt.id as string);
      }
      return newSet;
    });
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {objekts?.map((objekt, index) => (
        <AdminHeatObjekteItemDocWithHistory
          isOpen={!closedIds.has(objekt.id as string)}
          onClick={handleClick}
          key={objekt.id}
          index={index}
          item={objekt}
        />
      ))}
    </div>
  );
}
