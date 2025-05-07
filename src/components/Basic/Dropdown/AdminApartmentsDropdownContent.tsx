"use client";

import { useState } from "react";
import AdminApartmentsDropdownContentItem from "./AdminApartmentsDropdownContentItem";

export type LocalType = {
  type: "commersial" | "private";
  name: string;
};

export type ApartmentType = {
  street: string;
  locals: LocalType[];
};

const apartments: ApartmentType[] = [
  {
    street: "Schmelzhütten Str. 39",
    locals: [
      {
        name: "EG HH",
        type: "commersial",
      },
      {
        name: "1 OG VH links",
        type: "private",
      },
      {
        name: "1 OG VH rechts",
        type: "private",
      },
      {
        name: "2 OG VH",
        type: "private",
      },
    ],
  },
  {
    street: "Tucholsky Str. 43",
    locals: [
      {
        name: "EG HH",
        type: "commersial",
      },
      {
        name: "1 OG VH links",
        type: "private",
      },
      {
        name: "1 OG VH rechts",
        type: "private",
      },
      {
        name: "2 OG VH",
        type: "private",
      },
    ],
  },
  {
    street: "Plauensche Str. 114",
    locals: [
      {
        name: "EG HH",
        type: "commersial",
      },
      {
        name: "1 OG VH links",
        type: "private",
      },
      {
        name: "1 OG VH rechts",
        type: "private",
      },
      {
        name: "2 OG VH",
        type: "private",
      },
    ],
  },
];

export default function AdminApartmentsDropdownContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApartments = apartments.filter((app) =>
    app.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="absolute w-full bg-white rounded-base shadow-sm px-2.5 py-4 left-0 top-[110%] space-y-3">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="rounded-md w-full border border-dark_green/10 py-1 px-6 text-sm placeholder:text-sm"
        placeholder="Objekt suchen"
        type="text"
      />
      <div className="space-y-3 px-4">
        {filteredApartments.length === 0 ? (
          <div className="text-sm text-gray-500">Keine Ergebnisse gefunden</div>
        ) : (
          apartments.map((app, index) => (
            <AdminApartmentsDropdownContentItem
              isOpen={openIndex === index}
              onClick={handleClick}
              index={index}
              key={app.street}
              item={app}
            />
          ))
        )}
      </div>
      <div className="flex items-center px-5 justify-between">
        <span className="text-xs text-black/50">Alle auswählen</span>
        <span className="text-xs text-black/50">Auswahl entfernen</span>
      </div>
    </div>
  );
}
