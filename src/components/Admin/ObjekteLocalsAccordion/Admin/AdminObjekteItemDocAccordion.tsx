"use client";

import type { ObjektType } from "@/types";
import { useState, useMemo } from "react";
import AdminObjekteItemDocWithHistory from "../../ObjekteItem/Admin/AdminObjekteItemDocWithHistory";

export default function AdminObjekteItemDocAccordion({
  objekts,
}: {
  objekts?: ObjektType[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const filteredAndSortedObjekts = useMemo(() => {
    if (!objekts) return [];

    let filtered = objekts.filter((objekt) =>
      objekt.street.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.street.localeCompare(b.street);
      } else {
        return b.street.localeCompare(a.street);
      }
    });

    return filtered;
  }, [objekts, searchQuery, sortOrder]);

  return (
    <div className="overflow-y-auto space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Objekt suchen"
          className="w-full px-4 py-2 border border-dark_green/20 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="px-4 py-2 bg-green text-white rounded-md whitespace-nowrap"
        >
          {sortOrder === "asc" ? "A → Z" : "Z → A"}
        </button>
      </div>
      {filteredAndSortedObjekts.length === 0 ? (
        <p className="text-center text-dark_green/50">Keine Ergebnisse gefunden</p>
      ) : (
        <>
          <p className="text-sm text-dark_green/70">
            {filteredAndSortedObjekts.length} von {objekts?.length || 0} Ergebnissen
          </p>
          {filteredAndSortedObjekts.map((objekt, index) => (
            <AdminObjekteItemDocWithHistory
              isOpen={openIndex === index}
              onClick={handleClick}
              key={objekt.id}
              index={index}
              item={objekt}
            />
          ))}
        </>
      )}
    </div>
  );
}
