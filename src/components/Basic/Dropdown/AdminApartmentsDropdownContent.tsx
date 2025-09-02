"use client";

import { useState } from "react";
import AdminApartmentsDropdownContentItem from "./AdminApartmentsDropdownContentItem";
import { LocalType, ObjektType } from "@/types";

export type ApartmentType = ObjektType & {
  locals: LocalType[];
};

export type AdminApartmentsDropdownContentProps = {
  apartments: ApartmentType[];
  toggleSelection: (localId?: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  selectedLocalIds: string[];
};

export default function AdminApartmentsDropdownContent({
  apartments,
  toggleSelection,
  clearSelection,
  selectAll,
  selectedLocalIds,
}: AdminApartmentsDropdownContentProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApartments = apartments?.filter((app) =>
    app.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full bg-white rounded-base shadow-sm px-2.5 py-4 space-y-3 z-10">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="rounded-md w-full border border-dark_green/10 py-1 px-6 text-sm placeholder:text-sm"
        placeholder="Objekt suchen"
        type="text"
      />
      <div className="space-y-3 px-4">
        {filteredApartments?.length === 0 ? (
          <div className="text-sm text-gray-500">Keine Ergebnisse gefunden</div>
        ) : (
          filteredApartments?.map((app, index) => (
            <AdminApartmentsDropdownContentItem
              isOpen={openIndex === index}
              onClick={handleClick}
              index={index}
              toggleSelection={toggleSelection}
              selectedLocalIds={selectedLocalIds}
              key={app.street}
              item={app}
            />
          ))
        )}
      </div>
      <div className="flex items-center px-5 justify-between">
        <button
          onClick={() => selectAll()}
          className="text-xs text-black/50 cursor-pointer border-transparent bg-transparent"
        >
          Alle auswählen
        </button>
        <button
          onClick={() => clearSelection()}
          className="text-xs text-black/50 cursor-pointer border-transparent bg-transparent"
        >
          Auswahl entfernen
        </button>
      </div>
    </div>
  );
}
