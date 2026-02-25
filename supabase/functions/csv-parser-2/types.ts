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
