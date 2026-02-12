"use client";

/**
 * TenantSelector - Dropdown to select a tenant from a building
 * 
 * Shows tenant name, apartment, and status.
 * Disables tenants without email or already active.
 * NEW COMPONENT - Does not modify any existing code.
 */

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
  // Helper to get status label
  const getStatusLabel = (tenant: Tenant): string => {
    if (!tenant.email) return " - Keine Email";
    switch (tenant.status) {
      case "active":
        return " ✓ Aktiv";
      case "invited":
        return " ◐ Eingeladen";
      case "disabled":
        return " ○ Deaktiviert";
      default:
        return "";
    }
  };

  // Helper to check if tenant should be disabled in dropdown
  // Only disable if no email - allow selection of active/invited for status viewing
  const isTenantDisabled = (tenant: Tenant): boolean => {
    return !tenant.email;
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[#757575] text-sm block">
        Mieter auswählen
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className="w-full p-3 pr-10 border border-black/20 rounded text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.75rem_center] bg-[length:1rem]"
      >
        <option value="">
          {loading ? "Lädt..." : disabled ? "Erst Gebäude auswählen" : "Bitte auswählen..."}
        </option>
        {tenants.map((tenant) => (
          <option 
            key={tenant.contractor_id} 
            value={tenant.contractor_id}
            disabled={isTenantDisabled(tenant)}
          >
            {tenant.first_name} {tenant.last_name} ({tenant.apartment})
            {getStatusLabel(tenant)}
          </option>
        ))}
      </select>
      {tenants.length === 0 && !loading && !disabled && (
        <p className="text-xs text-gray-500">
          Keine Mieter für dieses Gebäude gefunden.
        </p>
      )}
    </div>
  );
}

export default TenantSelector;
