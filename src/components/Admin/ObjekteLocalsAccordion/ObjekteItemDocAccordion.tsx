"use client";

import type { ObjektType } from "@/types";
import { useState, useMemo } from "react";
import ObjekteItemDocWithHistory from "../ObjekteItem/ObjekteItemDocWithHistory";

export default function ObjekteItemDocAccordion({
  objekts,
}: {
  objekts?: ObjektType[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Filter and sort objekts
  const filteredAndSortedObjekts = useMemo(() => {
    if (!objekts) return [];
    
    let result = [...objekts];

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter((objekt) =>
        objekt.street?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort alphabetically
    result.sort((a, b) => {
      const nameA = a.street?.toLowerCase() || "";
      const nameB = b.street?.toLowerCase() || "";
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    return result;
  }, [objekts, searchQuery, sortOrder]);

  return (
    <div className="space-y-4 max-medium:space-y-3">
      {/* Search and Sort Controls */}
      <div className="bg-white rounded-2xl max-medium:rounded-xl p-4 max-medium:p-3 flex items-center gap-4 max-medium:gap-2 flex-wrap">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px] max-medium:min-w-full max-medium:order-1">
          <input
            type="text"
            placeholder="Objekt suchen..."
            className="w-full px-4 py-2 max-medium:px-3 max-medium:py-2 max-medium:text-sm border border-dark_green/20 rounded-md text-dark_green placeholder:text-dark_green/50 focus:outline-none focus:border-green transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Sort Toggle Button */}
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="px-4 py-2 max-medium:px-3 max-medium:py-1.5 bg-green text-white rounded-md hover:bg-green/90 transition-all duration-300 flex items-center gap-2 max-medium:order-2"
          title={
            sortOrder === "asc" ? "Sortierung: A → Z" : "Sortierung: Z → A"
          }
        >
          <span className="text-sm font-medium whitespace-nowrap">
            {sortOrder === "asc" ? "A → Z" : "Z → A"}
          </span>
        </button>

        {/* Results Count */}
        <div className="text-sm max-medium:text-xs text-dark_green/70 max-medium:order-3">
          {filteredAndSortedObjekts.length} von {objekts?.length || 0} Ergebnissen
        </div>
      </div>

      {/* Results List */}
      <div className="overflow-y-auto space-y-4 max-medium:space-y-3">
        {filteredAndSortedObjekts.length === 0 ? (
          <div className="bg-white rounded-2xl max-medium:rounded-xl p-8 max-medium:p-4 text-center">
            <p className="text-dark_green/50 text-lg max-medium:text-base">
              Keine Ergebnisse gefunden
            </p>
            <p className="text-dark_green/30 text-sm max-medium:text-xs mt-2">
              Versuchen Sie einen anderen Suchbegriff
            </p>
          </div>
        ) : (
          filteredAndSortedObjekts.map((objekt, index) => (
            <ObjekteItemDocWithHistory
              isOpen={openIndex === index}
              onClick={handleClick}
              key={objekt.id}
              index={index}
              item={objekt}
            />
          ))
        )}
      </div>
    </div>
  );
}
