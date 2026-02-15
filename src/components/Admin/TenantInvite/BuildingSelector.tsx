"use client";

/**
 * BuildingSelector - Custom dropdown to select a building
 * 
 * Uses Headless UI Listbox for consistent styling with Heidi design.
 * Used in ShareDashboardDialog for tenant invite flow.
 */

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

interface Building {
  id: string;
  street: string;
  zip: string;
  city?: string;
}

interface BuildingSelectorProps {
  buildings: Building[];
  value: string | null;
  onChange: (buildingId: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function BuildingSelector({ 
  buildings, 
  value, 
  onChange, 
  loading,
  disabled 
}: BuildingSelectorProps) {
  const selectedBuilding = buildings.find(b => b.id === value);
  const displayText = selectedBuilding 
    ? `${selectedBuilding.street}, ${selectedBuilding.zip} ${selectedBuilding.city || ""}`.trim()
    : (loading ? "Lädt..." : "Bitte auswählen...");

  return (
    <div className="space-y-1.5">
      <label className="text-[#757575] text-sm block">
        Gebäude auswählen
      </label>
      <Listbox value={value || ""} onChange={onChange} disabled={disabled || loading}>
        <div className="relative">
          <ListboxButton
            className="grid w-full cursor-default grid-cols-1 bg-white text-left text-admin_dark_text focus:outline-2 focus:outline-green text-sm px-3 border border-black/20 rounded-md h-12 items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`truncate pr-6 ${!selectedBuilding ? 'text-gray-400' : ''}`}>
              {displayText}
            </span>
            <ChevronDownIcon
              className="absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-500"
              aria-hidden="true"
            />
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5">
            {buildings.map((building) => (
              <ListboxOption
                key={building.id}
                value={building.id}
                className="group relative select-none py-2.5 pl-3 pr-9 text-admin_dark_text cursor-pointer data-[focus]:bg-green/10 data-[focus]:text-admin_dark_text"
              >
                <span className="block truncate font-normal group-data-[selected]:font-semibold">
                  {building.street}, {building.zip} {building.city || ""}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-green group-[&:not([data-selected])]:hidden">
                  <CheckIcon className="size-5" aria-hidden="true" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}

export default BuildingSelector;
