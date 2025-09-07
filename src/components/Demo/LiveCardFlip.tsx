"use client";

import { useState, useEffect, ReactNode } from 'react';
import { useLiveIoTStore } from '@/store/useLiveIoTStore';
import { useLiveViewStore } from '@/store/useLiveViewStore';

interface LiveCardFlipProps {
  children: ReactNode; // The original chart component
  cardType: 'electricity' | 'water-cold' | 'water-hot';
  isDemo?: boolean;
}

export default function LiveCardFlip({ children, cardType, isDemo = false }: LiveCardFlipProps) {
  const [liveData, setLiveData] = useState<number[]>([]);
  const liveDataPoints = useLiveIoTStore(state => state.liveDataPoints);
  const getLatestDeviceStatus = useLiveIoTStore(state => state.getLatestDeviceStatus);
  const isLiveView = useLiveViewStore(state => state.isLiveView);

  // Map chart types to device types
  const getDeviceForChart = (chartType: string): string => {
    switch (chartType) {
      case 'water-cold': return 'pump';
      case 'water-hot': return 'heating';
      case 'electricity': return 'electricity';
      default: return 'pump';
    }
  };

  const deviceType = getDeviceForChart(cardType);
  const isDeviceOn = getLatestDeviceStatus(deviceType)?.status === 'on';

  // No auto-flip - controlled by global live view toggle

  // Update live data every 5 seconds when device is ON
  useEffect(() => {
    if (!isDeviceOn || !isDemo) {
      setLiveData([]);
      return;
    }

    const updateLiveData = () => {
      const now = Date.now();
      const newValue = generateRealisticConsumption(cardType);
      
      setLiveData(prev => {
        const updated = [...prev, newValue].slice(-12); // Keep last 12 readings (1 minute)
        return updated;
      });
    };

    // Initial reading
    updateLiveData();
    
    // Update every 5 seconds
    const interval = setInterval(updateLiveData, 5000);
    return () => clearInterval(interval);
  }, [isDeviceOn, cardType, isDemo, deviceType]);

  const generateRealisticConsumption = (type: string): number => {
    const baseValues = {
      'electricity': 150, // 150W base
      'water-cold': 0.05, // Increased from 0.01 to 0.05 m³ per 5s (5x more sensitive)
      'water-hot': 0.04, // Increased from 0.008 to 0.04 m³ per 5s (5x more sensitive)
    };
    
    const base = baseValues[type as keyof typeof baseValues] || 0;
    // Add some realistic variation (±20%)
    const variation = base * 0.2 * (Math.random() - 0.5) * 2;
    return Math.max(0, base + variation);
  };

  const getUnit = () => {
    switch (cardType) {
      case 'electricity': return 'W';
      case 'water-cold':
      case 'water-hot': return 'm³/5s';
      default: return '';
    }
  };

  const getCurrentValue = () => {
    return liveData.length > 0 ? liveData[liveData.length - 1] : 0;
  };

  const getTitle = () => {
    switch (cardType) {
      case 'electricity': return 'Live Stromverbrauch';
      case 'water-cold': return 'Live Kaltwasser Verbrauch';
      case 'water-hot': return 'Live Warmwasser Verbrauch';
      default: return 'Live Daten';
    }
  };

  if (!isDemo) {
    return <>{children}</>;
  }

  return (
    <div className="relative h-full overflow-hidden">
      <div 
        className={`absolute inset-0 w-full h-full transition-transform duration-700 preserve-3d ${
          isLiveView ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side - Original Chart */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="relative h-full">
            {children}
          </div>
        </div>

        {/* Back Side - Live Interface */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="rounded-2xl shadow p-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${
                      isDeviceOn ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                <h3 className="text-lg font-medium">{getTitle()}</h3>
              </div>
            </div>

            {/* Live Value Display */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {getCurrentValue().toFixed(cardType === 'electricity' ? 0 : 3)}
                </div>
                <div className="text-gray-400 text-sm">{getUnit()}</div>
              </div>

              {/* Mini Live Chart */}
              <div className="w-full max-w-xs">
                <div className="flex items-end justify-center h-20 gap-1">
                  {liveData.map((value, index) => {
                    const maxValue = Math.max(...liveData, 1);
                    const height = (value / maxValue) * 100;
                    return (
                      <div
                        key={index}
                        className="bg-green-400 rounded-t transition-all duration-300"
                        style={{
                          height: `${height}%`,
                          width: '6px',
                          opacity: index === liveData.length - 1 ? 1 : 0.7 - (liveData.length - index) * 0.1
                        }}
                      />
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500 text-center mt-2">
                  Letzte {Math.max(liveData.length * 5, 5)} Sekunden
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
