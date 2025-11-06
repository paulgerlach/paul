import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Note: Environment variables are automatically available in production
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by the platform

/**
 * Type definitions
 */
interface ParsedRecord {
    [key: string]: string | number;
}

interface FileResult {
    fileName: string;
    recordCount: number;
    status: 'success' | 'error';
    error?: string;
}

interface ParseMetadata {
    sourceFile?: string;
    fileName?: string;
    recordCount?: number;
    totalFiles?: number;
    totalRecords?: number;
    processedAt: string;
    sourceFolder?: string;
}

interface ParseResult {
    metadata: ParseMetadata;
    parsedData: ParsedRecord[];
    fileResults?: FileResult[];
    insertedRecords?: number;
    errors?: string[];
}

interface DatabaseRecord {
    local_meter_id?: string;
    device_id: string;
    device_type: string;
    manufacturer: string;
    frame_type?: string;
    version?: string;
    access_number?: number;
    status?: string;
    encryption?: number;
    parsed_data: any;
    date_only?: string; // YYYY-MM-DD format for DB unique constraint
}

/**
 * Extract date from filename pattern: Worringerestrasse86_YYYYMMDD_YYYYMMDD.csv
 * Returns the FIRST date (start date) in YYYY-MM-DD format
 */
function extractDateFromFilename(fileName: string): string | null {
    if (!fileName) return null;
    
    // Match pattern: anything_YYYYMMDD_YYYYMMDD.csv or anything_YYYYMMDD.csv
    const filenameMatch = fileName.match(/_(\d{8})(?:_\d{8})?\.csv$/i);
    if (filenameMatch) {
        const dateStr = filenameMatch[1]; // e.g., "20251104"
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const parsedDate = `${year}-${month}-${day}`;
        console.log(`[FILENAME DATE] Extracted date from filename "${fileName}": ${parsedDate}`);
        return parsedDate;
    }
    
    return null;
}

/**
 * Helper function to extract and normalize date to YYYY-MM-DD format
 * Handles multiple date formats: DD.MM.YYYY, DD-MM-YYYY
 * Falls back to filename date if no date found in CSV content
 */
function extractDateOnly(record: any, fileName?: string): string | null {
    // Try different date field names from CSV content
    const dateFields = [
        record['Actual Date'],
        record['IV,0,0,0,,Date/Time'],
        record['Raw Date']
    ];

    for (const dateStr of dateFields) {
        if (!dateStr || typeof dateStr !== 'string') continue;

        // Extract first 10 characters and trim
        const normalized = dateStr.substring(0, 10).trim();

        // Match DD.MM.YYYY format
        const dotMatch = normalized.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        if (dotMatch) {
            const [_, day, month, year] = dotMatch;
            return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
        }

        // Match DD-MM-YYYY format
        const dashMatch = normalized.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (dashMatch) {
            const [_, day, month, year] = dashMatch;
            return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
        }
    }

    // FALLBACK: If no date found in CSV content, try extracting from filename
    if (fileName) {
        const filenameDate = extractDateFromFilename(fileName);
        if (filenameDate) {
            console.log(`[FILENAME DATE] Using filename date for device ${record['ID'] || record['Number Meter']}: ${filenameDate}`);
            return filenameDate;
        }
    }

    return null; // No valid date found
}

/**
 * Configuration constants
 */
const CONFIG = {
    DELIMITER: ';',
    INTEGER_REGEX: /^-?\d+$/,
    FLOAT_REGEX: /^-?\d+[,.]?\d*$/
} as const;

/**
 * Utility functions
 */
class Utils {
    /**
     * Convert string value to appropriate data type
     */
    static convertValue(value: string): string | number {
        if (!value || value === '') return value;

        // Check if it's an integer
        if (CONFIG.INTEGER_REGEX.test(value)) {
            return parseInt(value, 10);
        }

        // Check if it's a float (with comma or dot as decimal separator)
        if (CONFIG.FLOAT_REGEX.test(value.replace(',', '.'))) {
            try {
                const floatValue = parseFloat(value.replace(',', '.'));
                if (!isNaN(floatValue)) {
                    return floatValue;
                }
            } catch (e) {
                // Keep as string if conversion fails
            }
        }

        return value;
    }

    /**
     * Parse a single CSV record from header and data lines
     */
    static parseRecord(headerLine: string, dataLine: string): ParsedRecord {
        const headers = headerLine.split(CONFIG.DELIMITER);
        const values = dataLine.split(CONFIG.DELIMITER);
        const record: ParsedRecord = {};

        headers.forEach((header, index) => {
            if (index < values.length) {
                const cleanHeader = header.trim();
                const rawValue = values[index].trim();
                record[cleanHeader] = this.convertValue(rawValue);
            }
        });

        return record;
    }

    /**
     * Process CSV content into records
     * Handles standard CSV format: single header row + multiple data rows
     */
    static processCSVContent(fileContent: string): ParsedRecord[] {
        const lines = fileContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line);

        if (lines.length < 2) {
            console.log('Not enough lines in CSV (need at least header + 1 data row)');
            return [];
        }

        const records: ParsedRecord[] = [];

        // First line is the header (column names)
        const headerLine = lines[0];
        
        // Process all subsequent lines as data rows
        for (let i = 1; i < lines.length; i++) {
            const dataLine = lines[i];
            
            if (dataLine) {
                    const record = this.parseRecord(headerLine, dataLine);
                    records.push(record);
            }
        }

        console.log(`Processed ${records.length} records from ${lines.length - 1} data rows`);
        return records;
    }
}

/**
 * Database helper class
 */
class DatabaseHelper {
    private supabase: SupabaseClient

    constructor() {
        // Get auth token from request or use service role key for local testing
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        
        this.supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                },
                db: { schema: 'public' },
                global: {
                    headers: {
                        Authorization: `Bearer ${serviceRoleKey}`
                    }
                }
            }
        )
    }

    /**
     * Batch lookup all meter IDs to reduce database calls
     */
    async batchLookupMeterIds(deviceIds: string[]): Promise<{ meterIdMap: Map<string, string>; prefixedMatches: Set<string> }> {
        const meterIdMap = new Map<string, string>();
        const prefixedMatches = new Set<string>();
        
        if (deviceIds.length === 0) return { meterIdMap, prefixedMatches };

        try {
            // Get all unique device IDs
            const uniqueDeviceIds = [...new Set(deviceIds)];
            
            // Create potential Elec device IDs with 1EMH00 prefix
            const elecDeviceIds = uniqueDeviceIds.map(id => `1EMH00${id}`);
            const allSearchIds = [...uniqueDeviceIds, ...elecDeviceIds];

            // Single query to get all possible matches
            const { data: meters, error } = await this.supabase
                .from('local_meters')
                .select('id, meter_number')
                .in('meter_number', allSearchIds);

            if (error) {
                console.error('Error batch fetching meter IDs:', error);
                return { meterIdMap, prefixedMatches };
            }

            if (meters) {
                // Create lookup map
                const meterLookup = new Map<string, string>();
                meters.forEach((meter: { id: string; meter_number: string }) => {
                    meterLookup.set(meter.meter_number, meter.id);
                });

                // Map device IDs to local_meter_ids, preferring exact matches
                uniqueDeviceIds.forEach(deviceId => {
                    if (meterLookup.has(deviceId)) {
                        // Exact match found
                        meterIdMap.set(deviceId, meterLookup.get(deviceId)!);
                    } else if (meterLookup.has(`1EMH00${deviceId}`)) {
                        // Match found with Elec prefix
                        meterIdMap.set(deviceId, meterLookup.get(`1EMH00${deviceId}`)!);
                        prefixedMatches.add(deviceId);
                    }
                });
            }

        } catch (error) {
            console.error('Error in batch meter ID lookup:', error);
        }

        return { meterIdMap, prefixedMatches };
    }

    /**
     * Check for existing records to prevent duplicates
     */
    async checkForDuplicates(records: ParsedRecord[], fileName?: string): Promise<Set<string>> {
        try {
            // Extract device IDs to check
            const deviceIds = records
                .map(record => (record['ID'] || record['Number Meter'])?.toString())
                .filter(id => id) as string[];
            
            const uniqueDeviceIds = [...new Set(deviceIds)];
            console.log(`[DEDUP] Checking ${uniqueDeviceIds.length} unique device IDs:`, uniqueDeviceIds.slice(0, 5));

            // Extract date from filename if available
            const filenameDate = fileName ? extractDateFromFilename(fileName) : null;
            if (filenameDate) {
                console.log(`[DEDUP] Will use filename date ${filenameDate} for records without CSV dates`);
            }

            // Create potential Elec device IDs with 1EMH00 prefix
            const elecDeviceIds = uniqueDeviceIds.map(id => `1EMH00${id}`);
            const allSearchIds = [...uniqueDeviceIds, ...elecDeviceIds];
            console.log(`[DEDUP] Searching for ${allSearchIds.length} total IDs (including prefixed)`);

            // Query existing records for BOTH original AND prefixed device IDs
            // Use date_only column for accurate comparison (YYYY-MM-DD format)
            // NOW INCLUDE RECORDS WITH NULL DATES since we'll apply filename dates
            const { data: existingRecords, error } = await this.supabase
                .from('parsed_data')
                .select('device_id, device_type, date_only')
                .in('device_id', allSearchIds);

            if (error) {
                console.error('[DEDUP] Error checking duplicates:', error);
                return new Set();
            }

            console.log(`[DEDUP] Found ${existingRecords?.length || 0} existing records in database`);

            // Create a Set of existing record signatures
            // Signature format: device_id|device_type|dateYYYY-MM-DD
            const existingSignatures = new Set<string>();
            
            for (const existing of existingRecords || []) {
                // Use existing date_only or filename date as fallback
                const dateStr = existing.date_only?.toString() || filenameDate;
                
                if (dateStr) {
                    const signature = `${existing.device_id}|${existing.device_type}|${dateStr}`;
                    existingSignatures.add(signature);
                    
                    // ALSO add signature without prefix (if it has prefix)
                    // So "1EMH0050893199" also creates signature for "50893199"
                    if (existing.device_id.startsWith('1EMH00')) {
                        const unprefixedId = existing.device_id.substring(6); // Remove "1EMH00"
                        const unprefixedSignature = `${unprefixedId}|${existing.device_type}|${dateStr}`;
                        existingSignatures.add(unprefixedSignature);
                    }
                }
            }

            console.log(`[DEDUP] Created ${existingSignatures.size} unique signatures from existing records`);
            if (existingSignatures.size > 0) {
                const firstFew = Array.from(existingSignatures).slice(0, 3);
                console.log(`[DEDUP] Sample signatures (format: device_id|type|YYYY-MM-DD):`, firstFew);
            }

            return existingSignatures;
        } catch (error) {
            console.error('Exception in checkForDuplicates:', error);
            return new Set();
        }
    }

    /**
     * Insert parsed records into the database with optimized batch operations and deduplication
     */
    async insertParsedRecords(records: ParsedRecord[], fileName?: string): Promise<{ 
        insertedCount: number; 
        errors: string[]; 
        meterIdStats: { found: number; notFound: number };
        skippedDuplicates: number;
        skippedHeaders: number;
    }> {
        const errors: string[] = [];

        // Extract unique device IDs for batch lookup - support both old and new CSV formats
        const deviceIds = records
            .map(record => (record['ID'] || record['Number Meter'])?.toString())
            .filter(id => id) as string[];
        
        const uniqueDeviceIds = [...new Set(deviceIds)];

        // Batch lookup all meter IDs
        const { meterIdMap, prefixedMatches } = await this.batchLookupMeterIds(uniqueDeviceIds);
        
        // Count unique meter IDs found/not found
        const uniqueMeterIdFound = uniqueDeviceIds.filter(id => meterIdMap.has(id)).length;
        const uniqueMeterIdNotFound = uniqueDeviceIds.length - uniqueMeterIdFound;

        // CHECK FOR DUPLICATES BEFORE PROCESSING
        const existingSignatures = await this.checkForDuplicates(records, fileName);
        let skippedDuplicates = 0;
        let skippedHeaders = 0;

        // Prepare all database records
        const dbRecords: DatabaseRecord[] = [];

        for (const record of records) {
            try {
                // Extract core fields - support both old and new CSV formats
                const deviceId = (record['ID'] || record['Number Meter'])?.toString() || '';
                const deviceType = record['Device Type']?.toString() || '';
                const manufacturer = (record['Manufacturer'] || record['Telegram Type'])?.toString() || '';

                // SKIP HEADER ROWS: Check if this is a header row being parsed as data
                if (deviceId === 'ID' || deviceType === 'Device Type' || deviceId === 'Number Meter') {
                    skippedHeaders++;
                    console.log(`[HEADER SKIP] Skipping header row: ID="${deviceId}", Type="${deviceType}"`);
                    continue;
                }

                if (!deviceId || !deviceType || !manufacturer) {
                    errors.push(`Missing required fields for record: ${JSON.stringify(record)}`);
                    continue;
                }

                // Get local_meter_id from cache
                const localMeterId = meterIdMap.get(deviceId) || null;

                // For Elec devices, determine if we need to update the device ID
                let updatedRecord = { ...record };
                let finalDeviceId = deviceId;
                
                if (deviceType === 'Elec' && localMeterId && prefixedMatches.has(deviceId)) {
                    // This match was found with prefix, so update the device ID
                    const updatedId = `1EMH00${deviceId}`;
                    updatedRecord['ID'] = updatedId;
                    finalDeviceId = updatedId;
                }

                // Extract date_only for DB unique constraint (YYYY-MM-DD format)
                // Pass fileName to allow fallback to filename date extraction
                const dateOnlyYYYYMMDD = extractDateOnly(record, fileName);

                // CHECK IF THIS RECORD ALREADY EXISTS (check both original and final device ID)
                if (dateOnlyYYYYMMDD) {
                    // Check with final device ID (with prefix if applicable)
                    const signatureFinal = `${finalDeviceId}|${deviceType}|${dateOnlyYYYYMMDD}`;
                    // Also check with original device ID (without prefix)
                    const signatureOriginal = `${deviceId}|${deviceType}|${dateOnlyYYYYMMDD}`;
                    
                    if (existingSignatures.has(signatureFinal) || existingSignatures.has(signatureOriginal)) {
                        skippedDuplicates++;
                        console.log(`[DEDUP] Skipping duplicate: ${signatureFinal}`);
                        continue; // Skip this duplicate record
                    }
                }

                // Prepare database record
                const dbRecord: DatabaseRecord = {
                    local_meter_id: localMeterId || undefined,
                    device_id: finalDeviceId,
                    device_type: deviceType,
                    manufacturer: manufacturer,
                    frame_type: record['Frame Type']?.toString(),
                    version: record['Version']?.toString(),
                    access_number: typeof record['Access Number'] === 'number' ? record['Access Number'] : undefined,
                    status: record['Status']?.toString(),
                    encryption: typeof record['Encryption'] === 'number' ? record['Encryption'] : undefined,
                    parsed_data: updatedRecord,
                    date_only: dateOnlyYYYYMMDD || undefined
                };

                dbRecords.push(dbRecord);

            } catch (error) {
                errors.push(`Unexpected error processing record: ${error instanceof Error ? error.message : String(error)}`);
            }
        }

        // Batch insert all records
        // Duplicates are prevented by:
        // 1. App-level: checkForDuplicates() skips known duplicates BEFORE insert
        // 2. DB-level: Unique index on (device_id, device_type, date_only) blocks any that slip through
        let insertedCount = 0;
        if (dbRecords.length > 0) {
            try {
                const { data, error } = await this.supabase
                    .from('parsed_data')
                    .insert(dbRecords)
                    .select('device_id');

                if (error) {
                    // Unique constraint violations (error code 23505) mean duplicates were blocked by DB
                    if (error.code === '23505') {
                        console.log(`[DEDUP] DB unique constraint blocked ${dbRecords.length} duplicate records`);
                        insertedCount = 0;
                        // Count DB-blocked records as skipped duplicates for accurate reporting
                        skippedDuplicates += dbRecords.length;
                    } else {
                    errors.push(`Batch insert error: ${error.message}`);
                        console.error('Batch insert error details:', error);
                    }
                } else {
                    insertedCount = data ? data.length : 0;
                    console.log(`Successfully inserted ${insertedCount} new records`);
                }
            } catch (error) {
                errors.push(`Batch insert exception: ${error instanceof Error ? error.message : String(error)}`);
                console.error('Batch insert exception:', error);
            }
        }

        return { 
            insertedCount, 
            errors, 
            meterIdStats: { 
                found: uniqueMeterIdFound, 
                notFound: uniqueMeterIdNotFound 
            },
            skippedDuplicates,
            skippedHeaders
        };
    }
}

/**
 * CSV Parser class for handling parsing operations
 */
class CSVParser {
    /**
     * Parse CSV data from URL and return JSON data
     */
    static async parseCSVFromURL(url: string, fileName: string): Promise<ParseResult> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch CSV from URL: ${response.statusText}`);
            }

            const csvContent = await response.text();
            const parsedData = Utils.processCSVContent(csvContent);

            return {
                metadata: {
                    sourceFile: url,
                    fileName: fileName || 'remote-csv',
                    recordCount: parsedData.length,
                    processedAt: new Date().toISOString()
                },
                parsedData: parsedData.map(record => ({ ...record, fileName: fileName! }))
            };
        } catch (error) {
            throw new Error(`Error parsing CSV from URL ${url}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Parse CSV data from raw content string and return JSON data
     */
    static parseCSVFromContent(csvContent: string, fileName?: string): ParseResult {
        try {
            const parsedData = Utils.processCSVContent(csvContent);

            return {
                metadata: {
                    sourceFile: 'raw-content',
                    fileName: fileName || 'csv-content',
                    recordCount: parsedData.length,
                    processedAt: new Date().toISOString()
                },
                parsedData
            };
        } catch (error) {
            throw new Error(`Error parsing CSV content: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * CORS headers for cross-origin requests
 */
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
    console.log(`Received ${req.method} request to ${req.url}`)

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        console.log('Handling CORS preflight request')
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Only allow POST requests
        if (req.method !== 'POST') {
            console.log(`Method ${req.method} not allowed`)
            return new Response(
                JSON.stringify({
                    error: 'Method not allowed. Use POST to submit CSV data.'
                }),
                {
                    status: 405,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Parse request body
        console.log('Parsing request body...')
        console.log('Request content-length:', req.headers.get('content-length'))
        console.log('Request content-type:', req.headers.get('content-type'))

        // Extract filename from headers (sent by email automation) or query params
        const url = new URL(req.url);
        const fileName = req.headers.get('x-filename') || 
                        url.searchParams.get('fileName') || 
                        url.searchParams.get('filename') ||
                        'csv-content';
        console.log('Extracted filename:', fileName);

        // First get the raw body text to debug JSON parsing issues
        const rawBody = await req.text()
        console.log('Raw body length:', rawBody.length)
        console.log('Raw body', rawBody)

        let result: ParseResult

        console.log('Parsing CSV from content')
        // Parse CSV from content
        result = CSVParser.parseCSVFromContent(
            rawBody as string,
            fileName
        )

        console.log(`Successfully parsed ${result.parsedData.length} records`)
        
        // Count unique device IDs for logging
        const uniqueDeviceIds = new Set(
            result.parsedData
                .map(record => record['ID']?.toString())
                .filter(id => id)
        );
        console.log(`Found ${uniqueDeviceIds.size} unique device IDs`)

        // Insert records into database with filename for date extraction
        const dbHelper = new DatabaseHelper();
        const { insertedCount, errors, meterIdStats, skippedDuplicates, skippedHeaders } = await dbHelper.insertParsedRecords(result.parsedData, fileName);

        console.log(`Inserted ${insertedCount} records into database`)
        console.log(`Skipped ${skippedDuplicates} duplicate records`)
        console.log(`Skipped ${skippedHeaders} header rows`)
        console.log(`Unique Meter ID matches - Found: ${meterIdStats.found}, Not Found: ${meterIdStats.notFound}`)
        if (errors.length > 0) {
            console.warn('Database insertion errors:', errors);
        }

        // Add database results to response
        result.insertedRecords = insertedCount;
        result.errors = errors;

        // Return successful response with detailed statistics
        const responseBody = {
            fileName: fileName,
            recordCount: result.parsedData.length,
            uniqueDeviceIds: uniqueDeviceIds.size,
            insertedRecords: insertedCount,
            skippedDuplicates: skippedDuplicates,
            skippedHeaders: skippedHeaders,
            meterIdMatches: {
                found: meterIdStats.found,
                notFound: meterIdStats.notFound
            },
            errors: errors
        };

        return new Response(
            JSON.stringify(responseBody),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }

            }
        )

    } catch (error) {
        console.error('Error processing CSV:', error)

        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                timestamp: new Date().toISOString()
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})

/* Example usage:
POST /functions/v1/csv-parser

With raw CSV content in body:
Frame Type;Manufacturer;ID;Version;Device Type;...
SND_NR;EMH;13551737;00h;Elec;...

Response includes:
{
  "recordCount": 600,
  "insertedRecords": 600,
  "meterIdMatches": {
    "found": 24,
    "notFound": 576
  },
  "errors": []
}

OPTIMIZED PERFORMANCE:
- Batch lookup: Single database query for all meter ID lookups (instead of 2-3 per record)
- Batch insert: Single database transaction for all records (instead of individual inserts)
- Reduced database calls from ~1800 to ~2 for 600 records

The function will:
1. Parse CSV content into structured records using header-data pairs
2. Batch lookup all device IDs in local_meters table (with 1EMH00 prefix for Elec devices)
3. Process all records with cached meter ID lookups
4. Batch insert all records in single database transaction
5. Return detailed statistics including meter ID match counts
*/