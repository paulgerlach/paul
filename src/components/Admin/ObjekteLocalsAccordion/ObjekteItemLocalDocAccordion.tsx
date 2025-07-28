"use client";

import type { LocalType } from "@/types";
import { useState } from "react";
import ObjekteItemLocalDocWithHistory from "../ObjekteLocalItem/ObjekteItemLocalDocWithHistory";

export default function ObjekteItemLocalDocAccordion({
  locals,
  objektID,
}: {
  locals?: LocalType[];
  objektID: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {locals?.map((local, index) => (
        <ObjekteItemLocalDocWithHistory
          isOpen={openIndex === index}
          objektID={objektID}
          onClick={handleClick}
          key={local.id}
          index={index}
          item={local}
        />
      ))}
    </div>
  );
}
