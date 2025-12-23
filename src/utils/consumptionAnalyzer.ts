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
  
  // Handle different date formats
  let parts: string[];
  if (dateStr.includes("-")) {
    // Format: "29-10-2025"
    parts = dateStr.split("-");
  } else if (dateStr.includes(".")) {
    // Format: "29.10.2025" or "29.10.2025 09:56..."
    parts = dateStr.split(" ")[0].split(".");
  } else {
    return null;
  }
  
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
 * Parse reading date from device data (supports both old and new formats)
 */
function getReadingDate(device: MeterReadingType): Date | null {
  const oldFormatDate = device["IV,0,0,0,,Date/Time"];
  const newActualDate = device["Actual Date"];
  const newRawDate = device["Raw Date"];
  
  if (oldFormatDate && typeof oldFormatDate === "string") {
    return parseGermanDate(oldFormatDate.split(" ")[0]);
  }
  if (newActualDate && typeof newActualDate === "string") {
    return parseGermanDate(newActualDate);
  }
  if (newRawDate && typeof newRawDate === "string") {
    return parseGermanDate(newRawDate);
  }
  
  return null;
}

/**
 * Get cumulative reading value from device (energy or volume)
 */
function getCumulativeValue(device: MeterReadingType): number | null {
  const deviceType = device["Device Type"];
  
  // For heat meters, use energy value
  if (deviceType === "Heat" || deviceType === "WMZ Rücklauf" || deviceType === "Heizkostenverteiler" || deviceType === "Wärmemengenzähler") {
    const oldEnergy = device["IV,0,0,0,Wh,E"];
    const newEnergy = device["Actual Energy / HCA"];
    const value = newEnergy !== undefined ? newEnergy : oldEnergy;
    return parseGermanNumber(value);
  }
  
  // For water meters, use volume value
  if (deviceType === "Water" || deviceType === "WWater" || deviceType === "Kaltwasserzähler" || deviceType === "Warmwasserzähler") {
    const oldVolume = device["IV,0,0,0,m^3,Vol"];
    const newVolume = device["Actual Volume"];
    const value = newVolume !== undefined ? newVolume : oldVolume;
    return parseGermanNumber(value);
  }
  
  // For electricity, use energy
  if (deviceType === "Elec" || deviceType === "Stromzähler") {
    const oldEnergy = device["IV,0,0,0,Wh,E"];
    const newEnergy = device["Actual Energy / HCA"];
    const value = newEnergy !== undefined ? newEnergy : oldEnergy;
    return parseGermanNumber(value);
  }
  
  return null;
}

/**
 * Calculate consumption change percentage between two periods
 * IMPROVED: Now calculates from raw cumulative readings if Monthly Values unavailable
 */
export function calculateConsumptionChange(device: MeterReadingType): {
  percentageChange: number;
  currentValue: number;
  previousValue: number;
} | null {
  // FIRST: Try the Monthly Value fields (if available)
  const value1 = parseGermanNumber(device["Monthly Value 1"]); // Current month
  const value2 = parseGermanNumber(device["Monthly Value 2"]); // Previous month
  
  if (value1 !== null && value2 !== null && value2 !== 0) {
    const change = ((value1 - value2) / value2) * 100;
    return {
      percentageChange: change,
      currentValue: value1,
      previousValue: value2
    };
  }
  
  // Monthly values not available - will be calculated from grouped device data
  // in calculateConsumptionChangeFromReadings()
  return null;
}

/**
 * Calculate consumption change from multiple readings of the same device
 * Groups readings by date and calculates deltas
 */
export function calculateConsumptionChangeFromReadings(
  readings: MeterReadingType[]
): {
  percentageChange: number;
  currentConsumption: number;
  previousConsumption: number;
  deviceId: string;
  deviceType: string;
} | null {
  if (!readings || readings.length < 3) return null; // Need at least 3 readings to calculate 2 periods
  
  const deviceId = readings[0].ID?.toString() || readings[0]["Number Meter"]?.toString() || "";
  const deviceType = readings[0]["Device Type"];
  
  // Parse and sort readings by date
  const sortedReadings = readings
    .map(r => ({
      date: getReadingDate(r),
      value: getCumulativeValue(r),
      reading: r
    }))
    .filter(r => r.date !== null && r.value !== null && r.value >= 0 && r.value < 10000000)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());
  
  if (sortedReadings.length < 3) return null;
  
  // Calculate consumption between consecutive readings
  const consumptions: { date: Date; consumption: number }[] = [];
  for (let i = 1; i < sortedReadings.length; i++) {
    const prev = sortedReadings[i - 1];
    const curr = sortedReadings[i];
    const consumption = curr.value! - prev.value!;
    
    if (consumption >= 0) {
      consumptions.push({
        date: curr.date!,
        consumption
      });
    }
  }
  
  if (consumptions.length < 2) return null;
  
  // Get the two most recent consumption values
  const currentConsumption = consumptions[consumptions.length - 1].consumption;
  const previousConsumption = consumptions[consumptions.length - 2].consumption;
  
  if (previousConsumption === 0) return null; // Avoid division by zero
  
  const percentageChange = ((currentConsumption - previousConsumption) / previousConsumption) * 100;
  
  return {
    percentageChange,
    currentConsumption,
    previousConsumption,
    deviceId,
    deviceType
  };
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
 * Detect consumption anomalies (±30% change)
 * IMPROVED: Works with both Monthly Values and calculated consumption from raw readings
 */
export function detectConsumptionAnomaly(device: MeterReadingType): ConsumptionNotification | null {
  const change = calculateConsumptionChange(device);
  
  if (!change) return null;
  
  const absChange = Math.abs(change.percentageChange);
  const meterId = device.ID || device["Number Meter"];
  const deviceType = device["Device Type"];
  const unit = device["Monthly Unit 1"] || getUnitLabel(deviceType);
  
  // Only alert if change is >= 30%
  if (absChange < 30) return null;
  
  const isIncrease = change.percentageChange > 0;
  const deviceTypeLabel = getDeviceTypeLabel(deviceType);
  
  if (isIncrease) {
    return {
      leftIcon: getDeviceIcon(deviceType),
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: "#F7E7D5",
      title: `Verbrauchsanstieg - Zähler ${meterId}`,
      subtitle: `${deviceTypeLabel}verbrauch ist um ${absChange.toFixed(0)}% angestiegen (von ${change.previousValue.toFixed(3)} auf ${change.currentValue.toFixed(3)} ${unit})`,
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
      subtitle: `${deviceTypeLabel}verbrauch ist um ${absChange.toFixed(0)}% gesunken (von ${change.previousValue.toFixed(3)} auf ${change.currentValue.toFixed(3)} ${unit})`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: absChange >= 50 ? "medium" : "low"
    };
  }
}

/**
 * Detect consumption anomalies from grouped device readings
 * Used when Monthly Values are not available
 */
export function detectConsumptionAnomalyFromReadings(
  readings: MeterReadingType[]
): ConsumptionNotification | null {
  const change = calculateConsumptionChangeFromReadings(readings);
  
  if (!change) return null;
  
  const absChange = Math.abs(change.percentageChange);
  const unit = getUnitLabel(change.deviceType);
  
  // Only alert if change is >= 30%
  if (absChange < 30) return null;
  
  const isIncrease = change.percentageChange > 0;
  const deviceTypeLabel = getDeviceTypeLabel(change.deviceType);
  
  if (isIncrease) {
    return {
      leftIcon: getDeviceIcon(change.deviceType),
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: "#F7E7D5",
      title: `Verbrauchsanstieg - Zähler ${change.deviceId}`,
      subtitle: `${deviceTypeLabel}verbrauch ist um ${absChange.toFixed(0)}% angestiegen (von ${change.previousConsumption.toFixed(2)} auf ${change.currentConsumption.toFixed(2)} ${unit})`,
      meterId: parseInt(change.deviceId) || undefined,
      severity: absChange >= 50 ? "high" : "medium"
    };
  } else {
    return {
      leftIcon: getDeviceIcon(change.deviceType),
      rightIcon: blue_info,
      leftBg: "#E7E8EA",
      rightBg: "#E5EBF5",
      title: `Verbrauchsrückgang - Zähler ${change.deviceId}`,
      subtitle: `${deviceTypeLabel}verbrauch ist um ${absChange.toFixed(0)}% gesunken (von ${change.previousConsumption.toFixed(2)} auf ${change.currentConsumption.toFixed(2)} ${unit})`,
      meterId: parseInt(change.deviceId) || undefined,
      severity: absChange >= 50 ? "medium" : "low"
    };
  }
}

/**
 * Detect zero consumption (3+ periods with no usage)
 * IMPROVED: Now checks Monthly Values first, then falls back to raw readings
 */
export function detectZeroConsumption(device: MeterReadingType): ConsumptionNotification | null {
  // Check last 3 months from Monthly Values
  const value1 = parseGermanNumber(device["Monthly Value 1"]);
  const value2 = parseGermanNumber(device["Monthly Value 2"]);
  const value3 = parseGermanNumber(device["Monthly Value 3"]);
  
  const hasMonthlyValues = value1 !== null && value2 !== null && value3 !== null;
  
  // All three months have zero consumption
  if (hasMonthlyValues && value1 === 0 && value2 === 0 && value3 === 0) {
    const meterId = device.ID || device["Number Meter"];
    const deviceType = device["Device Type"];
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
 * Detect zero consumption from grouped device readings
 * Used when Monthly Values are not available
 */
export function detectZeroConsumptionFromReadings(
  readings: MeterReadingType[]
): ConsumptionNotification | null {
  if (!readings || readings.length < 4) return null; // Need at least 4 readings for 3 consumption periods
  
  const deviceId = readings[0].ID?.toString() || readings[0]["Number Meter"]?.toString() || "";
  const deviceType = readings[0]["Device Type"];
  
  // Parse and sort readings by date
  const sortedReadings = readings
    .map(r => ({
      date: getReadingDate(r),
      value: getCumulativeValue(r),
    }))
    .filter(r => r.date !== null && r.value !== null && r.value >= 0)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());
  
  if (sortedReadings.length < 4) return null;
  
  // Calculate consumption between consecutive readings
  const consumptions: number[] = [];
  for (let i = 1; i < sortedReadings.length; i++) {
    const consumption = sortedReadings[i].value! - sortedReadings[i - 1].value!;
    if (consumption >= 0) {
      consumptions.push(consumption);
    }
  }
  
  // Check if last 3 consumption periods are all zero
  if (consumptions.length >= 3) {
    const lastThree = consumptions.slice(-3);
    if (lastThree.every(c => c === 0)) {
      const deviceTypeLabel = getDeviceTypeLabel(deviceType);
      
      return {
        leftIcon: getDeviceIcon(deviceType),
        rightIcon: alert_triangle,
        leftBg: "#E7E8EA",
        rightBg: "#F7E7D5",
        title: `Kein Verbrauch - Zähler ${deviceId}`,
        subtitle: `${deviceTypeLabel}zähler meldet seit 3 Messperioden keinen Verbrauch - mögliche Blockade oder Defekt`,
        meterId: parseInt(deviceId) || undefined,
        severity: "high"
      };
    }
  }
  
  return null;
}

/**
 * Detect potential leakage from constantly high consumption pattern
 * As per requirement: "Check if consumption is consistently HIGH across multiple periods"
 */
export function detectConstantHighConsumption(device: MeterReadingType): ConsumptionNotification | null {
  // Check last 3 months from Monthly Values
  const value1 = parseGermanNumber(device["Monthly Value 1"]);
  const value2 = parseGermanNumber(device["Monthly Value 2"]);
  const value3 = parseGermanNumber(device["Monthly Value 3"]);
  
  if (value1 === null || value2 === null || value3 === null) return null;
  if (value1 === 0 && value2 === 0 && value3 === 0) return null; // No consumption = no leakage
  
  const values = [value1, value2, value3];
  const avg = values.reduce((a, b) => a + b, 0) / 3;
  
  // Skip if average is too low (avoid false positives)
  if (avg < 0.1) return null;
  
  // Check if ALL values are significantly above average (constant high = potential leakage)
  // Threshold: All values > average * 1.3 AND all values within 20% of each other
  const allHigh = values.every(val => val > avg * 0.8); // All above 80% of average
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const isConstant = (maxVal - minVal) / avg < 0.3; // Variation less than 30%
  
  // Only for water meters (heat meters have seasonal variation)
  const deviceType = device["Device Type"];
  const isWaterMeter = deviceType === "Water" || deviceType === "WWater" || 
                       deviceType === "Kaltwasserzähler" || deviceType === "Warmwasserzähler";
  
  if (isWaterMeter && allHigh && isConstant && avg > 0.5) {
    const meterId = device.ID || device["Number Meter"];
    const deviceTypeLabel = getDeviceTypeLabel(deviceType);
    const unit = device["Monthly Unit 1"] || "m³";
    
    return {
      leftIcon: getDeviceIcon(deviceType),
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: "#FFE5E5", // Critical - red background
      title: `Mögliche Leckage - Zähler ${meterId}`,
      subtitle: `${deviceTypeLabel}zähler zeigt dauerhaft hohen Verbrauch (Ø ${avg.toFixed(2)} ${unit}/Monat) - bitte Leitungen prüfen`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: "critical"
    };
  }
  
  return null;
}

/**
 * Detect potential leakage from grouped device readings
 */
export function detectConstantHighFromReadings(
  readings: MeterReadingType[]
): ConsumptionNotification | null {
  if (!readings || readings.length < 4) return null;
  
  const deviceId = readings[0].ID?.toString() || readings[0]["Number Meter"]?.toString() || "";
  const deviceType = readings[0]["Device Type"];
  
  // Only for water meters
  const isWaterMeter = deviceType === "Water" || deviceType === "WWater" || 
                       deviceType === "Kaltwasserzähler" || deviceType === "Warmwasserzähler";
  if (!isWaterMeter) return null;
  
  // Parse and sort readings by date
  const sortedReadings = readings
    .map(r => ({
      date: getReadingDate(r),
      value: getCumulativeValue(r),
    }))
    .filter(r => r.date !== null && r.value !== null && r.value >= 0)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());
  
  if (sortedReadings.length < 4) return null;
  
  // Calculate consumption between consecutive readings
  const consumptions: number[] = [];
  for (let i = 1; i < sortedReadings.length; i++) {
    const consumption = sortedReadings[i].value! - sortedReadings[i - 1].value!;
    if (consumption >= 0) {
      consumptions.push(consumption);
    }
  }
  
  if (consumptions.length < 3) return null;
  
  // Check last 3 consumption periods
  const lastThree = consumptions.slice(-3);
  const avg = lastThree.reduce((a, b) => a + b, 0) / 3;
  
  if (avg < 0.01) return null; // Too low to be meaningful
  
  // Check if consumption is constantly high with low variation
  const allHigh = lastThree.every(val => val > avg * 0.8);
  const maxVal = Math.max(...lastThree);
  const minVal = Math.min(...lastThree);
  const isConstant = avg > 0 && (maxVal - minVal) / avg < 0.3;
  
  if (allHigh && isConstant && avg > 0.1) {
    const deviceTypeLabel = getDeviceTypeLabel(deviceType);
    const unit = getUnitLabel(deviceType);
    
    return {
      leftIcon: getDeviceIcon(deviceType),
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: "#FFE5E5",
      title: `Mögliche Leckage - Zähler ${deviceId}`,
      subtitle: `${deviceTypeLabel}zähler zeigt dauerhaft hohen Verbrauch (Ø ${avg.toFixed(3)} ${unit}/Periode) - bitte Leitungen prüfen`,
      meterId: parseInt(deviceId) || undefined,
      severity: "critical"
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
 * IMPROVED: Groups devices by ID and calculates consumption from raw readings
 * when Monthly Values are not available
 */
export function getConsumptionNotifications(parsedData: {
  data: MeterReadingType[];
}): ConsumptionNotification[] {
  const notifications: ConsumptionNotification[] = [];
  const processedDeviceIds = new Set<string>();
  
  // First pass: Try to get notifications from individual devices (Monthly Values)
  for (const device of parsedData.data) {
    const deviceNotifications = analyzeConsumption(device);
    
    // Check if we got any consumption anomaly notifications
    const hasConsumptionNotification = deviceNotifications.some(n => 
      n.title.includes("Verbrauchsanstieg") || n.title.includes("Verbrauchsrückgang")
    );
    
    if (hasConsumptionNotification) {
      const deviceId = device.ID?.toString() || device["Number Meter"]?.toString() || "";
      processedDeviceIds.add(deviceId);
    }
    
    notifications.push(...deviceNotifications);
  }
  
  // Second pass: For devices without Monthly Values, group by device ID and calculate
  const deviceReadingsMap = new Map<string, MeterReadingType[]>();
  
  for (const device of parsedData.data) {
    const deviceId = device.ID?.toString() || device["Number Meter"]?.toString() || "";
    
    // Skip if already processed via Monthly Values
    if (processedDeviceIds.has(deviceId)) continue;
    
    if (!deviceReadingsMap.has(deviceId)) {
      deviceReadingsMap.set(deviceId, []);
    }
    deviceReadingsMap.get(deviceId)!.push(device);
  }
  
  // Generate notifications from grouped readings
  for (const [deviceId, readings] of deviceReadingsMap) {
    if (readings.length >= 3) { // Need at least 3 readings to calculate 2 consumption periods
      // Check for consumption anomalies
      const anomalyNotification = detectConsumptionAnomalyFromReadings(readings);
      if (anomalyNotification) {
        notifications.push(anomalyNotification);
      } else if (readings.length >= 4) {
        // Only check for zero consumption if no anomaly detected and we have enough readings
        const zeroNotification = detectZeroConsumptionFromReadings(readings);
        if (zeroNotification) {
          notifications.push(zeroNotification);
        }
      }
    }
  }
  
  return notifications;
}



