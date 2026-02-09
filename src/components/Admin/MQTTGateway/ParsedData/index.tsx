'use client'

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function ParsedData() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const {
    data: parsedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["parsed-data"],
    queryFn: async () => {
      const response = await fetch("/api/mqtt-gateway/parsed-data");
      if (!response.ok) {
        throw new Error("Failed to fetch parsed data");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="border rounded-lg bg-white">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="font-semibold text-lg">Parsed Data</h2>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isCollapsed ? 'rotate-0' : 'rotate-180'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="py-4 text-gray-500">
              Loading parsed data...
            </div>
          ) : error ? (
            <div className="py-4 text-red-500">
              Error loading data: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          ) : !parsedData || parsedData.length === 0 ? (
            <div className="py-4 text-gray-500">
              No parsed data found.
            </div>
          ) : (
            <div className="space-y-2">
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm">
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
