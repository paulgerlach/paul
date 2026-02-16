"use client";

/**
 * TenantSelector - Custom dropdown to select a tenant from a building
 * 
 * Uses Headless UI Listbox for consistent styling with Heidi design.
 * Shows tenant name, apartment, and status.
 * Disables tenants without email.
 */

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

export interface Tenant {
  contractor_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  apartment: string;
  local_id: string;
  contract_id: string;
  status: "not_invited" | "invited" | "active" | "disabled";
  invite_sent_at?: string;
  last_login_at?: string;
  tenant_login_id?: string | null;
}

interface TenantSelectorProps {
  tenants: Tenant[];
  value: string | null;
  onChange: (contractorId: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function TenantSelector({ 
  tenants, 
  value, 
  onChange, 
  disabled,
  loading 
}: TenantSelectorProps) {
  const selectedTenant = tenants.find(t => t.contractor_id === value);

  // Helper to get status badge
  const getStatusBadge = (tenant: Tenant) => {
    if (!tenant.email) {
      return <span className="ml-2 text-xs text-gray-400">Keine Email</span>;
    }
    switch (tenant.status) {
      case "active":
        return <span className="ml-2 text-xs text-green bg-green/10 px-1.5 py-0.5 rounded">Aktiv</span>;
      case "invited":
        return <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Eingeladen</span>;
      case "disabled":
        return <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Deaktiviert</span>;
      default:
        return null;
    }
  };

  // Helper to check if tenant should be disabled in dropdown
  const isTenantDisabled = (tenant: Tenant): boolean => {
    return !tenant.email;
  };

  // Display text for button
  const getDisplayText = () => {
    if (loading) return "Lädt...";
    if (disabled) return "Erst Gebäude auswählen";
    if (selectedTenant) {
      return `${selectedTenant.first_name} ${selectedTenant.last_name} (${selectedTenant.apartment})`;
    }
    return "Bitte auswählen...";
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[#757575] text-sm block">
        Mieter auswählen
      </label>
      <Listbox value={value || ""} onChange={onChange} disabled={disabled || loading}>
        <div className="relative">
          <ListboxButton
            className="grid w-full cursor-default grid-cols-1 bg-white text-left text-admin_dark_text focus:outline-2 focus:outline-green text-sm px-3 border border-black/20 rounded-md h-12 items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`truncate pr-6 ${!selectedTenant ? 'text-gray-400' : ''}`}>
              {getDisplayText()}
            </span>
            <ChevronDownIcon
              className="absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-500"
              aria-hidden="true"
            />
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5">
            {tenants.length === 0 ? (
              <div className="py-2 px-3 text-gray-500 text-sm">
                Keine Mieter für dieses Gebäude gefunden.
              </div>
            ) : (
              tenants.map((tenant) => (
                <ListboxOption
                  key={tenant.contractor_id}
                  value={tenant.contractor_id}
                  disabled={isTenantDisabled(tenant)}
                  className="group relative select-none py-2.5 pl-3 pr-9 text-admin_dark_text cursor-pointer data-[focus]:bg-green/10 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                      {tenant.first_name} {tenant.last_name} ({tenant.apartment})
                    </span>
                    {getStatusBadge(tenant)}
                  </div>

                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-green group-[&:not([data-selected])]:hidden">
                    <CheckIcon className="size-5" aria-hidden="true" />
                  </span>
                </ListboxOption>
              ))
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}

export default TenantSelector;
