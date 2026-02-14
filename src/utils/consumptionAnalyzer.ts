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
 * Supports: "31.12.2024", "31.12.24", "31.12.24 10:30:00..."
 */
function parseGermanDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;

  // Extract just the date part (before any space/time component)
  // Handles formats like "01.02.26 10:10:46 Day of Week..." from smoke detectors
  const datePart = dateStr.split(" ")[0].trim();

  const parts = datePart.split(".");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Month is 0-indexed
  let year = parseInt(parts[2]);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  // Handle 2-digit years: ≤50 becomes 20xx, >50 becomes 19xx
  if (year < 100) {
    year = year <= 50 ? 2000 + year : 1900 + year;
  }

  return new Date(year, month, day);
}


/**
 * Get device icon based on type
 */
function getDeviceIcon(deviceType: string): StaticImageData {
  const type = deviceType.toLowerCase();

  if (type.includes("heat") || type.includes("wärme") || type.includes("wmz") || type.includes("hca")) {
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
 */
export function calculateConsumptionChange(device: MeterReadingType): {
  percentageChange: number;
  currentValue: number;
  previousValue: number;
} | null {
  // Get the two most recent monthly values
  const value1 = parseGermanNumber(device["Monthly Value 1"]); // Current month
  const value2 = parseGermanNumber(device["Monthly Value 2"]); // Previous month

  if (value1 === null || value2 === null) return null;
  if (value2 === 0) return null; // Avoid division by zero

  const change = ((value1 - value2) / value2) * 100;

  return {
    percentageChange: change,
    currentValue: value1,
    previousValue: value2
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
  const unit = device["Monthly Unit 1"] || "MWh";

  // Only alert if change is >= 30%
  if (absChange < 30) return null;

  const isIncrease = change.percentageChange > 0;
  const deviceTypeLabel = deviceType === "WWater" ? "Warmwasser" :
    deviceType === "Water" ? "Kaltwasser" :
      deviceType === "HCA" ? "Heizkostenverteiler" :
        deviceType === "Heat" ? "Wärme" :
          deviceType;

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
 * Detect zero consumption (3+ months with no usage)
 */
export function detectZeroConsumption(device: MeterReadingType): ConsumptionNotification | null {
  // Check last 3 months
  const value1 = parseGermanNumber(device["Monthly Value 1"]);
  const value2 = parseGermanNumber(device["Monthly Value 2"]);
  const value3 = parseGermanNumber(device["Monthly Value 3"]);

  if (value1 === null || value2 === null || value3 === null) return null;

  // All three months have zero consumption
  if (value1 === 0 && value2 === 0 && value3 === 0) {
    const meterId = device.ID || device["Number Meter"];
    const deviceType = device["Device Type"];
    const deviceTypeLabel = deviceType === "WWater" ? "Warmwasserzähler" :
      deviceType === "Water" ? "Kaltwasserzähler" :
        deviceType === "HCA" ? "Heizkostenverteiler" :
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

  // Alert if no data for 3+ days
  if (daysSinceReading >= 3) {
    const meterId = device.ID || device["Number Meter"];
    const deviceType = device["Device Type"];
    const deviceTypeLabel = deviceType === "WWater" ? "Warmwasserzähler" :
      deviceType === "Water" ? "Kaltwasserzähler" :
        deviceType === "HCA" ? "Heizkostenverteiler" :
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
 * CRITICAL: Groups by meter ID and only analyzes the MOST RECENT record per meter
 * This prevents false "no data" alerts when old records exist alongside new ones
 */
export function getConsumptionNotifications(parsedData: {
  data: MeterReadingType[];
}): ConsumptionNotification[] {
  const notifications: ConsumptionNotification[] = [];

  // Group records by meter ID and keep only the most recent one per meter
  const meterMap = new Map<string, MeterReadingType>();

  for (const device of parsedData.data) {
    const meterId = device.ID?.toString() || device["Number Meter"]?.toString();
    if (!meterId) continue;

    const existingDevice = meterMap.get(meterId);

    if (!existingDevice) {
      meterMap.set(meterId, device);
    } else {
      // Compare dates - keep the more recent one
      const existingDate = existingDevice["Actual Date"] || existingDevice["Raw Date"] || existingDevice["IV,0,0,0,,Date/Time"];
      const newDate = device["Actual Date"] || device["Raw Date"] || device["IV,0,0,0,,Date/Time"];

      if (existingDate && newDate) {
        const existingParsed = parseGermanDate(existingDate);
        const newParsed = parseGermanDate(newDate);

        if (existingParsed && newParsed && newParsed > existingParsed) {
          meterMap.set(meterId, device); // New record is more recent
        }
      } else if (newDate && !existingDate) {
        meterMap.set(meterId, device); // New has date, existing doesn't
      }
    }
  }

  // Now analyze only the most recent record per meter
  for (const device of meterMap.values()) {
    const deviceNotifications = analyzeConsumption(device);
    notifications.push(...deviceNotifications);
  }

  return notifications;
}

