import { FirmwareVersion } from '@/types';
import React from 'react';
import FirmwareList from './FirmwareList';
import { useQuery } from '@tanstack/react-query';
import FirmwareUpload from './FirmwareUpload';

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
    <div className='bg-white p-3 rounded-md'>
      <h1 className='text-xl mb-2'>Firmware Versions</h1>
      <FirmwareUpload />
      <FirmwareList
        firmwareVersions={firmwareVersions}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
