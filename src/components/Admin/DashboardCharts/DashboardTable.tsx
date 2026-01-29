"use client";

import { useMemo } from "react";
import { MeterReadingType } from "@/api";

interface DashboardTableProps {
  data: MeterReadingType[];
}

const HEADER_TRANSLATIONS: Record<string, string> = {
  "ID": "Zählernummer",
  "Number Meter": "Zählernummer",
  "Manufacturer": "Hersteller",
  "Device Type": "Gerätetyp",
  "Status": "Status",
  "RSSI Value": "Signal (RSSI)",
  "Access Number": "Zugriff #",
  "Actual Date": "Datum",
  "Raw Date": "Datum (Roh)",
  "IV,0,0,0,,Date/Time": "Zeitstempel",
  "Actual Volume": "Volumen",
  "Actual Energy / HCA": "Verbrauch/HCA",
  "Actual Unit": "Einheit",
  "Unit": "Einheit",
  "Version": "Vers.",
  "Frame Type": "Protokoll",
  "Encryption": "Verschl.",
  "TPL-Config": "Konfiguration",
};

export default function DashboardTable({ data }: DashboardTableProps) {
  const humanizeHeader = (key: string) => HEADER_TRANSLATIONS[key] || key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim();

  // Dynamically determine headers from all available data keys
  const allHeaders = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Collect all unique keys from all items to ensure no data is missed
    const keys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        // Filter out internal/empty keys if necessary, but here we want "all data"
        if (typeof (item as any)[key] !== 'object' || (item as any)[key] === null) {
            keys.add(key);
        }
      });
    });
    
    // Sort keys to have a consistent order: ID first, then the rest
    const sortedKeys = Array.from(keys).sort((a, b) => {
        if (a === 'ID' || a === 'Number Meter') return -1;
        if (b === 'ID' || b === 'Number Meter') return 1;
        return a.localeCompare(b);
    });

    return sortedKeys;
  }, [data]);

  return (
    <div className="flex flex-col h-full w-full bg-white text-[#333] font-sans overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
      {/* DATA ONLY VIEW */}
      <div className="flex-1 overflow-auto p-0">
        <table className="min-w-full border-separate border-spacing-0 text-[11px]">
          <thead className="bg-[#4a5568] text-white sticky top-0 z-10 font-normal">
            <tr>
              {allHeaders.map((header) => (
                <Th key={header}>{humanizeHeader(header)}</Th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr key={idx} className={`${isEven ? 'bg-white' : 'bg-[#f7fafc]'} hover:bg-[#edf2f7] transition-colors group`}>
                  {allHeaders.map((header) => (
                    <Td key={`${idx}-${header}`}>
                      {String((item as any)[header] ?? "")}
                    </Td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="bg-white p-10 text-center text-sm text-gray-500 font-light italic">
            Keine Rohdaten für diesen Filter verfügbar.
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <th className={`text-left px-2 py-5 border-r border-[#cbd5e0] uppercase text-[9px] tracking-tighter whitespace-nowrap font-normal ${className}`}>
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
