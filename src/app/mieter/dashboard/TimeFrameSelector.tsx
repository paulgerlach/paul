"use client";

interface TimeFrameSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const timeFrameOptions = [
  { value: "7days", label: "Letzte 7 Tage" },
  { value: "30days", label: "Letzte 30 Tage" },
  { value: "3months", label: "Letzte 3 Monate" },
  { value: "year", label: "Dieses Jahr" },
];

export default function TimeFrameSelector({ value, onChange }: TimeFrameSelectorProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:border-green focus:ring-1 focus:ring-green cursor-pointer text-sm"
      >
        {timeFrameOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
