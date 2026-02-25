export interface ParsedRecord {
  [key: string]: string | number;
}

export interface ParseMetadata {
  sourceFile?: string;
  fileName?: string;
  recordCount?: number;
  totalFiles?: number;
  totalRecords?: number;
  processedAt: string;
  sourceFolder?: string;
}

export interface FileResult {
  fileName: string;
  recordCount: number;
  status: 'success' | 'error';
  error?: string;
}

export interface ParseResult {
  metadata: ParseMetadata;
  parsedData: ParsedRecord[];
  fileResults?: FileResult[];
  insertedRecords?: number;
  errors?: string[];
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
  parsed_data: ParsedRecord;
  date_only?: string; // YYYY-MM-DD format for DB unique constraint
}

