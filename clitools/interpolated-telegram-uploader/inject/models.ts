

export type MeterReading = {
  "Frame Type": string;
  Manufacturer: string;
  ID: string;
  Version: string;
  "Device Type": "Heat" | "WWater" | string;
  "TPL-Config": string;
  "Access Number": number;
  Status: string;
  Encryption: number;
  "IV,0,0,0,,Date/Time": string; 
  "IV,0,0,0,m^3,Vol"?: number; // Volume in cubic meters - OLD format
  "IV,1,0,0,,Date"?: string; // OLD format - now optional
  "IV,1,0,0,Wh,E"?: number;
  "IV,1,0,0,m^3,Vol"?: number;
  "IV,1,0,0,m^3,Vol Accumulation abs value only if negative contributions (backward flow)"?: number;
  "IV,2,0,0,,Date"?: string;
  // For HCA devices, we have additional fields for billing data and hint codes, which can be used for advanced analytics and alerts
  "IV,0,0,0,,Units HCA"?: number;  
  "IV,1,0,0,,Units HCA"?: number;  
  "IV,2,0,0,,Units HCA"?: number;  
  "IV,3,0,0,,Units HCA"?: number;
  "IV,4,0,0,,Units HCA"?: number;
  "IV,5,0,0,,Units HCA"?: number;
  "IV,6,0,0,,Units HCA"?: number;
  "IV,7,0,0,,Units HCA"?: number;
  "IV,8,0,0,,Units HCA"?: number;
  "IV,9,0,0,,Units HCA"?: number;
  "IV,10,0,0,,Units HCA"?: number;
  "IV,11,0,0,,Units HCA"?: number;
  "IV,12,0,0,,Units HCA"?: number;
  "IV,13,0,0,,Units HCA"?: number;
  "IV,14,0,0,,Units HCA"?: number;
  "IV,15,0,0,,Units HCA"?: number;
  "IV,16,0,0,,Units HCA"?: number;
  "IV,17,0,0,,Units HCA"?: number;
  "IV,18,0,0,,Units HCA"?: number;
  "IV,19,0,0,,Units HCA"?: number;
  "IV,20,0,0,,Units HCA"?: number;
  "IV,21,0,0,,Units HCA"?: number;
  "IV,22,0,0,,Units HCA"?: number;
  "IV,23,0,0,,Units HCA"?: number;
  "IV,24,0,0,,Units HCA"?: number;
  "IV,25,0,0,,Units HCA"?: number;
  "IV,26,0,0,,Units HCA"?: number;
  "IV,27,0,0,,Units HCA"?: number;
  "IV,28,0,0,,Units HCA"?: number;  // Monthly value
  "IV,29,0,0,,Units HCA"?: number;  // Monthly value
  "IV,30,0,0,,Units HCA"?: number;  // Monthly value
  "IV,31,0,0,,Units HCA"?: number;  // Monthly value
}

export interface DatabaseRecord {
  local_meter_id?: string;
  device_id: string;
  device_type: string;
  manufacturer: string;
  frame_type?: string;
  version?: string;
  access_number?: number;
  status?: string;
  encryption?: number;
  parsed_data?: MeterReading;
  date_only?: string; // YYYY-MM-DD format for DB unique constraint
  interpolated: boolean;
}
