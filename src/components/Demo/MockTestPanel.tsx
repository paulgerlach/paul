"use client";

import { useState } from 'react';
import { useLiveIoTStore } from '@/store/useLiveIoTStore';

interface MockTestPanelProps {
  isDemo?: boolean;
}

export default function MockTestPanel({ isDemo = false }: MockTestPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const { addLiveDataPoint } = useLiveIoTStore();

  if (!isDemo) return null;

  const sendMockWebhook = async (status: 'on' | 'off') => {
    setIsLoading(true);
    try {
      // Use relative path - works for both localhost and production
      const response = await fetch(`/api/demo/webhook?status=${status}&device=pump`, {
        method: 'GET',
      });
      
      const data = await response.json();
      setLastResponse(`${status.toUpperCase()}: ${data.message || 'Success'}`);
      console.log('Mock webhook response:', data);
      
      // Also inject directly into live store for immediate chart update
      const livePoint = {
        timestamp: new Date().toISOString(),
        device: 'pump',
        status: status
      };
      console.log('[MockTest] Adding live data point:', livePoint);
      addLiveDataPoint(livePoint);
    } catch (error) {
      console.error('Mock webhook error:', error);
      setLastResponse(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white rounded-lg shadow-lg p-4 min-w-[240px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
        <h3 className="font-semibold">Mock Test Panel</h3>
      </div>

      {/* Test Buttons */}
      <div className="space-y-2 mb-3">
        <button
          onClick={() => sendMockWebhook('on')}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
        >
          {isLoading ? '⏳ Sending...' : '🟢 Turn Pump ON'}
        </button>
        
        <button
          onClick={() => sendMockWebhook('off')}
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
        >
          {isLoading ? '⏳ Sending...' : '🔴 Turn Pump OFF'}
        </button>
      </div>

      {/* Response Display */}
      {lastResponse && (
        <div className="text-xs bg-gray-800 p-2 rounded border">
          <div className="text-gray-400 mb-1">Last Response:</div>
          <div className="text-green-400">{lastResponse}</div>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-700">
        Mock testing • Simulates Shelly device
      </div>
    </div>
  );
}
