import { MeterReadingType } from "@/api";
import { StaticImageData } from "next/image";
import {
  alert_triangle,
  blue_info,
  hot_water,
  cold_water,
  heater,
  pipe_water,
} from "@/static/icons";

export interface ConsumptionNotification {
  leftIcon: StaticImageData;
  rightIcon: StaticImageData;
  leftBg: string;
  rightBg: string;
  title: string;
  subtitle: string;
  meterId?: number;
  severity: "low" | "medium" | "high" | "critical";
}

/**
 * Parse German number format to float
 * "1.234,56" → 1234.56
 * "1,234" → 1.234
 */
function parseGermanNumber(value: string | number | undefined): number | null {
  if (value === undefined || value === null || value === "") return null;
  
  if (typeof value === "number") return value;
  
  const str = String(value).trim();
  if (str === "" || str === "0" || str === "0,000") return 0;
  
  // Handle German format: "1.234,56" → 1234.56
  // Replace dots (thousands separator) and comma (decimal separator)
  const normalized = str
    .replace(/\./g, "") // Remove thousand separators
    .replace(/,/g, "."); // Replace decimal comma with dot
  
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Parse German date format to Date object
 * "31.12.2024" → Date
 */
function parseGermanDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Month is 0-indexed
  const year = parseInt(parts[2]);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  return new Date(year, month, day);
}

/**
 * Get device icon based on type
 */
function getDeviceIcon(deviceType: string): StaticImageData {
  const type = deviceType.toLowerCase();
  
  if (type.includes("heat") || type.includes("wärme") || type.includes("wmz")) {
    return heater;
  }
  if (type.includes("wwat") || type.includes("warmwasser")) {
    return hot_water;
  }
  if (type.includes("water") || type.includes("wasser") || type.includes("kaltwasser")) {
    return cold_water;
  }
  
  return pipe_water;
}

/**
 * Calculate consumption change percentage between two periods
 * Uses IV columns from Engelmann CSV format:
 * - IV,0,0,0,Wh,E = current cumulative reading
 * - IV,1,0,0,Wh,E = end of last month snapshot  
 * - IV,3,0,0,Wh,E = end of 2 months ago snapshot (index varies by CSV version)
 */
export function calculateConsumptionChange(device: MeterReadingType): {
  percentageChange: number;
  currentValue: number;
  previousValue: number;
} | null {
  // Get values from actual IV columns (Engelmann CSV format)
  const currentCumulative = parseGermanNumber(device["IV,0,0,0,Wh,E"]);
  const lastMonthEnd = parseGermanNumber(device["IV,1,0,0,Wh,E"]);
  
  // Try both IV,2 and IV,3 for 2-months-ago value (CSV format varies)
  const twoMonthsAgoEnd = parseGermanNumber(device["IV,3,0,0,Wh,E"]) 
                        ?? parseGermanNumber(device["IV,2,0,0,Wh,E"]);
  
  // Need at least current and last month values
  if (currentCumulative === null || lastMonthEnd === null) return null;
  
  // Calculate actual consumption (delta between cumulative values)
  const currentMonthConsumption = currentCumulative - lastMonthEnd;
  
  // If we have 2-months-ago data, calculate previous month consumption
  let previousMonthConsumption: number;
  if (twoMonthsAgoEnd !== null && lastMonthEnd > twoMonthsAgoEnd) {
    previousMonthConsumption = lastMonthEnd - twoMonthsAgoEnd;
  } else {
    // Fallback: can't calculate change without previous month data
    return null;
  }
  
  // Avoid division by zero
  if (previousMonthConsumption === 0) return null;
  
  const change = ((currentMonthConsumption - previousMonthConsumption) / previousMonthConsumption) * 100;
  
  return {
    percentageChange: change,
    currentValue: currentMonthConsumption,
    previousValue: previousMonthConsumption
  };
}

/**
 * Detect consumption anomalies (±30% change)
 */
export function detectConsumptionAnomaly(device: MeterReadingType): ConsumptionNotification | null {
  const change = calculateConsumptionChange(device);
  
  if (!change) return null;
  
  const absChange = Math.abs(change.percentageChange);
  const meterId = device.ID || device["Number Meter"];
  const deviceType = device["Device Type"];
  
  // Unit is Wh for heat meters (from IV columns)
  const unit = deviceType === "Heat" ? "Wh" : "m³";
  
  // Only alert if change is >= 30%
  if (absChange < 30) return null;
  
  const isIncrease = change.percentageChange > 0;
  const deviceTypeLabel = deviceType === "WWater" ? "Warmwasser" :
                         deviceType === "Water" ? "Kaltwasser" :
                         deviceType === "Heat" ? "Wärme" :
                         deviceType;
  
  // Format values appropriately (kWh for heat, m³ for water)
  const formatValue = (val: number) => {
    if (deviceType === "Heat") {
      return val >= 1000 ? `${(val / 1000).toFixed(1)} kWh` : `${val.toFixed(0)} Wh`;
    }
    return `${val.toFixed(3)} ${unit}`;
  };
  
  if (isIncrease) {
    return {
      leftIcon: getDeviceIcon(deviceType),
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: "#F7E7D5",
      title: `Verbrauchsanstieg - Zähler ${meterId}`,
      subtitle: `${deviceTypeLabel}verbrauch ist um ${absChange.toFixed(0)}% angestiegen (von ${formatValue(change.previousValue)} auf ${formatValue(change.currentValue)})`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: absChange >= 50 ? "high" : "medium"
    };
  } else {
    return {
      leftIcon: getDeviceIcon(deviceType),
      rightIcon: blue_info,
      leftBg: "#E7E8EA",
      rightBg: "#E5EBF5",
      title: `Verbrauchsrückgang - Zähler ${meterId}`,
      subtitle: `${deviceTypeLabel}verbrauch ist um ${absChange.toFixed(0)}% gesunken (von ${formatValue(change.previousValue)} auf ${formatValue(change.currentValue)})`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: absChange >= 50 ? "medium" : "low"
    };
  }
}

/**
 * Detect zero consumption (3+ months with no usage)
 * Uses IV columns from Engelmann CSV format
 */
export function detectZeroConsumption(device: MeterReadingType): ConsumptionNotification | null {
  // Get cumulative values from IV columns
  const current = parseGermanNumber(device["IV,0,0,0,Wh,E"]);
  const month1End = parseGermanNumber(device["IV,1,0,0,Wh,E"]);
  const month2End = parseGermanNumber(device["IV,3,0,0,Wh,E"]) 
                  ?? parseGermanNumber(device["IV,2,0,0,Wh,E"]);
  const month3End = parseGermanNumber(device["IV,5,0,0,Wh,E"]) 
                  ?? parseGermanNumber(device["IV,4,0,0,Wh,E"]);
  
  // Need at least 3 months of data
  if (current === null || month1End === null || month2End === null || month3End === null) {
    return null;
  }
  
  // Calculate consumption for each month
  const consumption1 = current - month1End;      // Current month
  const consumption2 = month1End - month2End;    // Last month
  const consumption3 = month2End - month3End;    // 2 months ago
  
  // All three months have zero consumption
  if (consumption1 === 0 && consumption2 === 0 && consumption3 === 0) {
    const meterId = device.ID || device["Number Meter"];
    const deviceType = device["Device Type"];
    const deviceTypeLabel = deviceType === "WWater" ? "Warmwasserzähler" :
                           deviceType === "Water" ? "Kaltwasserzähler" :
                           deviceType === "Heat" ? "Wärmezähler" :
                           deviceType;
    
    return {
      leftIcon: getDeviceIcon(deviceType),
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: "#F7E7D5",
      title: `Kein Verbrauch - Zähler ${meterId}`,
      subtitle: `${deviceTypeLabel} meldet seit 3 Monaten keinen Verbrauch - mögliche Blockade oder Defekt`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: "high"
    };
  }
  
  return null;
}

/**
 * Detect missing data (no recent readings)
 */
export function detectNoData(device: MeterReadingType): ConsumptionNotification | null {
  // Check Actual Date (NEW format) or IV,0,0,0,,Date/Time (OLD format)
  const actualDate = device["Actual Date"] || device["Raw Date"] || device["IV,0,0,0,,Date/Time"];
  
  if (!actualDate) return null;
  
  const lastReading = parseGermanDate(actualDate);
  
  if (!lastReading) return null;
  
  const now = new Date();
  const daysSinceReading = Math.floor((now.getTime() - lastReading.getTime()) / (1000 * 60 * 60 * 24));
  
  // Alert if no data for 7+ days
  if (daysSinceReading >= 7) {
    const meterId = device.ID || device["Number Meter"];
    const deviceType = device["Device Type"];
    const deviceTypeLabel = deviceType === "WWater" ? "Warmwasserzähler" :
                           deviceType === "Water" ? "Kaltwasserzähler" :
                           deviceType === "Heat" ? "Wärmezähler" :
                           deviceType;
    
    return {
      leftIcon: getDeviceIcon(deviceType),
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: daysSinceReading >= 30 ? "#FFE5E5" : "#F7E7D5",
      title: `Keine Daten - Zähler ${meterId}`,
      subtitle: `${deviceTypeLabel} sendet seit ${daysSinceReading} Tagen keine Daten`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: daysSinceReading >= 30 ? "critical" : "high"
    };
  }
  
  return null;
}

/**
 * Get all consumption-related notifications for a device
 */
export function analyzeConsumption(device: MeterReadingType): ConsumptionNotification[] {
  const notifications: ConsumptionNotification[] = [];
  
  // Check for consumption anomalies (±30%)
  const anomaly = detectConsumptionAnomaly(device);
  if (anomaly) {
    notifications.push(anomaly);
  }
  
  // Check for zero consumption (only if no anomaly detected)
  if (!anomaly) {
    const zeroConsumption = detectZeroConsumption(device);
    if (zeroConsumption) {
      notifications.push(zeroConsumption);
    }
  }
  
  // Check for missing data
  const noData = detectNoData(device);
  if (noData) {
    notifications.push(noData);
  }
  
  return notifications;
}

/**
 * Get all consumption notifications for parsed data
 */
export function getConsumptionNotifications(parsedData: {
  data: MeterReadingType[];
}): ConsumptionNotification[] {
  const notifications: ConsumptionNotification[] = [];
  
  for (const device of parsedData.data) {
    const deviceNotifications = analyzeConsumption(device);
    notifications.push(...deviceNotifications);
  }
  
  return notifications;
}

