import type { MeterReading } from "./types";

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
