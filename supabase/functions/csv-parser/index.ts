import { serve } from "std/http/server.ts"
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { processErrorsAndNotify } from './errorNotifications.ts'

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
    parsed_data: ParsedRecord;
    date_only?: string; // YYYY-MM-DD format for DB unique constraint
}

/**
 * Extract date from filename pattern: Worringerestrasse86_YYYYMMDD_YYYYMMDD.csv
 * Also supports .txt files (e.g. DeutschenGasse468307_20260211_20260212.txt)
 * Returns the FIRST date (start date) in YYYY-MM-DD format
 */
function extractDateFromFilename(fileName: string): string | null {
    if (!fileName) return null;

    // Match pattern: anything_YYYYMMDD_YYYYMMDD.csv/.txt or anything_YYYYMMDD.csv/.txt
    const filenameMatch = fileName.match(/_(\d{8})(?:_\d{8})?\.(?:csv|txt)$/i);
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
function extractDateOnly(record: ParsedRecord, fileName?: string): string | null {
    const deviceId = record['ID'] || record['Number Meter'] || 'unknown';
    const deviceType = record['Device Type'] || 'unknown';

    // 🔍 DEBUG: Log what we're working with
    console.log(`[DATE EXTRACT START] Device: ${deviceId}, Type: ${deviceType}, Filename: "${fileName}"`);

    // 🔥 NEW: For Electricity, ALWAYS use filename (CSV has no date field)
    if (deviceType === 'Elec' || deviceType === 'Stromzähler') {
        console.log(`[ELECTRICITY PRIORITY] Using filename for Electricity device`);
        if (fileName) {
            const filenameDate = extractDateFromFilename(fileName);
            if (filenameDate) {
                console.log(`[DATE SUCCESS FILENAME] Electricity using filename date: ${filenameDate}`);
                return filenameDate;
            } else {
                console.error(`[DATE FAIL FILENAME] Filename doesn't match pattern: "${fileName}"`);
            }
        } else {
            console.error(`[DATE FAIL] No filename provided for Electricity!`);
        }
        // If filename fails, fall through to try CSV dates (unlikely to exist but worth trying)
    } else if (deviceType === 'HCA') {
        const hcaDateTime = record['IV,0,0,0,,Date/Time'];
        if (hcaDateTime && typeof hcaDateTime === 'string') {
            console.log(`[HCA DATE] Found IV,0,0,0,,Date/Time: "${hcaDateTime}"`);

            // Extract the date part (before any space)
            const datePart = hcaDateTime.split(' ')[0].trim();
            console.log(`[HCA DATE] Extracted date part: "${datePart}"`);

            // Parse DD.MM.YYYY format
            const dotMatch = datePart.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
            if (dotMatch) {
                const [_, day, month, year] = dotMatch;
                const result = `${year}-${month}-${day}`;
                console.log(`[HCA DATE SUCCESS] Using date from IV,0,0,0,,Date/Time: ${result}`);
                return result;
            }
        }
        console.log(`[HCA DATE] No valid date in IV,0,0,0,,Date/Time, falling back to filename`);
    }



    // Try different date field names from CSV content
    const dateFields = [
        record['Actual Date'],
        record['IV,0,0,0,,Date/Time'],
        record['Raw Date']
    ];

    // 🔍 DEBUG: Log what fields exist
    console.log(`[DATE FIELDS] Actual Date: "${record['Actual Date']}", DateTime: "${record['IV,0,0,0,,Date/Time']}", Raw Date: "${record['Raw Date']}"`);

    for (const dateStr of dateFields) {
        if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') continue;

        // Extract just the date portion (before any space/time component)
        // Handles formats like "01.02.26 10:10:46 Day of Week..." from smoke detectors
        const datePart = dateStr.split(' ')[0].trim();

        console.log(`[DATE TRY CSV] Attempting to parse: "${datePart}" (from "${dateStr.substring(0, 30)}...")`);

        // Match DD.MM.YYYY format (4-digit year)
        const dotMatch = datePart.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        if (dotMatch) {
            const [_, day, month, year] = dotMatch;
            const result = `${year}-${month}-${day}`;
            console.log(`[DATE SUCCESS CSV] Extracted from CSV field (4-digit year): ${result}`);
            return result; // Convert to YYYY-MM-DD
        }

        // Match DD.MM.YY format (2-digit year) - NEW for Maienweg customer
        // Handles dates like "01.02.26" from HAG smoke detectors
        const dotMatch2 = datePart.match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
        if (dotMatch2) {
            const [_, day, month, yearShort] = dotMatch2;
            // Convert 2-digit year: ≤50 becomes 20xx, >50 becomes 19xx
            const yearNum = parseInt(yearShort, 10);
            const year = yearNum <= 50 ? `20${yearShort}` : `19${yearShort}`;
            const result = `${year}-${month}-${day}`;
            console.log(`[DATE SUCCESS CSV] Extracted from CSV field (2-digit year ${yearShort} → ${year}): ${result}`);
            return result; // Convert to YYYY-MM-DD
        }

        // Match DD-MM-YYYY format
        const dashMatch = datePart.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (dashMatch) {
            const [_, day, month, year] = dashMatch;
            const result = `${year}-${month}-${day}`;
            console.log(`[DATE SUCCESS CSV] Extracted from CSV field: ${result}`);
            return result; // Convert to YYYY-MM-DD
        }

    }

    // FALLBACK: If no date found in CSV content, try extracting from filename
    console.log(`[DATE FALLBACK] No CSV date found, trying filename: "${fileName}"`);
    if (fileName) {
        const filenameDate = extractDateFromFilename(fileName);
        console.log(`[DATE FILENAME RESULT] extractDateFromFilename returned: ${filenameDate}`);
        if (filenameDate) {
            console.log(`[DATE SUCCESS FILENAME] Using filename date for device ${deviceId}: ${filenameDate}`);
            return filenameDate;
        } else {
            console.error(`[DATE FAIL FILENAME] extractDateFromFilename returned null for: "${fileName}"`);
        }
    } else {
        console.error(`[DATE FAIL] No filename provided, cannot extract date!`);
    }

    console.error(`[DATE FAIL FINAL] No date found for device ${deviceId} (${deviceType})`);
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
            } catch (_e) {
                // Keep as string if conversion fails
            }
        }

        return value;
    }

    /**
     * Fields that should ALWAYS be kept as strings to preserve formatting (e.g. leading zeros)
     * Device IDs, meter numbers, and version/status fields must not be converted to numbers
     */
    static readonly KEEP_AS_STRING_FIELDS = new Set([
        'ID', 'Number Meter', 'Number Meter:', 'Number Customer', 'Number Customer:',
        'Version', 'Status', 'StatusByte', 'StatusByte:', 'AES Key', 'AESKey', 'AESKey:',
        'Frame Type', 'Number Route', 'Number Route:', 'Number Estate', 'Number Estate:',
        'Number Entrance', 'Number Entrance:', 'Number Building Unit', 'Number Building Unit:',
        'Unit Number', 'Unitnumber', 'Unitnumber:'
    ]);

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
                // Keep ID/meter fields as strings to preserve leading zeros
                if (this.KEEP_AS_STRING_FIELDS.has(cleanHeader)) {
                    record[cleanHeader] = rawValue;
                } else {
                    record[cleanHeader] = this.convertValue(rawValue);
                }
            }
        });

        return record;
    }

    /**
     * Process CSV content into records
     * Handles VERTICAL CSV format: alternating header-data pairs (Engelmann Gateway format)
     * Each device type has its own header line followed by its data line
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

        // Process lines in pairs: header line followed by data line
        // Line 0: Header for device 1
        // Line 1: Data for device 1
        // Line 2: Header for device 2  
        // Line 3: Data for device 2
        // etc.
        for (let i = 0; i < lines.length - 1; i += 2) {
            const headerLine = lines[i];
            const dataLine = lines[i + 1];

            if (headerLine && dataLine) {
                const record = this.parseRecord(headerLine, dataLine);
                records.push(record);
            }
        }

        console.log(`[VERTICAL FORMAT] Processed ${records.length} records from ${lines.length / 2} header-data pairs`);
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

            // 🔍 DIAGNOSTIC: Log first 10 device IDs being looked up
            console.log(`[METER LOOKUP] Looking up ${uniqueDeviceIds.length} unique device IDs`);
            console.log(`[METER LOOKUP] First 10 device IDs from CSV:`, uniqueDeviceIds.slice(0, 10));

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
                console.error('[METER LOOKUP] Query failed - ALL device IDs will show as unlinked');
                return { meterIdMap, prefixedMatches };
            }

            // 🔍 DIAGNOSTIC: Log what the database returned
            console.log(`[METER LOOKUP] Database returned ${meters?.length || 0} matching meters`);
            if (meters && meters.length > 0) {
                console.log(`[METER LOOKUP] Matched meter_numbers from DB:`, meters.map((m: { meter_number: string }) => m.meter_number).slice(0, 10));
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

            // 🔍 DIAGNOSTIC: Log unmatched device IDs so we can debug
            const unmatchedIds = uniqueDeviceIds.filter(id => !meterIdMap.has(id));
            if (unmatchedIds.length > 0) {
                console.warn(`[METER LOOKUP] ${unmatchedIds.length} device IDs NOT found in local_meters`);
                console.warn(`[METER LOOKUP] First 10 unmatched IDs:`, unmatchedIds.slice(0, 10));
                console.warn(`[METER LOOKUP] ⚠️ These meters may need to be registered in local_meters table, or the meter_number format may not match the CSV device ID`);
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

                // 🔥 RELAXED VALIDATION: SmokeDetector and HCA don't have standard consumption columns
                const noConsumptionDevices = ['SmokeDetector', 'HCA'];
                const isNoConsumptionDevice = noConsumptionDevices.includes(deviceType);

                if (!deviceId || !deviceType || !manufacturer) {
                    errors.push(`Missing required fields for record: ${JSON.stringify(record)}`);
                    continue;
                }

                // Get local_meter_id from cache
                const localMeterId = meterIdMap.get(deviceId) || null;

                // For Elec devices, determine if we need to update the device ID
                const updatedRecord = { ...record };

                let finalDeviceId = deviceId;

                // 🔥 RELAXED VALIDATION: SmokeDetector and HCA don't have standard consumption columns
                // (Already defined above)

                // 🔥 NEW: Alarm/Status Handling for Smoke Detectors AND HCAs
                // Both device types use the Status field to report errors/alarms.
                // We map this directly to the ErrorFlags field so the frontend/notification logic can interpret it.
                if (deviceType === 'SmokeDetector' || deviceType === 'HCA') {
                    const status = record['Status'];
                    // If Status is present and not 0/00/00h, treat as Error/Alarm
                    if (status && status !== '0' && status !== '00' && status !== '00h' && status !== 0) {
                        console.log(`[STATUS] ${deviceType} ${deviceId} has status ${status} - mapping to ErrorFlag`);
                        // STATUS conversion:

                        // Treat status as Hex (common in MBus CSVs). Convert to binary string with "0b" prefix.
                        // This prevents ambiguity in the interpreter (e.g. "04" being parsed as binary "0").
                        const code = parseInt(String(status), 16);
                        if (!isNaN(code)) {
                            updatedRecord['IV,0,0,0,,ErrorFlags(binary)(deviceType specific)'] = "0b" + code.toString(2);
                        }

                    }
                }

                if (deviceType === 'Elec' && localMeterId && prefixedMatches.has(deviceId)) {
                    // This match was found with prefix, so update the device ID
                    const updatedId = `1EMH00${deviceId}`;
                    updatedRecord['ID'] = updatedId;
                    finalDeviceId = updatedId;
                }


                // Extract date_only for DB unique constraint (YYYY-MM-DD format)
                let dateOnlyYYYYMMDD = extractDateOnly(record, fileName);

                // 🔥 NEW: FALLBACK FOR NO-CONSUMPTION DEVICES (HCA/SmokeDetector)
                // If they lack a date column, explicitly try filename date as a valid fallback
                if (!dateOnlyYYYYMMDD && isNoConsumptionDevice && fileName) {
                    const fallbackDate = extractDateFromFilename(fileName);
                    if (fallbackDate) {
                        dateOnlyYYYYMMDD = fallbackDate;
                        console.log(`[FALLBACK DATE] Using filename date for ${deviceType} ${deviceId}: ${fallbackDate}`);
                    }
                }

                // 🔥 NEW: REJECT RECORDS WITHOUT DATES (prevents null date bugs)
                if (!dateOnlyYYYYMMDD) {
                    console.error(`[SKIP] No date extracted for ${deviceType} device ${deviceId}`);
                    console.error(`[SKIP DEBUG] Filename: "${fileName}"`);
                    console.error(`[SKIP DEBUG] Record fields:`, Object.keys(record).slice(0, 10));
                    errors.push(`Skipped device ${deviceId} (${deviceType}): No date found in CSV or filename`);
                    continue; // Don't save records without dates!
                }

                // SURGICAL FIX: Inject filename date into JSONB if it was extracted from filename
                // This ensures chart filters work correctly by having dates in both places
                const usedFilenameDate = dateOnlyYYYYMMDD === extractDateFromFilename(  fileName || '');
                const hasNoDateFields = !record['Actual Date'] && !record['Raw Date'] && !record['IV,0,0,0,,Date/Time'];

                if (usedFilenameDate && hasNoDateFields) {
                    // Convert YYYY-MM-DD to DD.MM.YYYY for Actual Date
                    const [year, month, day] = dateOnlyYYYYMMDD.split('-');
                    updatedRecord['Actual Date'] = `${day}.${month}.${year}`;
                    updatedRecord['Raw Date'] = `${day}-${month}-${year}`;
                    console.log(`[JSONB DATE] Injected filename date into JSONB for device ${finalDeviceId}: ${updatedRecord['Actual Date']}`);
                }

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

        // Determine if the request body is a URL or raw CSV content
        let result: ParseResult;
        const csvUrl = url.searchParams.get('csvUrl'); // Assuming csvUrl can be passed as a query parameter

        if (csvUrl) {
            console.log('Parsing CSV from URL:', csvUrl);
            result = await CSVParser.parseCSVFromURL(csvUrl, fileName);
        } else {
            console.log('Parsing CSV from content');
            // Parse CSV from content
            result = CSVParser.parseCSVFromContent(
                rawBody as string,
                fileName
            );
        }

        console.log(`Successfully parsed ${result.parsedData.length} records`)

        // Count unique device IDs for logging - support both old (ID) and new (Number Meter) CSV formats
        const uniqueDeviceIds = new Set(
            result.parsedData
                .map(record => (record['ID'] || record['Number Meter'])?.toString())
                .filter(id => id)
        );
        console.log(`Found ${uniqueDeviceIds.size} unique device IDs`)
        console.log(`[DEBUG] First 5 device IDs from parsed CSV:`, [...uniqueDeviceIds].slice(0, 5))

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

        // 🔔 Process errors and send webhook notifications
        await processErrorsAndNotify(result.parsedData, dbHelper['supabase']);

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