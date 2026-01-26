import { FirmwareVersion } from '@/types';
import React from 'react';
import FirmwareList from '../FirmwareList';
import { useQuery } from '@tanstack/react-query';

interface FirmwareProps{
  
}

export default function Firmware({}: FirmwareProps) {
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
  return (
    <div className='bg-white p-2 rounded-md'>
      <h2>Firmware Versions</h2>
      {firmwareVersions?.map((version: FirmwareVersion) => (
        <div key={version.id}>
          <p>Version: {version.version}</p>
          <p>Type: {version.filename}</p>
          {/* Add other fields based on your API response */}
        </div>
      ))}

      <FirmwareList
        firmwareVersions={firmwareVersions}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
