"use client";

/**
 * BuildingSelector - Dropdown to select a building
 * 
 * Used in ShareDashboardDialog for tenant invite flow.
 * NEW COMPONENT - Does not modify any existing code.
 */

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
  return (
    <div className="space-y-1.5">
      <label className="text-[#757575] text-sm block">
        Gebäude auswählen
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || disabled}
        className="w-full p-3 pr-10 border border-black/20 rounded text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.75rem_center] bg-[length:1rem]"
      >
        <option value="">
          {loading ? "Lädt..." : "Bitte auswählen..."}
        </option>
        {buildings.map((building) => (
          <option key={building.id} value={building.id}>
            {building.street}, {building.zip} {building.city || ""}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BuildingSelector;
