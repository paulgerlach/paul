import { create } from "zustand";

// LocalStorage persistence
const STORAGE_KEY = 'heidi-live-iot-data';
const CUMULATIVE_STORAGE_KEY = 'heidi-live-iot-cumulative';

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

interface LiveIoTDataPoint {
  timestamp: string;
  device: string;
  status: 'on' | 'off';
  source?: 'mock' | 'live'; // Track data source
  // Simulated consumption values
  electricityWh?: number;
  waterM3?: number;
  heatWh?: number;
  type: 'live_iot';
}

interface LiveIoTState {
  liveDataPoints: LiveIoTDataPoint[];
  cumulativeValues: Record<string, { electricityWh: number; waterM3: number; heatWh: number }>;
  addLiveDataPoint: (data: Omit<LiveIoTDataPoint, 'type'>) => void;
  clearLiveData: () => void;
  getLatestDeviceStatus: (device: string) => LiveIoTDataPoint | undefined;
  getCumulativeValue: (device: string) => { electricityWh: number; waterM3: number; heatWh: number };
  getStorageInfo: () => { dataPoints: number; devices: string[]; storageSize: string };
}

export const useLiveIoTStore = create<LiveIoTState>((set, get) => ({
  liveDataPoints: loadFromStorage<LiveIoTDataPoint[]>(STORAGE_KEY, []),
  cumulativeValues: loadFromStorage<Record<string, { electricityWh: number; waterM3: number; heatWh: number }>>(CUMULATIVE_STORAGE_KEY, {}),
  
  addLiveDataPoint: (data) => {
    set(state => {
      // Prevent duplicate data points within same second
      const now = new Date(data.timestamp).getTime();
      const recentPoint = state.liveDataPoints
        .filter(p => p.device === data.device)
        .find(p => Math.abs(new Date(p.timestamp).getTime() - now) < 2000); // Within 2 seconds
      
      if (recentPoint) {
        console.log('[Store] Preventing duplicate data point for', data.device, 'within 2 seconds');
        return state; // Don't add duplicate
      }
      // Get current cumulative value for this device
      const currentCumulative = state.cumulativeValues[data.device] || { electricityWh: 0, waterM3: 0, heatWh: 0 };
      
      // Calculate incremental consumption (per 3-second interval)
      let incrementalElectricity = 0;
      let incrementalWater = 0;
      let incrementalHeat = 0;
      
      if (data.status === 'on') {
        switch (data.device) {
          case 'pump':
            incrementalElectricity = 150 * (3/3600); // 150W pump motor for 3 seconds (converted to Wh)
            incrementalWater = 0.015 * (3/3600); // 0.015 m³/hour = 15L/hour = realistic household pump
            incrementalHeat = 0; // No heat generation
            break;
          case 'wwater':
            incrementalElectricity = 2000 * (3/3600); // 2000W electric water heater for 3 seconds (converted to Wh)
            incrementalWater = 0.008 * (3/3600); // 0.008 m³/hour = 8L/hour = realistic hot water usage
            incrementalHeat = 1800 * (3/3600); // 1800W thermal heat output (90% efficiency) for 3 seconds (converted to Wh)
            break;
          case 'heat':
            incrementalElectricity = 1500 * (3/3600); // 1500W space heater for 3 seconds (converted to Wh)
            incrementalWater = 0; // No water consumption for electric heating
            incrementalHeat = 1350 * (3/3600); // 1350W thermal heat output (90% efficiency) for 3 seconds (converted to Wh)
            break;
        }
      }
      // When status is 'off', incremental values remain 0 (accumulation holds)
      
      // Update cumulative values (accumulation)
      const newCumulative = {
        electricityWh: currentCumulative.electricityWh + incrementalElectricity,
        waterM3: currentCumulative.waterM3 + incrementalWater,
        heatWh: currentCumulative.heatWh + incrementalHeat
      };
      
      const livePoint: LiveIoTDataPoint = {
        ...data,
        type: 'live_iot',
        electricityWh: newCumulative.electricityWh, // Store cumulative value
        waterM3: newCumulative.waterM3, // Store cumulative value
        heatWh: newCumulative.heatWh, // Store cumulative value
      };

      console.log('[LiveIoTStore] Adding data point:', livePoint);
      console.log('[LiveIoTStore] Device:', data.device, 'Status:', data.status, 'Cumulative:', newCumulative);

      const newState = {
        ...state,
        liveDataPoints: [...state.liveDataPoints, livePoint].slice(-100), // Keep last 100 points
        cumulativeValues: {
          ...state.cumulativeValues,
          [data.device]: newCumulative
        }
      };

      // Persist to localStorage
      saveToStorage(STORAGE_KEY, newState.liveDataPoints);
      saveToStorage(CUMULATIVE_STORAGE_KEY, newState.cumulativeValues);

      return newState;
    });
  },

  clearLiveData: () => {
    // Clear both state and localStorage
    set({ liveDataPoints: [], cumulativeValues: {} });
    saveToStorage(STORAGE_KEY, []);
    saveToStorage(CUMULATIVE_STORAGE_KEY, {});
    console.log('[LiveIoTStore] Cleared all data and localStorage');
  },

  getLatestDeviceStatus: (device: string) => {
    const points = get().liveDataPoints.filter(p => p.device === device);
    return points.length > 0 ? points[points.length - 1] : undefined;
  },

  getCumulativeValue: (device: string) => {
    const state = get();
    return state.cumulativeValues[device] || { electricityWh: 0, waterM3: 0, heatWh: 0 };
  },

  getStorageInfo: () => {
    const state = get();
    const devices = [...new Set(state.liveDataPoints.map(p => p.device))];
    const storageData = localStorage.getItem(STORAGE_KEY) || '[]';
    const storageSize = `${(storageData.length / 1024).toFixed(1)}KB`;
    
    return {
      dataPoints: state.liveDataPoints.length,
      devices,
      storageSize
    };
  }
}));
