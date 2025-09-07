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
  const { addLiveDataPoint } = useLiveIoTStore();
  
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

  const sendMockWebhook = async (status: 'on' | 'off', device: 'pump' | 'electricity' | 'heating') => {
    setIsLoading(true);
    try {
      // Use relative path - works for both localhost and production
      const response = await fetch(`/api/demo/webhook?status=${status}&device=${device}`, {
        method: 'GET',
      });
      
      const data = await response.json();
      setLastResponse(`${device.toUpperCase()} ${status.toUpperCase()}: ${data.message || 'Success'}`);
      console.log('Mock webhook response:', data);
      
      // Also inject directly into live store for immediate chart update
      const livePoint = {
        timestamp: new Date().toISOString(),
        device: device,
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
    <div 
      ref={dragRef}
      className={`fixed z-50 bg-gray-900 text-white rounded-lg shadow-lg p-4 min-w-[240px] ${isDragging ? 'shadow-2xl' : ''}`}
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
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <h3 className="font-semibold">Test Panel</h3>
          <div className="text-gray-400 text-xs ml-2">⋮⋮</div>
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-gray-400 hover:text-white transition-colors p-1"
          title={isMinimized ? "Maximieren" : "Minimieren"}
        >
          {isMinimized ? "□" : "−"}
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* Test Buttons */}
          <div className="space-y-2 mb-3">
            {/* Pump Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => sendMockWebhook('on', 'pump')}
                disabled={isLoading}
                className="flex-1 disabled:bg-gray-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
                style={{ backgroundColor: '#8AD68F' }}
                onMouseEnter={(e) => !isLoading && ((e.target as HTMLElement).style.backgroundColor = '#7BC87F')}
                onMouseLeave={(e) => !isLoading && ((e.target as HTMLElement).style.backgroundColor = '#8AD68F')}
              >
                {isLoading ? '⏳' : '💧 Pumpe EIN'}
              </button>
              <button
                onClick={() => sendMockWebhook('off', 'pump')}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
              >
                {isLoading ? '⏳' : '💧 Pumpe AUS'}
              </button>
            </div>
            
            {/* Heating Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => sendMockWebhook('on', 'heating')}
                disabled={isLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
              >
                {isLoading ? '⏳' : '🔥 Heizung EIN'}
              </button>
              <button
                onClick={() => sendMockWebhook('off', 'heating')}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
              >
                {isLoading ? '⏳' : '🔥 Heizung AUS'}
              </button>
            </div>
            
            {/* Electricity Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => sendMockWebhook('on', 'electricity')}
                disabled={isLoading}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
              >
                {isLoading ? '⏳' : '⚡ Strom EIN'}
              </button>
              <button
                onClick={() => sendMockWebhook('off', 'electricity')}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors"
              >
                {isLoading ? '⏳' : '⚡ Strom AUS'}
              </button>
            </div>
          </div>

      {/* Response Display */}
      {lastResponse && (
        <div className="text-xs bg-gray-800 p-2 rounded border">
          <div className="text-gray-400 mb-1">Letzte Antwort:</div>
          <div className="text-green-400">{lastResponse}</div>
        </div>
      )}

          {/* Info */}
          <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-700">
            Test Modus • Simuliert Shelly Gerät
          </div>
        </>
      )}
    </div>
  );
}
