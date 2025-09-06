"use client";

import { useLiveViewStore } from '@/store/useLiveViewStore';
import { useLiveIoTStore } from '@/store/useLiveIoTStore';
import { getDemoConfig } from '@/lib/demo/config';

export default function LiveViewToggle() {
  const { isLiveView, toggleLiveView } = useLiveViewStore();
  const getLatestDeviceStatus = useLiveIoTStore(state => state.getLatestDeviceStatus);
  const { isDemo } = getDemoConfig();

  // Don't show if not in demo mode
  if (!isDemo) return null;

  // Check if pump is currently active
  const isPumpOn = getLatestDeviceStatus('pump')?.status === 'on';
  const hasLiveData = getLatestDeviceStatus('pump') !== undefined;

  // Always show toggle in demo mode, regardless of live data
  // if (!hasLiveData) return null;

  return (
    <button
      onClick={toggleLiveView}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
        isLiveView
          ? isPumpOn 
            ? 'bg-green-500 text-white hover:bg-green-600' 
            : 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${
        isLiveView
          ? isPumpOn
            ? 'bg-green-200 animate-pulse'
            : 'bg-red-200 animate-pulse'
          : 'bg-gray-500'
      }`}></div>
      {isLiveView ? '📊 Historisch' : '⚡ Live-Ansicht'}
    </button>
  );
}
