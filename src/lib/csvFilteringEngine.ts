// CSV Filtering Engine - Pure JavaScript Implementation
// No database dependencies - works with Saad's CSV parsing

import { MeterReadingType } from '@/api';

export interface FilterParams {
  startDate?: string;
  endDate?: string;
  apartmentIds?: string[];  // Using meter IDs as apartment identifiers
  deviceTypes?: ('Heat' | 'Water' | 'WWater')[];
  meterIds?: string[];     // Direct meter filtering
}

export interface AggregationResult {
  period: string;
  value: number;
  count: number;
  deviceType?: string;
  meterId?: string;
}

export interface FilterStats {
  totalRecords: number;
  filteredRecords: number;
  removedRecords: number;
  filterCriteria: FilterParams;
}

/**
 * Main filtering function - applies all filters to CSV data
 */
export function filterMeterData(
  data: MeterReadingType[], 
  filters: FilterParams
): { filteredData: MeterReadingType[]; stats: FilterStats } {
  
  console.log(`🔍 Starting filter with ${data.length} records:`, filters);
  
  let filteredData = [...data];
  const totalRecords = data.length;

  // 1. Filter out header rows and invalid data
  filteredData = filteredData.filter(item => 
    item && 
    item["Frame Type"] && 
    item["Frame Type"] !== "Frame Type" &&
    item["Device Type"] && 
    item["Device Type"] !== "Device Type"
  );

  // 2. Device type filtering
  if (filters.deviceTypes?.length) {
    filteredData = filteredData.filter(item => 
      filters.deviceTypes!.includes(item["Device Type"] as any)
    );
    console.log(`📊 After device type filter: ${filteredData.length} records`);
  }

  // 3. Time-based filtering
  if (filters.startDate || filters.endDate) {
    filteredData = filteredData.filter(item => {
      const itemDateStr = item["IV,0,0,0,,Date/Time"];
      if (!itemDateStr) return false;

      try {
        // Parse the date string - handle various formats
        const itemDate = parseCSVDate(itemDateStr);
        
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          if (itemDate < startDate) return false;
        }
        
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          if (itemDate > endDate) return false;
        }
        
        return true;
      } catch (error) {
        console.warn(`⚠️ Could not parse date: ${itemDateStr}`);
        return false;
      }
    });
    console.log(`📅 After time filter: ${filteredData.length} records`);
  }

  // 4. Meter ID filtering (apartment selection)
  if (filters.meterIds?.length) {
    filteredData = filteredData.filter(item => 
      filters.meterIds!.includes(item.ID)
    );
    console.log(`🏠 After meter ID filter: ${filteredData.length} records`);
  }

  // 5. Apartment ID filtering (if different from meter IDs)
  if (filters.apartmentIds?.length && !filters.meterIds?.length) {
    filteredData = filteredData.filter(item => 
      filters.apartmentIds!.includes(item.ID)
    );
    console.log(`🏢 After apartment ID filter: ${filteredData.length} records`);
  }

  const stats: FilterStats = {
    totalRecords,
    filteredRecords: filteredData.length,
    removedRecords: totalRecords - filteredData.length,
    filterCriteria: filters
  };

  return { filteredData, stats };
}

/**
 * Parse CSV date strings into Date objects
 */
function parseCSVDate(dateStr: string): Date {
  // Handle formats like "07.04.2025 09:03 invalid 0 summer time 0"
  const cleanDate = dateStr.split(' ')[0] + ' ' + dateStr.split(' ')[1];
  const [datePart, timePart] = cleanDate.split(' ');
  
  if (datePart.includes('.')) {
    // DD.MM.YYYY format
    const [day, month, year] = datePart.split('.');
    const timeStr = timePart || '00:00';
    return new Date(`${year}-${month}-${day}T${timeStr}`);
  }
  
  // Fallback to standard parsing
  return new Date(dateStr);
}

/**
 * Time-based filtering presets
 */
export function getTimeFilterPresets() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return {
    last7Days: {
      startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    },
    last30Days: {
      startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    },
    last90Days: {
      startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    },
    yearToDate: {
      startDate: new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    }
  };
}

/**
 * Aggregation functions for dashboard charts
 */
export function aggregateConsumption(
  data: MeterReadingType[],
  aggregationType: 'sum' | 'avg' | 'min' | 'max',
  timeBucket: 'daily' | 'weekly' | 'monthly' = 'daily'
): AggregationResult[] {
  
  console.log(`📊 Aggregating ${data.length} records by ${timeBucket} with ${aggregationType}`);
  
  const grouped = groupByTimeBucket(data, timeBucket);
  
  return Object.entries(grouped).map(([period, records]) => {
    const energyValues = records
      .map(r => r["IV,0,0,0,Wh,E"])
      .filter((val): val is number => typeof val === 'number' && !isNaN(val));
    
    const volumeValues = records
      .map(r => r["IV,0,0,0,m^3,Vol"])
      .filter((val): val is number => typeof val === 'number' && !isNaN(val));
    
    // Use energy values for heat meters, volume for water meters
    const values = energyValues.length > 0 ? energyValues : volumeValues;
    
    let aggregatedValue = 0;
    
    if (values.length > 0) {
      switch (aggregationType) {
        case 'sum':
          aggregatedValue = values.reduce((a, b) => a + b, 0);
          break;
        case 'avg':
          aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case 'min':
          aggregatedValue = Math.min(...values);
          break;
        case 'max':
          aggregatedValue = Math.max(...values);
          break;
      }
    }
    
    return {
      period,
      value: Math.round(aggregatedValue * 100) / 100, // Round to 2 decimal places
      count: records.length
    };
  }).sort((a, b) => a.period.localeCompare(b.period));
}

/**
 * Group data by time buckets
 */
function groupByTimeBucket(
  data: MeterReadingType[], 
  bucket: 'daily' | 'weekly' | 'monthly'
): Record<string, MeterReadingType[]> {
  
  const grouped: Record<string, MeterReadingType[]> = {};
  
  data.forEach(record => {
    try {
      const dateStr = record["IV,0,0,0,,Date/Time"];
      if (!dateStr) return;
      
      const date = parseCSVDate(dateStr);
      let bucketKey: string;
      
      switch (bucket) {
        case 'daily':
          bucketKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay()); // Start of week
          bucketKey = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          bucketKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          bucketKey = date.toISOString().split('T')[0];
      }
      
      if (!grouped[bucketKey]) {
        grouped[bucketKey] = [];
      }
      grouped[bucketKey].push(record);
      
    } catch (error) {
      console.warn(`⚠️ Error grouping record:`, error);
    }
  });
  
  return grouped;
}

/**
 * Get unique meter IDs for apartment selection
 */
export function getAvailableMeters(data: MeterReadingType[]): Array<{
  id: string;
  deviceType: string;
  manufacturer: string;
}> {
  const meters = new Map();
  
  data.forEach(record => {
    if (record.ID && record["Device Type"]) {
      const key = record.ID;
      if (!meters.has(key)) {
        meters.set(key, {
          id: record.ID,
          deviceType: record["Device Type"],
          manufacturer: record.Manufacturer || 'Unknown'
        });
      }
    }
  });
  
  return Array.from(meters.values()).sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Get consumption summary statistics
 */
export function getConsumptionSummary(data: MeterReadingType[]): {
  totalDevices: number;
  deviceBreakdown: Record<string, number>;
  totalEnergyConsumption: number;
  totalVolumeConsumption: number;
  dateRange: { start: string; end: string } | null;
} {
  const deviceBreakdown: Record<string, number> = {};
  let totalEnergy = 0;
  let totalVolume = 0;
  const dates: Date[] = [];
  
  data.forEach(record => {
    // Count devices by type
    const deviceType = record["Device Type"];
    if (deviceType) {
      deviceBreakdown[deviceType] = (deviceBreakdown[deviceType] || 0) + 1;
    }
    
    // Sum consumption values
    if (record["IV,0,0,0,Wh,E"]) {
      totalEnergy += record["IV,0,0,0,Wh,E"];
    }
    if (record["IV,0,0,0,m^3,Vol"]) {
      totalVolume += record["IV,0,0,0,m^3,Vol"];
    }
    
    // Collect dates
    try {
      const dateStr = record["IV,0,0,0,,Date/Time"];
      if (dateStr) {
        dates.push(parseCSVDate(dateStr));
      }
    } catch (error) {
      // Skip invalid dates
    }
  });
  
  let dateRange = null;
  if (dates.length > 0) {
    dates.sort((a, b) => a.getTime() - b.getTime());
    dateRange = {
      start: dates[0].toISOString().split('T')[0],
      end: dates[dates.length - 1].toISOString().split('T')[0]
    };
  }
  
  return {
    totalDevices: data.length,
    deviceBreakdown,
    totalEnergyConsumption: Math.round(totalEnergy * 100) / 100,
    totalVolumeConsumption: Math.round(totalVolume * 100) / 100,
    dateRange
  };
}

