import { MeterReadingType } from "@/api";
import { StaticImageData } from "next/image";
import {
  alert_triangle,
  pipe_water,
  blue_info,
  hot_water,
  cold_water,
} from "@/static/icons";

export interface HintCodeNotification {
  leftIcon: StaticImageData;
  rightIcon: StaticImageData;
  leftBg: string;
  rightBg: string;
  title: string;
  subtitle: string;
  meterId?: number;
  severity: "low" | "medium" | "high" | "critical";
}

// Hint Code mappings based on CSV data
const HINT_CODE_MAPPINGS: Record<string, {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: (deviceType: string, meterId: string) => string;
  leftIcon: StaticImageData;
  rightIcon: StaticImageData;
  rightBg: string;
}> = {
  "5": {
    type: "Leckage",
    severity: "critical",
    message: (deviceType, meterId) => `Leckage erkannt - möglicher Rohrbruch bei ${deviceType} ${meterId}`,
    leftIcon: pipe_water,
    rightIcon: alert_triangle,
    rightBg: "#FFE5E5"
  },
  "12": {
    type: "Rauchwarnmelder",
    severity: "high",
    message: (deviceType, meterId) => `Rauchwarnmelder wurde abgenommen bei ${deviceType} ${meterId}`,
    leftIcon: alert_triangle,
    rightIcon: alert_triangle,
    rightBg: "#F7E7D5"
  },
  "15": {
    type: "Ungewöhnlicher Verbrauch",
    severity: "medium",
    message: (deviceType, meterId) => `Ungewöhnlicher Verbrauch erkannt bei ${deviceType} ${meterId}`,
    leftIcon: blue_info,
    rightIcon: blue_info,
    rightBg: "#E5EBF5"
  }
};

/**
 * Interpret hint codes from CSV and generate notifications
 */
export function interpretHintCode(device: MeterReadingType): HintCodeNotification | null {
  const hintCode = device["Hint Code"];
  const hintDescription = device["Hint Code Description"];
  
  // Skip if no hint code or if it's 0 or empty
  if (!hintCode || hintCode === "0" || hintCode === 0 || hintCode === "") {
    return null;
  }
  
  const hintCodeStr = String(hintCode);
  const deviceType = device["Device Type"];
  const meterId = device.ID || device["Number Meter"];
  
  // Check if we have a mapping for this hint code
  const mapping = HINT_CODE_MAPPINGS[hintCodeStr];
  
  if (mapping) {
    const deviceTypeLabel = deviceType === "WWater" ? "Warmwasserzähler" :
                           deviceType === "Water" ? "Kaltwasserzähler" :
                           deviceType === "Heat" ? "Wärmezähler" :
                           deviceType;
    
    return {
      leftIcon: mapping.leftIcon,
      rightIcon: mapping.rightIcon,
      leftBg: "#E7E8EA",
      rightBg: mapping.rightBg,
      title: `${mapping.type} - Zähler ${meterId}`,
      subtitle: mapping.message(deviceTypeLabel, String(meterId)),
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: mapping.severity
    };
  }
  
  // If hint code description exists but no mapping, create a generic notification
  if (hintDescription && hintDescription !== "") {
    return {
      leftIcon: blue_info,
      rightIcon: blue_info,
      leftBg: "#E7E8EA",
      rightBg: "#E5EBF5",
      title: `Hinweis - Zähler ${meterId}`,
      subtitle: `${hintDescription}`,
      meterId: typeof meterId === "string" ? parseInt(meterId) : meterId,
      severity: "medium"
    };
  }
  
  return null;
}

/**
 * Get all devices with hint codes
 */
export function getDevicesWithHintCodes(parsedData: {
  data: MeterReadingType[];
}): HintCodeNotification[] {
  const notifications: HintCodeNotification[] = [];
  
  for (const device of parsedData.data) {
    const notification = interpretHintCode(device);
    if (notification) {
      notifications.push(notification);
    }
  }
  
  return notifications;
}

/**
 * Check if device has specific hint code
 */
export function hasHintCode(device: MeterReadingType, code: string | number): boolean {
  const hintCode = device["Hint Code"];
  if (!hintCode) return false;
  return String(hintCode) === String(code);
}

