"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function TelegramsContent() {
  const {
    data: telegrams,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["telegrams"],
    queryFn: async () => {
      const response = await fetch("/api/mqtt-gateway/telegrams");
      if (!response.ok) {
        throw new Error("Failed to fetch telegrams");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="py-4 text-gray-500">
        Loading telegrams...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-red-500">
        Error loading telegrams: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (!telegrams || telegrams.length === 0) {
    return (
      <div className="py-4 text-gray-500">
        No telegrams found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm">
        {JSON.stringify(telegrams, null, 2)}
      </pre>
    </div>
  );
}
