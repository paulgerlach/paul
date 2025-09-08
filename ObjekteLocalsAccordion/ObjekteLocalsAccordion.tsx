"use client";

import type { LocalType } from "@/types";
import { useState } from "react";
import ObjekteLocalItem from "../src/components/Admin/ObjekteLocalItem/ObjekteLocalItem";

export default function ObjekteLocalsAccordion({
  locals,
  id,
}: {
  id: string;
  locals?: LocalType[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {locals?.map((local, index) => (
        <ObjekteLocalItem
          id={id}
          localID={local.id}
          isOpen={openIndex === index}
          onClick={handleClick}
          key={local.id}
          index={index}
          item={local}
        />
      ))}
    </div>
  );
}
