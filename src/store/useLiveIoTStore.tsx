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
  getLatestDeviceStatus: (device: string) => 'on' | 'off' | null;
}

export const useLiveIoTStore = create<LiveIoTState>((set, get) => ({
  liveDataPoints: [],
  
  addLiveDataPoint: (data) => {
    const livePoint: LiveIoTDataPoint = {
      ...data,
      type: 'live_iot',
      // Simulate consumption based on device status
      electricityWh: data.status === 'on' ? 150 : 0, // 150W when pump is on
      waterM3: data.status === 'on' ? 0.05 : 0, // 0.05 m³/hour when pump is on
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
