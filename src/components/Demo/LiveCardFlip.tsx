"use client";

import { useState, useEffect, ReactNode } from 'react';
import { useLiveIoTStore } from '@/store/useLiveIoTStore';
import { useLiveViewStore } from '@/store/useLiveViewStore';
import { ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LiveCardFlipProps {
  children: ReactNode; // The original chart component
  cardType: 'heat' | 'water-cold' | 'water-hot';
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
      case 'water-hot': return 'wwater'; // Hot water uses wwater device
      case 'heat': return 'heat'; // Heat chart uses heat device
      default: return 'pump';
    }
  };

  const deviceType = getDeviceForChart(cardType);
  const isDeviceOn = getLatestDeviceStatus(deviceType)?.status === 'on';

  // No auto-flip - controlled by global live view toggle

  // Update live data every 5 seconds when device is ON
  useEffect(() => {
    if (!isDemo) {
      setLiveData([]);
      return;
    }
    
    // Don't clear data when device turns off - keep historical data
    if (!isDeviceOn) {
      return; // Keep existing data, don't update
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
    
    // Update every 3 seconds
    const interval = setInterval(updateLiveData, 3000);
    return () => clearInterval(interval);
  }, [isDeviceOn, cardType, isDemo, deviceType]);

  const generateRealisticConsumption = (type: string): number => {
    const baseValues = {
      'heat': 300, // 300W base for heating
      'water-cold': 0.05, // Increased from 0.01 to 0.05 m³ per 3s (5x more sensitive)
      'water-hot': 0.04, // Increased from 0.008 to 0.04 m³ per 3s (5x more sensitive)
    };
    
    const base = baseValues[type as keyof typeof baseValues] || 0;
    // Add some realistic variation (±20%)
    const variation = base * 0.2 * (Math.random() - 0.5) * 2;
    return Math.max(0, base + variation);
  };

  const getUnit = () => {
    switch (cardType) {
      case 'heat': return 'W';
      case 'water-cold':
      case 'water-hot': return 'm³/3s';
      default: return '';
    }
  };

  const getCurrentValue = () => {
    return liveData.length > 0 ? liveData[liveData.length - 1] : 0;
  };

  const getChartData = () => {
    if (cardType === 'heat') {
      // For heat chart live view, show as time periods (minutes/seconds)
      return liveData.map((value, index) => ({
        time: index < 20 ? `${index * 3}s` : `${Math.floor(index * 3 / 60)}m`,
        value: value
      }));
    } else {
      // For water charts, show as time periods
      return liveData.map((value, index) => ({
        time: `${index * 3}s`,
        value: value
      }));
    }
  };

  const getChartColor = () => {
    switch (cardType) {
      case 'heat': return '#6083CC'; // Blue like original Heizkosten
      case 'water-cold': return '#6083CC'; // Blue like original Kaltwasser
      case 'water-hot': return '#E74B3C'; // Red like original Warmwasser
      default: return '#6083CC';
    }
  };

  const getTitle = () => {
    switch (cardType) {
      case 'heat': return 'Live Heizkosten';
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
          <div className="rounded-2xl shadow p-4 bg-white text-gray-800 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${
                      isDeviceOn ? 'bg-green-600' : 'bg-red-500'
                    }`}></div>
                <h3 className="text-lg font-medium">{getTitle()}</h3>
              </div>
            </div>

            {/* Live Chart Display - Full Size Like Original */}
            <div className="flex-1 flex flex-col">
              {/* Chart Area */}
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={getChartData()} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <defs>
                      <linearGradient id={`colorLive${cardType}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={getChartColor()} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      tickFormatter={(value) => cardType === 'heat' ? `${value}W` : `${value.toFixed(2)}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB', 
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [
                        `${cardType === 'heat' ? value.toFixed(0) : value.toFixed(3)} ${getUnit()}`, 
                        getTitle().replace('Live ', '')
                      ]}
                    />
                    {cardType === 'heat' ? (
                      <Bar 
                        dataKey="value" 
                        fill={getChartColor()}
                        radius={[2, 2, 0, 0]}
                      />
                    ) : (
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={getChartColor()} 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill={`url(#colorLive${cardType})`} 
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              {/* Current Value & Status */}
              <div className="flex justify-between items-center mt-2 px-2">
                <div className="text-xs text-gray-500">
                  Letzte {Math.max(liveData.length * 3, 3)}s
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {isDeviceOn ? (
                    <span className="text-green-600">
                      {cardType === 'heat' 
                        ? `${getCurrentValue().toFixed(0)}W` 
                        : `${getCurrentValue().toFixed(3)} m³/3s`}
                    </span>
                  ) : (
                    <span className="text-red-600">0 {getUnit()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
