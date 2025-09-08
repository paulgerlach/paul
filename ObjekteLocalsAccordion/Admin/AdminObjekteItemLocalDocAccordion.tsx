"use client";

import type { LocalType } from "@/types";
import { useState } from "react";
import AdminObjekteItemLocalDocWithHistory from "../../src/components/Admin/ObjekteLocalItem/Admin/AdminObjekteItemLocalDocWithHistory";

export default function AdminObjekteItemLocalDocAccordion({
  locals,
  objektID,
  userID,
}: {
  locals?: LocalType[];
  objektID: string;
  userID: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {locals?.map((local, index) => (
        <AdminObjekteItemLocalDocWithHistory
          isOpen={openIndex === index}
          objektID={objektID}
          userID={userID}
          onClick={handleClick}
          key={local.id}
          index={index}
          item={local}
        />
      ))}
    </div>
  );
}
