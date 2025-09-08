"use client";

import { useState, useEffect } from 'react';
import { useLiveIoTStore } from '@/store/useLiveIoTStore';
import { useDraggable } from '@/hooks/useDraggable';

interface IoTDevice {
  device: string;
  status: 'on' | 'off';
  timestamp: string;
  message: string;
  source?: 'mock' | 'live';
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { addLiveDataPoint } = useLiveIoTStore();
  
  // Debug function to clear devices
  const clearDevices = () => {
    setDevices({});
    console.log('[IoT] Cleared all device data');
  };
  
  // Make the panel draggable
  const { position, isDragging, dragRef, dragHandleProps, updatePosition, isInitialized } = useDraggable({
    initialPosition: { x: 0, y: 0 }, // Will be set after client-side hydration
    bounds: { left: 10, top: 10, right: 1200, bottom: 800 } // Default bounds, will be updated client-side
  });

  // Prevent hydration mismatch and set initial position
  useEffect(() => {
    setIsClient(true);
    // Set initial position after client-side hydration to original top-right location
    if (typeof window !== 'undefined' && !isInitialized) {
      const initialX = window.innerWidth - 340; // 320px width + 20px margin
      const initialY = 80; // Original top position (20px from top + 60px for header)
      updatePosition({ x: initialX, y: initialY });
    }
  }, [isInitialized, updatePosition]);

  useEffect(() => {
    // Only start polling in demo mode
    if (!isDemo) return;

    let pollingInterval: NodeJS.Timeout;

    const startPolling = () => {
      setConnectionStatus('connecting');
      
      const poll = async () => {
        try {
          const response = await fetch('/api/demo/status');
          const data = await response.json();
          
          if (data.success && data.devices) {
            setConnectionStatus('connected');
            console.log('[IoT] Polling update:', data.devices);
            
            // Update devices state
            const newDevices: Record<string, IoTDevice> = {};
            data.devices.forEach((device: any) => {
              newDevices[device.device] = {
                device: device.device,
                status: device.status,
                timestamp: device.timestamp,
                message: device.message,
                source: device.source || 'live'
              };
              
              // Inject live data point for charts
              addLiveDataPoint({
                timestamp: device.timestamp,
                device: device.device,
                status: device.status,
                source: device.source || 'live'
              });
            });
            
            setDevices(newDevices);
            setLastUpdate(new Date().toLocaleTimeString());
          }
        } catch (error) {
          console.warn('[IoT] Polling error:', error);
          setConnectionStatus('disconnected');
        }
      };

      // Initial poll
      poll();
      
      // Poll every 2 seconds
      pollingInterval = setInterval(poll, 2000);
      
      console.log('[IoT] Started polling for device updates');
    };

    startPolling();

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        console.log('[IoT] Stopped polling');
      }
    };
  }, [isDemo]);

  // Don't render if not in demo mode or not client-side yet
  if (!isDemo || !isClient) return null;

  const deviceList = Object.values(devices);
  const hasDevices = deviceList.length > 0;

  return (
    <div 
      ref={dragRef}
      className={`fixed z-50 bg-white rounded-lg shadow-lg border p-4 min-w-[280px] max-w-[320px] ${isDragging ? 'shadow-2xl' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        right: 'auto',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div 
          className="flex items-center gap-2 flex-1 select-none"
          {...dragHandleProps}
          title="Drag to move panel"
        >
          <div className="w-2 h-2 rounded-full animate-pulse bg-blue-500"></div>
          <div>
            <h3 className="font-semibold text-gray-900">Live IoT Status</h3>
            {tenantContext && (
              <div className="text-xs text-gray-600">
                {tenantContext.street} • {tenantContext.floor} {tenantContext.location} {tenantContext.area}
              </div>
            )}
          </div>
          <div className="text-gray-400 text-xs ml-2">⋮⋮</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            title={isMinimized ? "Maximieren" : "Minimieren"}
          >
            {isMinimized ? "□" : "−"}
          </button>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
            'bg-red-500'
          }`} title={`Connection: ${connectionStatus}`}></div>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Connection Status */}
          <div className="text-xs text-gray-500 mb-3">
            Status: <span className={`font-medium ${
              connectionStatus === 'connected' ? 'text-green-600' :
              connectionStatus === 'connecting' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {connectionStatus === 'connected' ? 'Verbunden' :
               connectionStatus === 'connecting' ? 'Verbinde...' :
               'Getrennt'}
            </span>
            {lastUpdate && (
              <span className="ml-2">• Aktualisiert: {lastUpdate}</span>
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
                    <div>
                      <span className="font-medium capitalize">
                        {device.device === 'pump' ? 'Pumpe' : 
                         device.device === 'wwater' ? 'Warmwasser' :
                         device.device === 'heat' ? 'Heizung' : 
                         device.device}
                      </span>
                      <div className="text-xs text-gray-400">
                        {device.source === 'mock' ? '🎮 Test' : '📡 Live'}
                      </div>
                    </div>
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
            <div className="space-y-2">
              {/* Show connection status even without device data */}
              <div className="text-center py-2 text-gray-500">
                <div className="text-lg mb-1">🔌</div>
                <div className="text-xs">
                  {connectionStatus === 'connected' ? 
                    'Dashboard bereit für Shelly Updates' : 
                    'Verbinde zu Live-Stream...'}
                </div>
              </div>
              
              {/* Show expected devices as placeholders */}
              {connectionStatus === 'connected' && (
                <div className="space-y-1">
                  {[
                    { key: 'pump', name: 'Pumpe' },
                    { key: 'wwater', name: 'Warmwasser' },
                    { key: 'heat', name: 'Heizung' }
                  ].map((device) => (
                    <div key={device.key} className="flex items-center justify-between p-2 bg-gray-50 rounded opacity-50">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="font-medium capitalize text-xs">{device.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">WARTEN</div>
                        <div className="text-xs text-gray-400">Kein Signal</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Demo Info */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-400">
              Echtzeit IoT Demo • Powered by Shelly Integration
            </div>
          </div>
        </>
      )}
    </div>
  );
}
