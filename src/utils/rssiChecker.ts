import { MeterReadingType } from "@/api";
import { StaticImageData } from "next/image";
import { keys, blue_info, alert_triangle } from "@/static/icons";

export interface RSSINotification {
  leftIcon: StaticImageData;
  rightIcon: StaticImageData;
  leftBg: string;
  rightBg: string;
  title: string;
  subtitle: string;
  meterId?: number;
  severity: "low" | "medium" | "high";
}

// RSSI thresholds (in dBm)
const RSSI_THRESHOLDS = {
  CRITICAL: -100, // Very weak signal, connection issues likely
  WEAK: -90,      // Weak signal, warning needed
  FAIR: -80,      // Fair signal, no action needed
  GOOD: -70       // Good signal
};

/**
 * Parse RSSI value from string or number
 */
function parseRSSI(rssiValue: string | number | undefined): number | null {
  if (!rssiValue && rssiValue !== 0) return null;
  
  let rssi: number;
  
  if (typeof rssiValue === "number") {
    rssi = rssiValue;
  } else {
    // Remove any non-numeric characters except minus sign
    const cleanValue = String(rssiValue).replace(/[^\d-]/g, '');
    rssi = parseInt(cleanValue);
  }
  
  if (isNaN(rssi)) return null;
  
  return rssi;
}

/**
 * Get signal strength category
 */
function getSignalStrength(rssi: number): "excellent" | "good" | "fair" | "weak" | "critical" {
  if (rssi >= RSSI_THRESHOLDS.GOOD) return "excellent";
  if (rssi >= RSSI_THRESHOLDS.FAIR) return "good";
  if (rssi >= RSSI_THRESHOLDS.WEAK) return "fair";
  if (rssi >= RSSI_THRESHOLDS.CRITICAL) return "weak";
  return "critical";
}

/**
 * Check RSSI and generate notification if signal is weak
 */
export function checkRSSI(device: MeterReadingType): RSSINotification | null {
  const rssiValue = device["RSSI Value"];
  const rssi = parseRSSI(rssiValue);
  
  if (rssi === null) return null;
  
  const strength = getSignalStrength(rssi);
  const meterId = device.ID || device["Number Meter"];
  const deviceType = device["Device Type"];
  
  // Only generate notifications for weak or critical signals
  if (strength === "weak") {
    return {
      leftIcon: keys, // Radio/communication icon
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: "#F7E7D5",
      title: `Schwaches Signal - Zähler ${meterId}`,
      subtitle: `${deviceType} Gerät meldet schwaches Funksignal (${rssi} dBm)`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: "medium"
    };
  }
  
  if (strength === "critical") {
    return {
      leftIcon: keys,
      rightIcon: alert_triangle,
      leftBg: "#E7E8EA",
      rightBg: "#FFE5E5",
      title: `Kritisches Signal - Zähler ${meterId}`,
      subtitle: `${deviceType} Gerät hat sehr schwaches Funksignal (${rssi} dBm) - Verbindungsprobleme möglich`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: "high"
    };
  }
  
  return null;
}

/**
 * Get all devices with RSSI warnings
 */
export function getDevicesWithRSSIWarnings(parsedData: {
  data: MeterReadingType[];
}): RSSINotification[] {
  const notifications: RSSINotification[] = [];
  
  for (const device of parsedData.data) {
    const notification = checkRSSI(device);
    if (notification) {
      notifications.push(notification);
    }
  }
  
  return notifications;
}

/**
 * Get RSSI status for display
 */
export function getRSSIStatus(device: MeterReadingType): {
  rssi: number | null;
  strength: "excellent" | "good" | "fair" | "weak" | "critical" | null;
  label: string;
  color: string;
} {
  const rssi = parseRSSI(device["RSSI Value"]);
  
  if (rssi === null) {
    return {
      rssi: null,
      strength: null,
      label: "Keine Daten",
      color: "#gray"
    };
  }
  
  const strength = getSignalStrength(rssi);
  
  const labels = {
    excellent: "Ausgezeichnet",
    good: "Gut",
    fair: "Befriedigend",
    weak: "Schwach",
    critical: "Kritisch"
  };
  
  const colors = {
    excellent: "#22C55E",
    good: "#84CC16",
    fair: "#EAB308",
    weak: "#F97316",
    critical: "#EF4444"
  };
  
  return {
    rssi,
    strength,
    label: labels[strength],
    color: colors[strength]
  };
}

