"use client";

import { useEffect, useState } from 'react';
import { useLiveViewStore } from '@/store/useLiveViewStore';
import { useLiveIoTStore } from '@/store/useLiveIoTStore';
import { getDemoConfig } from '@/lib/demo/config';

export default function LiveViewToggle() {
  const { isLiveView, toggleLiveView } = useLiveViewStore();
  const liveDataPoints = useLiveIoTStore(state => state.liveDataPoints);
  const getLatestDeviceStatus = useLiveIoTStore(state => state.getLatestDeviceStatus);
  const [isClient, setIsClient] = useState(false);
  const { isDemo } = getDemoConfig();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't show if not in demo mode or not client-side yet
  if (!isDemo || !isClient) return null;

  // Check if any device is currently active (pump, wwater, or heat)
  const latestPumpStatus = getLatestDeviceStatus('pump');
  const latestWaterStatus = getLatestDeviceStatus('wwater');
  const latestHeatStatus = getLatestDeviceStatus('heat');
  
  const isPumpOn = latestPumpStatus?.status === 'on';
  const isWaterOn = latestWaterStatus?.status === 'on';
  const isHeatOn = latestHeatStatus?.status === 'on';
  const isAnyDeviceOn = isPumpOn || isWaterOn || isHeatOn;
  
  const isPumpOff = latestPumpStatus?.status === 'off';
  const isWaterOff = latestWaterStatus?.status === 'off';
  const isHeatOff = latestHeatStatus?.status === 'off';
  const hasAnyDeviceOff = isPumpOff || isWaterOff || isHeatOff;
  
  const hasLiveData = latestPumpStatus !== undefined || latestWaterStatus !== undefined || latestHeatStatus !== undefined;

  // Always show toggle in demo mode, regardless of live data
  // if (!hasLiveData) return null;

  return (
    <button
      onClick={toggleLiveView}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
        isAnyDeviceOn
          ? 'text-white hover:opacity-90'
          : hasAnyDeviceOff
            ? 'bg-red-500 text-white hover:bg-red-600'
            : isLiveView
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      style={isAnyDeviceOn ? { backgroundColor: '#8AD68F' } : {}}
    >
      <div 
        className={`w-2 h-2 rounded-full ${
          isAnyDeviceOn
            ? 'animate-pulse'
            : hasAnyDeviceOff
              ? 'bg-red-200 animate-pulse'
              : isLiveView
                ? 'bg-red-200 animate-pulse'
                : 'bg-gray-500'
        }`}
        style={isAnyDeviceOn ? { backgroundColor: 'rgba(255, 255, 255, 0.7)' } : {}}
      ></div>
      {isLiveView ? '📊 Historisch' : '⚡ Live-Ansicht'}
    </button>
  );
}
