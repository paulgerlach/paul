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

  // Check if pump is currently active (this will trigger re-renders when liveDataPoints changes)
  const latestPumpStatus = getLatestDeviceStatus('pump');
  const isPumpOn = latestPumpStatus?.status === 'on';
  const hasLiveData = getLatestDeviceStatus('pump') !== undefined;

  // Always show toggle in demo mode, regardless of live data
  // if (!hasLiveData) return null;

  return (
    <button
      onClick={toggleLiveView}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
        isPumpOn
          ? 'text-white hover:opacity-90'
          : isLiveView
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      style={isPumpOn ? { backgroundColor: '#8AD68F' } : {}}
    >
      <div 
        className={`w-2 h-2 rounded-full ${
          isPumpOn
            ? 'animate-pulse'
            : isLiveView
              ? 'bg-red-200 animate-pulse'
              : 'bg-gray-500'
        }`}
        style={isPumpOn ? { backgroundColor: 'rgba(255, 255, 255, 0.7)' } : {}}
      ></div>
      {isLiveView ? '📊 Historisch' : '⚡ Live-Ansicht'}
    </button>
  );
}
