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
import { useChartStore } from "@/store/useChartStore";
import { LocalType } from "@/types";
import { fetchMeterUUIDs } from "@/utils/meterUtils";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminApartmentsDropdown() {
  const [open, setOpen] = useState(false);
  const [selectedLocalIds, setSelectedLocalIds] = useState<string[]>([]);
  const { user_id } = useParams();
  // Safely extract user_id — never use String(user_id) which converts undefined → "undefined"
  const resolvedUserId = typeof user_id === "string" ? user_id : undefined;
  const { data: apartments, isLoading: isLoadingApartments, error: apartmentsError } = useObjektsWithLocals();
  const { data: usersApartments, isLoading: isLoadingUsersApartments, error: usersApartmentsError } = useUsersObjektsWithLocals(resolvedUserId);
  const { setMeterIds } = useChartStore();

  const isAdmin = !!resolvedUserId;

  const apartmentsToUse = isAdmin ? usersApartments : apartments;
  const isLoading = isAdmin ? isLoadingUsersApartments : isLoadingApartments;
  const error = isAdmin ? usersApartmentsError : apartmentsError;
  
  // Log apartment data status
  console.log('[AdminApartmentsDropdown] Status:', {
    isAdmin,
    isLoading,
    error,
    apartmentsCount: apartmentsToUse?.length || 0,
    selectedCount: selectedLocalIds.length
  });

  const toggleSelection = async (localId?: string) => {
    if (!localId) return;
    
    const newSelectedIds = selectedLocalIds.includes(localId)
      ? selectedLocalIds.filter((id) => id !== localId)
      : [...selectedLocalIds, localId];
      
    setSelectedLocalIds(newSelectedIds);

    // Update meter IDs based on new selection
    if (newSelectedIds.length > 0) {
      const allMeterIds = await fetchMeterUUIDs(newSelectedIds);
      setMeterIds(allMeterIds);
    } else {
      setMeterIds([]);
    }
  };

  const selectAll = async () => {
    if (!apartmentsToUse || apartmentsToUse.length === 0) {
      console.log('[AdminApartmentsDropdown] No apartments available to select');
      setSelectedLocalIds([]);
      setMeterIds([]);
      return;
    }

    const allIds =
      apartmentsToUse?.flatMap((app) =>
        app.locals
          ?.filter((local: LocalType) => local && local.id)
          .map((local: LocalType) => local.id)
      ) || [];

    console.log('[AdminApartmentsDropdown] Selecting all apartments:', allIds.length);
    setSelectedLocalIds(allIds);

    if (allIds.length > 0) {
      const allMeterIds = await fetchMeterUUIDs(allIds);
      console.log('[AdminApartmentsDropdown] Fetched meter IDs:', allMeterIds.length);
      setMeterIds(allMeterIds);
    } else {
      setMeterIds([]);
    }
  };

  useEffect(() => {
    // Only run selectAll when apartments data is loaded and not empty
    if (!isLoading && apartmentsToUse && apartmentsToUse.length > 0) {
      console.log('[AdminApartmentsDropdown] Auto-selecting all apartments on mount');
      selectAll();
    } else if (!isLoading && (!apartmentsToUse || apartmentsToUse.length === 0)) {
      console.log('[AdminApartmentsDropdown] No apartments to auto-select');
      setSelectedLocalIds([]);
      setMeterIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, apartmentsToUse]);

  // Listen for global reset to select all
  useEffect(() => {
    const handler = () => {
      selectAll();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("admin-select-all-apartments", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("admin-select-all-apartments", handler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apartments, usersApartments, apartmentsToUse]);

  const clearSelection = () => {
    setSelectedLocalIds([]);
    setMeterIds([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-controls="admin-apartments-dropdown"
          className="flex w-full items-center gap-2 justify-between bg-transparent border-none cursor-pointer px-2 py-3 h-full"
        >
          <div className="flex items-center justify-start whitespace-nowrap gap-3">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="max-w-4 max-h-4 max-xl:max-w-4 max-xl:max-h-4 w-4 h-4"
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
        className="border-none shadow-none p-0 w-[320px] max-medium:w-[calc(100vw-32px)]"
        align="start"
        sideOffset={8}
      >
        <AdminApartmentsDropdownContent
          selectedLocalIds={selectedLocalIds}
          selectAll={selectAll}
          clearSelection={clearSelection}
          toggleSelection={toggleSelection}
          apartments={apartmentsToUse as ApartmentType[]}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
