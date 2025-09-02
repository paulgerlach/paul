"use client";

import { useObjektsWithLocals, useUsersObjektsWithLocals } from "@/apiClient";
import AdminApartmentsDropdownContent, {
  ApartmentType,
} from "@/components/Basic/Dropdown/AdminApartmentsDropdownContent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Basic/ui/Popover";
import { chevron_admin, main_portfolio } from "@/static/icons";
import { LocalType } from "@/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminApartmentsDropdown() {
  const [selectedLocalIds, setSelectedLocalIds] = useState<string[]>([]);
  const { user_id } = useParams();
  const { data: apartments } = useObjektsWithLocals();
  const { data: usersApartments } = useUsersObjektsWithLocals(String(user_id));

  const isAdmin = !!user_id;

  const apartmentsToUse = isAdmin ? usersApartments : apartments;

  const toggleSelection = (localId?: string) => {
    if (!localId) return;
    setSelectedLocalIds((prev) =>
      prev.includes(localId)
        ? prev.filter((id) => id !== localId)
        : [...prev, localId]
    );
  };

  const selectAll = () => {
    const allIds =
      apartmentsToUse?.flatMap((app) =>
        app.locals
          ?.filter((local: LocalType) => local && local.id)
          .map((local: LocalType) => local.id)
      ) || [];

    setSelectedLocalIds(allIds);
  };

  useEffect(() => {
    if (apartmentsToUse) {
      selectAll();
    }
  }, [apartmentsToUse]);

  const clearSelection = () => {
    setSelectedLocalIds([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-controls="admin-apartments-dropdown"
          className="flex w-full items-center gap-4 justify-between bg-transparent border-none cursor-pointer px-2 py-3 h-full"
        >
          <div className="flex items-center justify-start whitespace-nowrap gap-3">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="max-w-6 max-h-6 max-xl:max-w-6 max-xl:max-h-6 w-6 h-6"
              loading="lazy"
              alt="main_portfolio"
              src={main_portfolio}
            />
            <div className="flex flex-col items-start justify-center">
              <span className="font-bold text-sm">Mein Portfolio</span>
              <span className="text-xs text-black/50">
                {selectedLocalIds.length} Wohnung ausgewählt
              </span>
            </div>
          </div>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            className="max-w-2 max-h-5 transition-all duration-300 [.open_&]:rotate-180"
            loading="lazy"
            style={{ width: "100%", height: "auto" }}
            alt="chevron_admin"
            src={chevron_admin}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        id="admin-apartments-dropdown"
        className="border-none shadow-none p-0"
      >
        <AdminApartmentsDropdownContent
          selectedLocalIds={selectedLocalIds}
          selectAll={selectAll}
          clearSelection={clearSelection}
          toggleSelection={toggleSelection}
          apartments={apartmentsToUse as ApartmentType[]}
        />
      </PopoverContent>
    </Popover>
  );
}
