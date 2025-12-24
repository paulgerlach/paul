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
  const normalized = str
    .replace(/\./g, "") // Remove thousand separators
    .replace(/,/g, "."); // Replace decimal comma with dot
  
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Get device icon based on type
 */
function getDeviceIcon(deviceType: string): StaticImageData {
  const type = deviceType.toLowerCase();
  
  if (type.includes("heat") || type.includes("wärme") || type.includes("wmz") || type.includes("heizkostenverteiler")) {
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
 * Get unit label based on device type (in German)
 */
function getUnitLabel(deviceType: string): string {
  const type = deviceType.toLowerCase();
  if (type.includes("heat") || type.includes("wärme") || type.includes("wmz") || type.includes("heizkostenverteiler") || type.includes("elec") || type.includes("strom")) {
    return "Wh";
  }
  if (type.includes("water") || type.includes("wasser")) {
    return "m³";
  }
  return "";
}

/**
 * Get German device type label
 */
function getDeviceTypeLabel(deviceType: string): string {
  switch (deviceType) {
    case "WWater":
    case "Warmwasserzähler":
      return "Warmwasser";
    case "Water":
    case "Kaltwasserzähler":
      return "Kaltwasser";
    case "Heat":
    case "WMZ Rücklauf":
    case "Heizkostenverteiler":
    case "Wärmemengenzähler":
      return "Wärme";
    case "Elec":
    case "Stromzähler":
      return "Strom";
    default:
      return deviceType;
  }
}

/**
 * ============================================================================
 * ROOT FIX: Extract historical cumulative values from IV,x columns
 * 
 * The CSV data embeds historical readings in columns like:
 * - Heat meters: IV,0,0,0,Wh,E (current), IV,2,0,0,Wh,E (2 months ago), etc.
 * - Water meters: IV,0,0,0,m^3,Vol (current), IV,2,0,0,m^3,Vol, IV,3,0,0,m^3,Vol, etc.
 * 
 * These are CUMULATIVE values, so consumption = IV[n] - IV[n+1]
 * ============================================================================
 */

/**
 * Extract all historical energy values from a heat meter device
 * Returns array of cumulative values from newest to oldest
 */
function extractHeatHistoricalValues(device: MeterReadingType): number[] {
  const values: number[] = [];
  
  // Heat meters use IV,0, IV,1, IV,3, IV,5, IV,7... for Wh,E (ODD indices after 0 and 1)
  // Verified against actual CSV data from Engelmann meters
  const indices = [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
  
  for (const i of indices) {
    const key = `IV,${i},0,0,Wh,E` as keyof MeterReadingType;
    const rawValue = device[key];
    const value = parseGermanNumber(rawValue);
    
    // Filter out 0 values for historical columns (IV,1 and beyond) as they indicate "no data"
    // IV,0 can be 0 legitimately (no consumption yet this month)
    const isHistoricalZero = i > 0 && value === 0;
    
    if (value !== null && value >= 0 && value < 100000000 && !isHistoricalZero) {
      values.push(value);
    }
  }
  
  return values;
}

/**
 * Extract all historical volume values from a water meter device
 * Returns array of cumulative values from newest to oldest
 */
function extractWaterHistoricalValues(device: MeterReadingType): number[] {
  const values: number[] = [];
  
  // Water meters use IV,0, IV,2, IV,3, IV,4, IV,5... for m^3,Vol
  const indices = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  
  for (const i of indices) {
    const key = `IV,${i},0,0,m^3,Vol` as keyof MeterReadingType;
    const rawValue = device[key];
    const value = parseGermanNumber(rawValue);
    
    if (value !== null && value >= 0 && value < 100000) {
      values.push(value);
    }
  }
  
  return values;
}

/**
 * Calculate consumption deltas from cumulative historical values
 * Input: [current, 1-month-ago, 2-months-ago, ...]
 * Output: [current-month-consumption, previous-month-consumption, ...]
 */
function calculateConsumptionDeltas(cumulativeValues: number[]): number[] {
  if (cumulativeValues.length < 2) return [];
  
  const deltas: number[] = [];
  
  for (let i = 0; i < cumulativeValues.length - 1; i++) {
    const current = cumulativeValues[i];
    const previous = cumulativeValues[i + 1];
    const delta = current - previous;
    
    // Only include positive deltas (negative would indicate meter reset or error)
    if (delta >= 0) {
      deltas.push(delta);
    }
  }
  
  return deltas;
}

/**
 * ============================================================================
 * MAIN FUNCTION: Calculate consumption change from embedded IV,x columns
 * This is the ROOT FIX - reads from actual data fields that exist
 * ============================================================================
 */
export function calculateConsumptionChangeFromIVColumns(device: MeterReadingType): {
  percentageChange: number;
  currentConsumption: number;
  previousConsumption: number;
  unit: string;
} | null {
  const deviceType = device["Device Type"];
  
  // Determine if this is a heat/energy or water/volume meter
  const isHeatMeter = deviceType === "Heat" || deviceType === "WMZ Rücklauf" || 
                      deviceType === "Heizkostenverteiler" || deviceType === "Wärmemengenzähler" ||
                      deviceType === "Elec" || deviceType === "Stromzähler";
  
  const isWaterMeter = deviceType === "Water" || deviceType === "WWater" || 
                       deviceType === "Kaltwasserzähler" || deviceType === "Warmwasserzähler";
  
  if (!isHeatMeter && !isWaterMeter) return null;
  
  // Extract cumulative historical values from IV columns
  const cumulativeValues = isHeatMeter 
    ? extractHeatHistoricalValues(device)
    : extractWaterHistoricalValues(device);
  
  if (cumulativeValues.length < 2) return null;
  
  // Calculate consumption deltas
  const consumptionDeltas = calculateConsumptionDeltas(cumulativeValues);
  
  if (consumptionDeltas.length < 2) return null;
  
  // Get the two most recent consumption values
  const currentConsumption = consumptionDeltas[0];
  const previousConsumption = consumptionDeltas[1];
  
  // Avoid division by zero
  if (previousConsumption === 0) {
    // If previous was 0 and current > 0, that's infinite increase
    // Only trigger if current is significant
    if (currentConsumption > 0) {
      return {
        percentageChange: 100, // Cap at 100% for "from zero" scenarios
        currentConsumption,
        previousConsumption,
        unit: isHeatMeter ? "Wh" : "m³"
      };
    }
    return null;
  }
  
  const percentageChange = ((currentConsumption - previousConsumption) / previousConsumption) * 100;
  
  return {
    percentageChange,
    currentConsumption,
    previousConsumption,
    unit: isHeatMeter ? "Wh" : "m³"
  };
}

/**
 * Detect consumption anomalies (±30% change) using IV,x columns
 * This is the SURGICAL FIX for consumption spike detection
 */
export function detectConsumptionAnomaly(device: MeterReadingType): ConsumptionNotification | null {
  const change = calculateConsumptionChangeFromIVColumns(device);
  
  if (!change) return null;
  
  const absChange = Math.abs(change.percentageChange);
  const meterId = device.ID || device["Number Meter"];
  const deviceType = device["Device Type"];
  
  // Only alert if change is >= 30%
  if (absChange < 30) return null;
  
  const isIncrease = change.percentageChange > 0;
  const deviceTypeLabel = getDeviceTypeLabel(deviceType);
  
  // Format values appropriately based on magnitude
  const formatValue = (val: number, unit: string): string => {
    if (unit === "Wh" && val >= 1000) {
      return `${(val / 1000).toFixed(1)} kWh`;
    }
    if (unit === "m³") {
      return `${val.toFixed(3)} m³`;
    }
    return `${val.toFixed(0)} ${unit}`;
  };
  
  if (isIncrease) {
    return {
      leftIcon: getDeviceIcon(deviceType),
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: "#F7E7D5",
      title: `Verbrauchsanstieg - Zähler ${meterId}`,
      subtitle: `${deviceTypeLabel}verbrauch ist um ${absChange.toFixed(0)}% angestiegen (von ${formatValue(change.previousConsumption, change.unit)} auf ${formatValue(change.currentConsumption, change.unit)})`,
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
      subtitle: `${deviceTypeLabel}verbrauch ist um ${absChange.toFixed(0)}% gesunken (von ${formatValue(change.previousConsumption, change.unit)} auf ${formatValue(change.currentConsumption, change.unit)})`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: absChange >= 50 ? "medium" : "low"
    };
  }
}

/**
 * Detect zero consumption (3+ periods with no usage) using IV,x columns
 */
export function detectZeroConsumption(device: MeterReadingType): ConsumptionNotification | null {
  const deviceType = device["Device Type"];
  
  const isHeatMeter = deviceType === "Heat" || deviceType === "WMZ Rücklauf" || 
                      deviceType === "Heizkostenverteiler" || deviceType === "Wärmemengenzähler";
  
  const isWaterMeter = deviceType === "Water" || deviceType === "WWater" || 
                       deviceType === "Kaltwasserzähler" || deviceType === "Warmwasserzähler";
  
  if (!isHeatMeter && !isWaterMeter) return null;
  
  const cumulativeValues = isHeatMeter 
    ? extractHeatHistoricalValues(device)
    : extractWaterHistoricalValues(device);
  
  if (cumulativeValues.length < 4) return null; // Need 4 readings for 3 consumption periods
  
  const consumptionDeltas = calculateConsumptionDeltas(cumulativeValues);
  
  if (consumptionDeltas.length < 3) return null;
  
  // Check if first 3 consumption periods are all zero
  const lastThree = consumptionDeltas.slice(0, 3);
  if (lastThree.every(c => c === 0)) {
    const meterId = device.ID || device["Number Meter"];
    const deviceTypeLabel = getDeviceTypeLabel(deviceType);
    
    return {
      leftIcon: getDeviceIcon(deviceType),
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: "#F7E7D5",
      title: `Kein Verbrauch - Zähler ${meterId}`,
      subtitle: `${deviceTypeLabel}zähler meldet seit 3 Monaten keinen Verbrauch - mögliche Blockade oder Defekt`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: "high"
    };
  }
  
  return null;
}

/**
 * Detect potential leakage from constantly high consumption pattern
 * Only for water meters (heat meters have seasonal variation)
 */
export function detectConstantHighConsumption(device: MeterReadingType): ConsumptionNotification | null {
  const deviceType = device["Device Type"];
  
  // Only for water meters
  const isWaterMeter = deviceType === "Water" || deviceType === "WWater" || 
                       deviceType === "Kaltwasserzähler" || deviceType === "Warmwasserzähler";
  
  if (!isWaterMeter) return null;
  
  const cumulativeValues = extractWaterHistoricalValues(device);
  
  if (cumulativeValues.length < 4) return null;
  
  const consumptionDeltas = calculateConsumptionDeltas(cumulativeValues);
  
  if (consumptionDeltas.length < 3) return null;
  
  // Check last 3 consumption periods
  const lastThree = consumptionDeltas.slice(0, 3);
  const avg = lastThree.reduce((a, b) => a + b, 0) / 3;
  
  if (avg < 0.5) return null; // Too low to be meaningful for leakage
  
  // Check if consumption is constantly high with low variation
  const allHigh = lastThree.every(val => val > avg * 0.7);
  const maxVal = Math.max(...lastThree);
  const minVal = Math.min(...lastThree);
  const isConstant = avg > 0 && (maxVal - minVal) / avg < 0.3;
  
  if (allHigh && isConstant) {
    const meterId = device.ID || device["Number Meter"];
    const deviceTypeLabel = getDeviceTypeLabel(deviceType);
    
    return {
      leftIcon: getDeviceIcon(deviceType),
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: "#FFE5E5", // Critical - red background
      title: `Mögliche Leckage - Zähler ${meterId}`,
      subtitle: `${deviceTypeLabel}zähler zeigt dauerhaft hohen Verbrauch (Ø ${avg.toFixed(2)} m³/Monat) - bitte Leitungen prüfen`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: "critical"
    };
  }
  
  return null;
}

/**
 * Get all consumption-related notifications for a single device
 */
export function analyzeConsumption(device: MeterReadingType): ConsumptionNotification[] {
  const notifications: ConsumptionNotification[] = [];
  
  // 1. Check for consumption anomalies (±30%)
  const anomaly = detectConsumptionAnomaly(device);
  if (anomaly) {
    notifications.push(anomaly);
  }
  
  // 2. Check for zero consumption (only if no anomaly detected)
  if (!anomaly) {
    const zeroConsumption = detectZeroConsumption(device);
    if (zeroConsumption) {
      notifications.push(zeroConsumption);
    }
  }
  
  // 3. Check for potential leakage (water meters only)
  const leakage = detectConstantHighConsumption(device);
  if (leakage) {
    notifications.push(leakage);
  }
  
  return notifications;
}

/**
 * Get all consumption notifications for parsed data
 * ROOT FIX: Uses IV,x columns from each device record
 */
export function getConsumptionNotifications(parsedData: {
  data: MeterReadingType[];
}): ConsumptionNotification[] {
  const notifications: ConsumptionNotification[] = [];
  const processedDeviceIds = new Set<string>();
  
  for (const device of parsedData.data) {
    const deviceId = device.ID?.toString() || device["Number Meter"]?.toString() || "";
    
    // Skip if we've already processed this device (avoid duplicates from multiple CSV rows)
    if (processedDeviceIds.has(deviceId)) continue;
    processedDeviceIds.add(deviceId);
    
    // Analyze consumption using IV,x columns
    const deviceNotifications = analyzeConsumption(device);
    notifications.push(...deviceNotifications);
  }
  
  return notifications;
}

// ============================================================================
// LEGACY EXPORTS (kept for backwards compatibility, but they use the new logic)
// ============================================================================

export function calculateConsumptionChange(device: MeterReadingType) {
  return calculateConsumptionChangeFromIVColumns(device);
}

export function calculateConsumptionChangeFromReadings(readings: MeterReadingType[]) {
  // For backwards compatibility - just analyze the first device
  if (readings.length > 0) {
    return calculateConsumptionChangeFromIVColumns(readings[0]);
  }
  return null;
}

export function detectConsumptionAnomalyFromReadings(readings: MeterReadingType[]) {
  if (readings.length > 0) {
    return detectConsumptionAnomaly(readings[0]);
  }
  return null;
}

export function detectZeroConsumptionFromReadings(readings: MeterReadingType[]) {
  if (readings.length > 0) {
    return detectZeroConsumption(readings[0]);
  }
  return null;
}

export function detectConstantHighFromReadings(readings: MeterReadingType[]) {
  if (readings.length > 0) {
    return detectConstantHighConsumption(readings[0]);
  }
  return null;
}

export function detectNoData(device: MeterReadingType): ConsumptionNotification | null {
  // This function checks for stale data - keeping for backwards compatibility
  // but the main consumption analysis now uses IV,x columns
  return null;
}
