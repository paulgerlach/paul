"use client";

import { useState, useEffect } from 'react';
import { useLiveIoTStore } from '@/store/useLiveIoTStore';
import { useDraggable } from '@/hooks/useDraggable';

interface MockTestPanelProps {
  isDemo?: boolean;
}

export default function MockTestPanel({ isDemo = false }: MockTestPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { addLiveDataPoint, getStorageInfo, clearLiveData } = useLiveIoTStore();
  const [showStorage, setShowStorage] = useState(false);
  
  // Make the panel draggable
  const { position, isDragging, dragRef, dragHandleProps, updatePosition, isInitialized } = useDraggable({
    initialPosition: { x: 0, y: 0 }, // Will be set after client-side hydration
    bounds: { left: 10, top: 10, right: 1200, bottom: 800 } // Default bounds, will be updated client-side
  });

  // Prevent hydration mismatch and set initial position
  useEffect(() => {
    setIsClient(true);
    // Set initial position after client-side hydration to original bottom-right location
    if (typeof window !== 'undefined' && !isInitialized) {
      const initialX = window.innerWidth - 260; // 240px width + 20px margin
      const initialY = window.innerHeight - 400; // Original bottom position (400px from bottom)
      updatePosition({ x: initialX, y: initialY });
    }
  }, [isInitialized, updatePosition]);

  if (!isDemo || !isClient) return null;

  const sendMockWebhook = async (status: 'on' | 'off', device: 'pump' | 'wwater' | 'heat') => {
    setIsLoading(true);
    try {
      // Use relative path - works for both localhost and production
      // Add source=mock parameter to identify this as mock data
      const response = await fetch(`/api/demo/webhook?status=${status}&device=${device}&source=mock`, {
        method: 'GET',
      });
      
      const data = await response.json();
      setLastResponse(`${device.toUpperCase()} ${status.toUpperCase()}: ${data.message || 'Success'}`);
      console.log('Mock webhook response:', data);
      console.log('Mock webhook - sent source=mock, received data:', {
        success: data.success,
        source: data.data?.source,
        message: data.data?.message
      });
      
      // VERCEL FIX: Also directly inject data to store as fallback for serverless memory issues
      if (data.success && data.data) {
        console.log('[Mock] Directly injecting data as Vercel fallback:', data.data);
        addLiveDataPoint({
          timestamp: data.data.timestamp,
          device: data.data.device,
          status: data.data.status,
          source: data.data.source || 'mock'
        });
      }
    } catch (error) {
      console.error('Mock webhook error:', error);
      setLastResponse(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendLiveSimulation = async (status: 'on' | 'off', device: 'pump' | 'wwater' | 'heat') => {
    setIsLoading(true);
    try {
      // Use relative path - works for both localhost and production
      // NO source parameter - simulates real Shelly device (defaults to live)
      const response = await fetch(`/api/demo/webhook?status=${status}&device=${device}`, {
        method: 'GET',
      });
      
      const data = await response.json();
      setLastResponse(`LIVE SIM ${device.toUpperCase()} ${status.toUpperCase()}: ${data.message || 'Success'}`);
      console.log('Live simulation response:', data);
      console.log('Live simulation - no source param, received data:', {
        success: data.success,
        source: data.data?.source,
        message: data.data?.message
      });
      
      // VERCEL FIX: Also directly inject data to store as fallback for serverless memory issues
      if (data.success && data.data) {
        console.log('[Live Sim] Directly injecting data as Vercel fallback:', data.data);
        addLiveDataPoint({
          timestamp: data.data.timestamp,
          device: data.data.device,
          status: data.data.status,
          source: data.data.source || 'live'
        });
      }
    } catch (error) {
      console.error('Live simulation error:', error);
      setLastResponse(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={dragRef}
      className={`fixed z-50 bg-white text-gray-800 rounded-lg shadow-lg p-4 min-w-[320px] max-h-[80vh] overflow-y-auto ${isDragging ? 'shadow-2xl' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        right: 'auto',
        bottom: 'auto',
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
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <h3 className="font-semibold">Test Panel</h3>
          <div className="text-gray-600 text-xs ml-2">⋮⋮</div>
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-gray-600 hover:text-gray-800 transition-colors p-1"
          title={isMinimized ? "Maximieren" : "Minimieren"}
        >
          {isMinimized ? "□" : "−"}
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* Mock Test Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <h4 className="text-sm font-medium text-gray-700">🎮 Test Simulation</h4>
            </div>
            <div className="space-y-2">
              {/* Pump Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => sendMockWebhook('on', 'pump')}
                  disabled={isLoading}
                  className="flex-1 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                  style={{ backgroundColor: '#8AD68F' }}
                  onMouseEnter={(e) => !isLoading && ((e.target as HTMLElement).style.backgroundColor = '#7BC87F')}
                  onMouseLeave={(e) => !isLoading && ((e.target as HTMLElement).style.backgroundColor = '#8AD68F')}
                >
                  {isLoading ? '⏳' : '💧 Pumpe EIN'}
                </button>
                <button
                  onClick={() => sendMockWebhook('off', 'pump')}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                >
                  {isLoading ? '⏳' : '💧 Pumpe AUS'}
                </button>
              </div>
              
              {/* Hot Water Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => sendMockWebhook('on', 'wwater')}
                  disabled={isLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                >
                  {isLoading ? '⏳' : '🚿 Warmwasser EIN'}
                </button>
                <button
                  onClick={() => sendMockWebhook('off', 'wwater')}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                >
                  {isLoading ? '⏳' : '🚿 Warmwasser AUS'}
                </button>
              </div>
              
              {/* Heat Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => sendMockWebhook('on', 'heat')}
                  disabled={isLoading}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                >
                  {isLoading ? '⏳' : '🌡️ Wärme EIN'}
                </button>
                <button
                  onClick={() => sendMockWebhook('off', 'heat')}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                >
                  {isLoading ? '⏳' : '🌡️ Wärme AUS'}
                </button>
              </div>
            </div>
          </div>

          {/* Live Simulation Section */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <h4 className="text-sm font-medium text-gray-700">📡 Live Simulation</h4>
            </div>
            <div className="space-y-2">
              {/* Pump Live Simulation */}
              <div className="flex gap-2">
                <button
                  onClick={() => sendLiveSimulation('on', 'pump')}
                  disabled={isLoading}
                  className="flex-1 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                  style={{ backgroundColor: '#22C55E' }}
                  onMouseEnter={(e) => !isLoading && ((e.target as HTMLElement).style.backgroundColor = '#16A34A')}
                  onMouseLeave={(e) => !isLoading && ((e.target as HTMLElement).style.backgroundColor = '#22C55E')}
                >
                  {isLoading ? '⏳' : '💧 Pumpe Live EIN'}
                </button>
                <button
                  onClick={() => sendLiveSimulation('off', 'pump')}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                >
                  {isLoading ? '⏳' : '💧 Pumpe Live AUS'}
                </button>
              </div>
              
              {/* Hot Water Live Simulation */}
              <div className="flex gap-2">
                <button
                  onClick={() => sendLiveSimulation('on', 'wwater')}
                  disabled={isLoading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                >
                  {isLoading ? '⏳' : '🚿 Warmwasser Live EIN'}
                </button>
                <button
                  onClick={() => sendLiveSimulation('off', 'wwater')}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                >
                  {isLoading ? '⏳' : '🚿 Warmwasser Live AUS'}
                </button>
              </div>
              
              {/* Heat Live Simulation */}
              <div className="flex gap-2">
                <button
                  onClick={() => sendLiveSimulation('on', 'heat')}
                  disabled={isLoading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                >
                  {isLoading ? '⏳' : '🌡️ Wärme Live EIN'}
                </button>
                <button
                  onClick={() => sendLiveSimulation('off', 'heat')}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                >
                  {isLoading ? '⏳' : '🌡️ Wärme Live AUS'}
                </button>
              </div>
            </div>
          </div>

          {/* Response Display */}
          {lastResponse && (
            <div className="text-xs bg-gray-50 p-2 rounded border border-gray-200">
              <div className="text-gray-600 mb-1">Letzte Antwort:</div>
              <div className="text-green-700">{lastResponse}</div>
            </div>
          )}

          {/* Storage Info */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => setShowStorage(!showStorage)}
              className="text-xs text-gray-600 hover:text-gray-800 mb-2"
            >
              📊 Speicher Info {showStorage ? '▼' : '▶'}
            </button>
            
            {showStorage && (
              <div className="text-xs text-gray-600 space-y-1">
                {(() => {
                  const info = getStorageInfo();
                  return (
                    <>
                      <div>Datenpunkte: {info.dataPoints}</div>
                      <div>Geräte: {info.devices.join(', ') || 'Keine'}</div>
                      <div>Größe: {info.storageSize}</div>
                      <button
                        onClick={() => {
                          clearLiveData();
                          setLastResponse('Speicher geleert');
                        }}
                        className="mt-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                      >
                        🗑️ Speicher leeren
                      </button>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Mode Info */}
          <div className="text-xs text-gray-600 mt-2 space-y-1">
            <div className="font-medium">📋 Test Panel Funktionen:</div>
            <div>• 🎮 <span className="font-medium">Mock Test</span>: Buttons für Simulation</div>
            <div>• 📡 <span className="font-medium">Live Detection</span>: Zeigt echte Shelly Daten</div>
            <div className="text-xs text-gray-500 mt-1">
              Beide Modi funktionieren gleichzeitig
            </div>
          </div>
        </>
      )}
    </div>
  );
}