import { create } from "zustand";

interface LiveIoTDataPoint {
  timestamp: string;
  device: string;
  status: 'on' | 'off';
  // Simulated consumption values
  electricityWh?: number;
  waterM3?: number;
  type: 'live_iot';
}

interface LiveIoTState {
  liveDataPoints: LiveIoTDataPoint[];
  addLiveDataPoint: (data: Omit<LiveIoTDataPoint, 'type'>) => void;
  clearLiveData: () => void;
  getLatestDeviceStatus: (device: string) => LiveIoTDataPoint | undefined;
}

export const useLiveIoTStore = create<LiveIoTState>((set, get) => ({
  liveDataPoints: [],
  
  addLiveDataPoint: (data) => {
    // Different consumption patterns per device type
    let electricityWh = 0;
    let waterM3 = 0;
    
    if (data.status === 'on') {
      switch (data.device) {
        case 'pump':
          electricityWh = 150; // 150W pump
          waterM3 = 0.25; // Increased from 0.05 to 0.25 m³/hour water flow (5x more sensitive)
          break;
        case 'electricity':
          electricityWh = 200; // 200W electrical device
          waterM3 = 0; // No water consumption
          break;
        case 'heating':
          electricityWh = 300; // 300W heating system
          waterM3 = 0; // No water consumption
          break;
      }
    }
    
    const livePoint: LiveIoTDataPoint = {
      ...data,
      type: 'live_iot',
      electricityWh,
      waterM3,
    };

    console.log('[LiveIoTStore] Adding data point:', livePoint);

    set(state => {
      const newState = {
        liveDataPoints: [...state.liveDataPoints, livePoint].slice(-50) // Keep last 50 points
      };
      console.log('[LiveIoTStore] New state:', newState);
      return newState;
    });
  },

  clearLiveData: () => set({ liveDataPoints: [] }),

  getLatestDeviceStatus: (device: string) => {
    const points = get().liveDataPoints.filter(p => p.device === device);
    return points.length > 0 ? points[points.length - 1] : undefined;
  }
}));
