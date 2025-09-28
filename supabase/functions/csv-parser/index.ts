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
     */
    static processCSVContent(fileContent: string): ParsedRecord[] {
        const lines = fileContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line);

        const records: ParsedRecord[] = [];

        // Process lines in pairs (header, data)
        for (let i = 0; i < lines.length; i += 2) {
            if (i + 1 < lines.length) {
                const headerLine = lines[i];
                const dataLine = lines[i + 1];

                if (headerLine && dataLine) {
                    const record = this.parseRecord(headerLine, dataLine);
                    records.push(record);
                }
            }
        }

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
     * Insert parsed records into the database with optimized batch operations
     */
    async insertParsedRecords(records: ParsedRecord[]): Promise<{ insertedCount: number; errors: string[]; meterIdStats: { found: number; notFound: number } }> {
        const errors: string[] = [];
        let meterIdFound = 0;
        let meterIdNotFound = 0;

        // Extract all device IDs for batch lookup
        const deviceIds = records
            .map(record => record['ID']?.toString())
            .filter(id => id) as string[];

        // Batch lookup all meter IDs
        const { meterIdMap, prefixedMatches } = await this.batchLookupMeterIds(deviceIds);

        // Prepare all database records
        const dbRecords: DatabaseRecord[] = [];

        for (const record of records) {
            try {
                // Extract core fields
                const deviceId = record['ID']?.toString() || '';
                const deviceType = record['Device Type']?.toString() || '';
                const manufacturer = record['Manufacturer']?.toString() || '';

                if (!deviceId || !deviceType || !manufacturer) {
                    errors.push(`Missing required fields for record: ${JSON.stringify(record)}`);
                    continue;
                }

                // Get local_meter_id from cache
                const localMeterId = meterIdMap.get(deviceId) || null;

                // Track meter ID statistics
                if (localMeterId) {
                    meterIdFound++;
                } else {
                    meterIdNotFound++;
                }

                // For Elec devices, determine if we need to update the device ID
                let updatedRecord = { ...record };
                let finalDeviceId = deviceId;
                
                if (deviceType === 'Elec' && localMeterId && prefixedMatches.has(deviceId)) {
                    // This match was found with prefix, so update the device ID
                    const updatedId = `1EMH00${deviceId}`;
                    updatedRecord['ID'] = updatedId;
                    finalDeviceId = updatedId;
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
                    parsed_data: updatedRecord
                };

                dbRecords.push(dbRecord);

            } catch (error) {
                errors.push(`Unexpected error processing record: ${error instanceof Error ? error.message : String(error)}`);
            }
        }

        // Batch insert all records
        let insertedCount = 0;
        if (dbRecords.length > 0) {
            try {
                const { data, error } = await this.supabase
                    .from('parsed_data')
                    .insert(dbRecords)
                    .select('device_id');

                if (error) {
                    errors.push(`Batch insert error: ${error.message}`);
                } else {
                    insertedCount = data ? data.length : 0;
                }
            } catch (error) {
                errors.push(`Batch insert exception: ${error instanceof Error ? error.message : String(error)}`);
            }
        }

        return { 
            insertedCount, 
            errors, 
            meterIdStats: { 
                found: meterIdFound, 
                notFound: meterIdNotFound 
            } 
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

        // First get the raw body text to debug JSON parsing issues
        const rawBody = await req.text()
        console.log('Raw body length:', rawBody.length)
        console.log('Raw body', rawBody)

        let result: ParseResult

        console.log('Parsing CSV from content')
        // Parse CSV from content
        result = CSVParser.parseCSVFromContent(
            rawBody as string,
            'csv-content'
        )

        console.log(`Successfully parsed ${result.parsedData.length} records`)

        // Insert records into database
        const dbHelper = new DatabaseHelper();
        const { insertedCount, errors, meterIdStats } = await dbHelper.insertParsedRecords(result.parsedData);

        console.log(`Inserted ${insertedCount} records into database`)
        console.log(`Meter ID matches - Found: ${meterIdStats.found}, Not Found: ${meterIdStats.notFound}`)
        if (errors.length > 0) {
            console.warn('Database insertion errors:', errors);
        }

        // Add database results to response
        result.insertedRecords = insertedCount;
        result.errors = errors;

        // Return successful response with detailed statistics
        const responseBody = {
            recordCount: result.parsedData.length,
            insertedRecords: insertedCount,
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