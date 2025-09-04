import { MeterReadingType } from "@/api";

const ERROR_FLAG_MAPPINGS: Record<string, Record<number, string>> = {
  standard: {
    0: "Battery low",
    1: "Communication error",
    2: "Flow sensor error", 
    3: "Temperature sensor error",
    4: "Memory error",
    5: "Calibration error",
    6: "Clock error",
    7: "General device error"
  },
  heat: {
    0: "Battery low",
    1: "Communication error", 
    2: "Temperature sensor error",
    3: "Flow sensor error",
    4: "Memory error",
    5: "Calibration error",
    6: "Clock error",
    7: "General device error"
  },
  default: {
    0: "Device error bit 0",
    1: "Device error bit 1", 
    2: "Device error bit 2",
    3: "Device error bit 3",
    4: "Device error bit 4",
    5: "Device error bit 5",
    6: "Device error bit 6",
    7: "Device error bit 7"
  }
};

const MANUFACTURER_ERROR_MAPPINGS: Record<string, Record<number, string>> = {
  EFE: {
    0: "Battery low",
    1: "Communication failure",
    2: "Temperature sensor fault",
    3: "Flow sensor fault", 
    4: "Memory corruption",
    5: "Calibration drift",
    6: "Real-time clock error",
    7: "Hardware malfunction"
  },
  
  DWZ: {
    0: "Battery low",
    1: "Communication failure", 
    2: "Flow sensor fault",
    3: "Temperature sensor fault",
    4: "Memory corruption",
    5: "Calibration drift",
    6: "Real-time clock error", 
    7: "Hardware malfunction"
  }
};

export interface ErrorInterpretation {
  deviceId: string;
  deviceType: string;
  manufacturer: string;
  errorFlag: string;
  errors: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

function parseBinaryFlag(flagString: string): number {
  if (!flagString || flagString === "0b") return 0;

  const cleanFlag = flagString.replace(/^0?b/, '');
  
  if (cleanFlag === '') return 0;
  
  try {
    return parseInt(cleanFlag, 2);
  } catch {
    return parseInt(cleanFlag, 10) || 0;
  }
}

function getErrorMessages(bitPosition: number, deviceType: string, manufacturer: string): string {
  if (MANUFACTURER_ERROR_MAPPINGS[manufacturer]) {
    return MANUFACTURER_ERROR_MAPPINGS[manufacturer][bitPosition] || `Unknown error bit ${bitPosition}`;
  }
  
  // Use heat mapping for Heat devices, standard for Water/WWater
  const mappingKey = deviceType === "Heat" ? "heat" : "standard";
  if (ERROR_FLAG_MAPPINGS[mappingKey]) {
    return ERROR_FLAG_MAPPINGS[mappingKey][bitPosition] || `Unknown error bit ${bitPosition}`;
  }
  
  return ERROR_FLAG_MAPPINGS.default[bitPosition] || `Unknown error bit ${bitPosition}`;
}

function getErrorSeverity(errors: string[]): 'low' | 'medium' | 'high' | 'critical' {
  const criticalErrors = ['Hardware malfunction', 'Memory corruption', 'Calibration drift'];
  const highErrors = ['Communication failure', 'Flow sensor fault', 'Temperature sensor fault'];
  const mediumErrors = ['Battery low', 'Real-time clock error'];
  
  if (errors.some(error => criticalErrors.some(critical => error.includes(critical)))) {
    return 'critical';
  }
  
  if (errors.some(error => highErrors.some(high => error.includes(high)))) {
    return 'high';
  }
  
  if (errors.some(error => mediumErrors.some(medium => error.includes(medium)))) {
    return 'medium';
  }
  
  return 'low';
}

export function interpretErrorFlags(device: MeterReadingType): ErrorInterpretation | null {
  const errorFlagString = device["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"];
  
  if (!errorFlagString || errorFlagString === "0b") {
    return null;
  }
  
  const errorFlag = parseBinaryFlag(errorFlagString);
  
  if (errorFlag === 0) {
    return null;
  }
  
  const deviceType = device["Device Type"];
  const manufacturer = device.Manufacturer;
  const deviceId = device.ID;
  
  const errors: string[] = [];
  
  for (let bit = 0; bit < 8; bit++) {
    if (errorFlag & (1 << bit)) {
      const errorMessage = getErrorMessages(bit, deviceType, manufacturer);
      errors.push(errorMessage);
    }
  }
  
  if (errors.length === 0) {
    return null;
  }
  
  return {
    deviceId,
    deviceType,
    manufacturer,
    errorFlag: errorFlagString,
    errors,
    severity: getErrorSeverity(errors)
  };
}

export function getDevicesWithErrors(parsedData: {
  data: MeterReadingType[];
  errors?: { row: number; error: string; rawRow: any }[];
}): ErrorInterpretation[] {
  const deviceErrors: ErrorInterpretation[] = [];
  
  for (const device of parsedData.data) {
    const errorInterpretation = interpretErrorFlags(device);
    if (errorInterpretation) {
      deviceErrors.push(errorInterpretation);
    }
  }
  
  return deviceErrors;
}

export function groupErrorsBySeverity(errorInterpretations: ErrorInterpretation[]) {
  return {
    critical: errorInterpretations.filter(e => e.severity === 'critical'),
    high: errorInterpretations.filter(e => e.severity === 'high'),
    medium: errorInterpretations.filter(e => e.severity === 'medium'),
    low: errorInterpretations.filter(e => e.severity === 'low')
  };
}

export function groupErrorsByDeviceType(errorInterpretations: ErrorInterpretation[]) {
  const groups: Record<string, ErrorInterpretation[]> = {};
  
  for (const error of errorInterpretations) {
    if (!groups[error.deviceType]) {
      groups[error.deviceType] = [];
    }
    groups[error.deviceType].push(error);
  }
  
  return groups;
}
