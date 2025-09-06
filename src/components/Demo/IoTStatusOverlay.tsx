"use client";

import { useState, useEffect } from 'react';
import { useLiveIoTStore } from '@/store/useLiveIoTStore';

interface IoTDevice {
  device: string;
  status: 'on' | 'off';
  timestamp: string;
  message: string;
}

interface IoTStatusOverlayProps {
  isDemo?: boolean;
  tenantContext?: {
    street?: string;
    floor?: string;
    location?: string;
    area?: string;
  };
}

export default function IoTStatusOverlay({ isDemo = false, tenantContext }: IoTStatusOverlayProps) {
  const [devices, setDevices] = useState<Record<string, IoTDevice>>({});
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const { addLiveDataPoint } = useLiveIoTStore();

  useEffect(() => {
    // Only connect to SSE in demo mode
    if (!isDemo) return;

    let eventSource: EventSource;

    const connectSSE = () => {
      setConnectionStatus('connecting');
      // Use relative path - works for both localhost and production
      eventSource = new EventSource('/api/demo/stream');

      eventSource.onopen = () => {
        setConnectionStatus('connected');
        console.log('[IoT] Connected to real-time stream');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[IoT] Received update:', data);

          if (data.type === 'device_status') {
            setDevices(prev => ({
              ...prev,
              [data.device]: {
                device: data.device,
                status: data.status,
                timestamp: data.timestamp,
                message: data.message
              }
            }));
            setLastUpdate(new Date().toLocaleTimeString());
            
            // Inject live data point for charts
            addLiveDataPoint({
              timestamp: data.timestamp,
              device: data.device,
              status: data.status
            });
          }
        } catch (error) {
          console.warn('[IoT] Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.warn('[IoT] SSE connection error:', error);
        setConnectionStatus('disconnected');
        
        // Reconnect after 3 seconds
        setTimeout(() => {
          if (eventSource.readyState === EventSource.CLOSED) {
            connectSSE();
          }
        }, 3000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isDemo]);

  // Don't render if not in demo mode
  if (!isDemo) return null;

  const deviceList = Object.values(devices);
  const hasDevices = deviceList.length > 0;

  return (
    <div className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 min-w-[280px] max-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse bg-blue-500"></div>
          <div>
            <h3 className="font-semibold text-gray-900">Live IoT Status</h3>
            {tenantContext && (
              <div className="text-xs text-gray-600">
                {tenantContext.street} • {tenantContext.floor} {tenantContext.location} {tenantContext.area}
              </div>
            )}
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connected' ? 'bg-green-500' :
          connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
          'bg-red-500'
        }`} title={`Connection: ${connectionStatus}`}></div>
      </div>

      {/* Connection Status */}
      <div className="text-xs text-gray-500 mb-3">
        Status: <span className={`font-medium ${
          connectionStatus === 'connected' ? 'text-green-600' :
          connectionStatus === 'connecting' ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {connectionStatus === 'connected' ? 'Connected' :
           connectionStatus === 'connecting' ? 'Connecting...' :
           'Disconnected'}
        </span>
        {lastUpdate && (
          <span className="ml-2">• Updated: {lastUpdate}</span>
        )}
      </div>

      {/* Device List */}
      {hasDevices ? (
        <div className="space-y-2">
          {deviceList.map((device) => (
            <div key={device.device} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  device.status === 'on' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium capitalize">{device.device}</span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${
                  device.status === 'on' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {device.status.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(device.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <div className="text-2xl mb-2">🔌</div>
          <div className="text-sm">Waiting for device updates...</div>
          <div className="text-xs mt-1">Configure Shelly to see live data</div>
        </div>
      )}

      {/* Demo Info */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-400">
          Real-time IoT Demo • Powered by Shelly Integration
        </div>
      </div>
    </div>
  );
}
