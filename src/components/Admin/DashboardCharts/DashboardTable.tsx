"use client";

import { useMemo } from "react";
import { MeterReadingType } from "@/api";

interface DashboardTableProps {
  data: MeterReadingType[];
  hierarchy?: Record<string, { building: string, unit: string, tenant: string }>;
}

export default function DashboardTable({ data, hierarchy = {} }: DashboardTableProps) {
  // Define columns for "Consumption Data" view
  const columns = [
    { key: 'building', label: 'Gebäude' },
    { key: 'unit', label: 'Wohnung' },
    { key: 'tenant', label: 'Mieter' },
    { key: 'meter_id', label: 'Zählernummer' },
    { key: 'device_type', label: 'Typ' },
    { key: 'date', label: 'Datum' },
    { key: 'value', label: 'Verbrauch' },
  ];

  const translateType = (type: string) => {
    const map: Record<string, string> = {
      'Heat': 'Heizung',
      'Water': 'Kaltwasser',
      'WWater': 'Warmwasser',
      'Elec': 'Strom',
      'Stromzähler': 'Strom',
      'Kaltwasserzähler': 'Kaltwasser',
      'Warmwasserzähler': 'Warmwasser',
      'WMZ Rücklauf': 'Wärmemengenzähler',
      'Heizkostenverteiler': 'Heizung',
      'Wärmemengenzähler': 'Heizung'
    };
    return map[type] || type;
  };

  const tableData = useMemo(() => {
    // Ensure we have a valid map even if null is passed
    const map = hierarchy || {};
    
    // Normalization helper (strips leading zeros and spaces)
    const normalizeId = (id: string) => String(id || "").trim().replace(/^0+/, '');

    return data.map((item: any) => {
      const rawId = String(item.ID || item["Number Meter"] || "");
      const normalizedRawId = normalizeId(rawId);
      
      // Try to find a match in the hierarchy map
      // Check both raw ID and normalized ID in case the map keys are already normalized
      const matchKey = Object.keys(map).find(key => normalizeId(key) === normalizedRawId) || rawId;
      const meta = map[matchKey] || { building: '-', unit: '-', tenant: '-' };
      
      const date = item["Actual Date"] || item["Raw Date"] || String(item["IV,0,0,0,,Date/Time"] || "").split(" ")[0] || "-";
      
      // Aggressive search for Value
      const value = item["Actual Energy / HCA"] 
                 || item["Actual Volume"] 
                 || item["IV,0,0,0,Wh,E"] 
                 || item["IV,0,0,0,m^3,Vol"] 
                 || item["Actual Energy"]
                 || item["Energy"]
                 || item["Volume"]
                 || item["Messwert"]
                 || item["Billing Value"]
                 || "-";
      
      // Aggressive search for Unit
      const unit = item["Actual Unit"] 
                || item["Actual Unit Volume"] 
                || item.Unit 
                || item.Unity
                || item["Billing Unit"]
                || (item["Device Type"] === "Heat" || item["Device Type"] === "Heizkostenverteiler" ? "Einheiten" : "")
                || "-";

      return {
        building: meta.building,
        unit: meta.unit,
        tenant: meta.tenant,
        meter_id: rawId,
        device_type: translateType(item["Device Type"] || ""),
        date: date,
        value: value,
      };
    });
  }, [data, hierarchy]);

  return (
    <div className="flex flex-col h-full w-full bg-white text-[#333] font-sans overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
      <div className="flex-1 overflow-auto p-0">
        <table className="min-w-full border-separate border-spacing-0 text-[11px]">
          <thead className="bg-dark_green text-white sticky top-0 z-10 font-normal">
            <tr>
              {columns.map((col) => (
                <Th key={col.key}>{col.label}</Th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {tableData.map((row, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr key={idx} className={`${isEven ? 'bg-white' : 'bg-[#f7fafc]'} hover:bg-[#edf2f7] transition-colors group`}>
                  {columns.map((col) => (
                    <Td key={`${idx}-${col.key}`}>
                      {String((row as any)[col.key] ?? "")}
                    </Td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="bg-white p-10 text-center text-sm text-gray-500 font-light italic">
            Keine Verbrauchsdaten für diesen Filter verfügbar.
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <th className={`text-left px-2 py-5 border-r border-[#cbd5e0] uppercase text-[12px] tracking-tight whitespace-nowrap font-semibold ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <td className={`px-2 py-1 border-r border-[#e2e8f0] border-b border-[#e2e8f0] whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px] ${className}`}>
      {children}
    </td>
  );
}
