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
  onClose?: () => void;
};

export default function AdminApartmentsDropdownContent({
  apartments,
  toggleSelection,
  clearSelection,
  selectAll,
  selectedLocalIds,
  onClose,
}: AdminApartmentsDropdownContentProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApartments = apartments?.filter((apartment) =>
    apartment.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full min-w-[280px] bg-white rounded-base shadow-lg border border-gray-200 px-2.5 py-4 space-y-3 z-10 max-medium:max-h-[50vh] max-medium:overflow-hidden max-medium:flex max-medium:flex-col">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="rounded-md w-full border border-dark_green/10 py-2 px-4 text-sm placeholder:text-sm max-medium:flex-shrink-0"
        placeholder="Objekt suchen"
        type="text"
      />
      <div className="space-y-3 px-2 max-medium:overflow-y-auto max-medium:flex-1">
        {filteredApartments?.length === 0 ? (
          <div className="text-sm text-gray-500 py-2">Keine Ergebnisse gefunden</div>
        ) : (
          filteredApartments?.map((apartment, index) => (
            <AdminApartmentsDropdownContentItem
              isOpen={openIndex === index}
              onClick={handleClick}
              index={index}
              toggleSelection={toggleSelection}
              selectedLocalIds={selectedLocalIds}
              key={apartment.street}
              item={apartment}
            />
          ))
        )}
      </div>
      <div className="flex items-center justify-between max-medium:flex-shrink-0 pt-2 border-t border-gray-100">
        <button
          onClick={() => {
            selectAll();
            onClose?.();
          }}
          className="px-4 py-2 text-xs text-black/50 cursor-pointer border-transparent bg-transparent hover:bg-gray-100 rounded-md"
        >
          Alle auswählen
        </button>
        <button
          onClick={() => {
            clearSelection();
            onClose?.();
          }}
          className="px-4 py-2 text-xs text-black/50 cursor-pointer border-transparent bg-transparent hover:bg-gray-100 rounded-md"
        >
          Auswahl entfernen
        </button>
      </div>
    </div>
  );
}
