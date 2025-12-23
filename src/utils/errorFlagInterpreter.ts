import { MeterReadingType } from "@/api";

const ERROR_FLAG_MAPPINGS: Record<string, Record<number, string>> = {
  // Generic Water meter fallback
  standard: {
    0: "Sensorfehler",
    1: "Gerät Reset",
    2: "Software-Fehler", 
    3: "Manipulationserkennung",
    4: "Batteriefehler",
    5: "Rückfluss/Blockade",
    6: "Leckage erkannt",
    7: "Überlasthinweis"
  },
  // Generic Heat meter fallback
  heat: {
    0: "Temperatursensor Fehler",
    1: "Temperatursensor Kurzschluss", 
    2: "Temperatursensor 2 Fehler",
    3: "Temperatursensor 2 Kurzschluss",
    4: "Durchflussmessung Fehler",
    5: "Elektronik defekt",
    6: "Gerät Reset",
    7: "Schwache Batterie"
  },
  default: {
    0: "Gerätefehler Bit 0",
    1: "Gerätefehler Bit 1", 
    2: "Gerätefehler Bit 2",
    3: "Gerätefehler Bit 3",
    4: "Gerätefehler Bit 4",
    5: "Gerätefehler Bit 5",
    6: "Gerätefehler Bit 6",
    7: "Gerätefehler Bit 7"
  }
};

const MANUFACTURER_ERROR_MAPPINGS: Record<string, Record<number, string>> = {
  // Engelmann SensoStar S3/S3C Heat Meters (EFE)
  EFE: {
    0: "Temperatursensor Kabelbruch",           // Temperature sensor cable break
    1: "Temperatursensor Kurzschluss",          // Temperature sensor short circuit
    2: "Temperatursensor 2 Kabelbruch",         // Temperature sensor 2 cable break
    3: "Temperatursensor 2 Kurzschluss",        // Temperature sensor 2 short circuit
    4: "Durchflussmesssystem Fehler",           // Flow measurement system error
    5: "Elektronik defekt",                     // Electronics defect
    6: "Gerät Reset",                           // Device reset
    7: "Schwache Batterie"                      // Weak battery
  },
  
  // Engelmann WaterStar M Water Meters (DWZ)
  DWZ: {
    0: "Sensorfehler",                          // Sensor error
    1: "Gerät Reset",                           // Device reset
    2: "Software-Fehler",                       // Software error
    3: "Manipulationserkennung",                // Manipulation/tampering detected
    4: "Batteriespannungsfehler",               // Battery voltage error
    5: "Rückfluss oder Blockade",               // Backflow or blockage
    6: "Leckage erkannt",                       // Leakage detected
    7: "Überlasthinweis"                        // Overload warning
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

function parseBinaryFlag(flagString: string | number): number {
  if (!flagString || flagString === "0b") return 0;
  
  // Convert to string if it's a number
  const flagStr = typeof flagString === "string" ? flagString : String(flagString);

  const cleanFlag = flagStr.replace(/^0?b/, '');
  
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
  // German error strings matching the actual error messages
  const criticalErrors = [
    'Elektronik defekt',           // Electronics defect
    'Kabelbruch',                  // Cable break
    'Kurzschluss',                 // Short circuit
    'Leckage erkannt',             // Leakage detected
    'Sensorfehler'                 // Sensor error
  ];
  const highErrors = [
    'Temperatursensor',            // Temperature sensor issues
    'Durchflussmessung',           // Flow measurement issues
    'Durchflussmesssystem',        // Flow measurement system
    'Manipulationserkennung',      // Tampering detected
    'Rückfluss',                   // Backflow
    'Blockade'                     // Blockage
  ];
  const mediumErrors = [
    'Schwache Batterie',           // Weak battery
    'Batterie',                    // Battery related
    'Gerät Reset',                 // Device reset
    'Software-Fehler',             // Software error
    'Überlasthinweis'              // Overload warning
  ];
  
  if (errors.some(error => criticalErrors.some(critical => error.toLowerCase().includes(critical.toLowerCase())))) {
    return 'critical';
  }
  
  if (errors.some(error => highErrors.some(high => error.toLowerCase().includes(high.toLowerCase())))) {
    return 'high';
  }
  
  if (errors.some(error => mediumErrors.some(medium => error.toLowerCase().includes(medium.toLowerCase())))) {
    return 'medium';
  }
  
  return 'low';
}

export function interpretErrorFlags(device: MeterReadingType): ErrorInterpretation | null {
  const errorFlagRaw = device["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"];
  
  // Check for null, undefined, empty string, "0b", or number 0
  if (!errorFlagRaw) {
    return null;
  }
  
  if ((typeof errorFlagRaw === "string" && errorFlagRaw === "0b") || (typeof errorFlagRaw === "number" && errorFlagRaw === 0)) {
    return null;
  }
  
  const errorFlag = parseBinaryFlag(errorFlagRaw);
  
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
    errorFlag: String(errorFlagRaw),
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
