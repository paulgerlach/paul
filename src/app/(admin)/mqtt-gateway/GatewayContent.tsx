'use client'

import Breadcrumb from '@/components/Admin/Breadcrumb/Breadcrumb';
import ContentWrapper from '@/components/Admin/ContentWrapper/ContentWrapper';
import { ROUTE_DASHBOARD } from '@/routes/routes';
import { FirmwareVersion } from '@/types';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

export default function GatewayContent() {
  const {
    data: firmwareVersions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["firmware-versions"],
    queryFn: async () => {
      const response = await fetch("/api/mqtt-gateway/firmware-versions");
      if (!response.ok) {
        throw new Error("Failed to fetch firmware versions");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading firmware versions...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={ROUTE_DASHBOARD}
        title="Gateway Management"
      />
      <ContentWrapper className="gap-14 max-medium:gap-6 grid grid-cols-2 max-medium:grid-cols-1">
        <h1>MQTT Gateway Management</h1>
        <h2>Firmware Versions</h2>
        {firmwareVersions?.map((version: FirmwareVersion) => (
          <div key={version.id}>
            <p>Version: {version.version}</p>
            <p>Type: {version.filename}</p>
            {/* Add other fields based on your API response */}
          </div>
        ))}
      </ContentWrapper>
    </div>
  );
}