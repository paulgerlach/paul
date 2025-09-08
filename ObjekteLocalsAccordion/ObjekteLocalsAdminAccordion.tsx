"use client";

import type { LocalType } from "@/types";
import { useState } from "react";
import ObjekteLocalAdminItem from "../src/components/Admin/ObjekteLocalItem/ObjekteLocalAdminItem";

export default function ObjekteLocalsAdminAccordion({
  locals,
  objektID,
  userID,
}: {
  objektID: string;
  userID: string;
  locals?: LocalType[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {locals?.map((local, index) => (
        <ObjekteLocalAdminItem
          objektID={objektID}
          userID={userID}
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
