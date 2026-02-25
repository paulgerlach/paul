import { DatabaseRecord, ParsedRecord } from "../types.ts";
import { extractDateFromFilename, extractDateOnly } from "../utils/dateUtils.ts";
import { getSupabaseClient  } from "./client.ts";

export async function batchLookupMeterIds(uniqueDeviceIds: string[]): Promise<{ meterIdMap: Map<string, string>; prefixedMatches: Set<string> }> {
    console.log(`Batch looking up ${uniqueDeviceIds.length} unique device IDs in local_meters table`);
    const meterIdMap = new Map<string, string>();
    const prefixedMatches = new Set<string>();

        if (uniqueDeviceIds.length === 0) return { meterIdMap, prefixedMatches };

        try {

          // 🔍 DIAGNOSTIC: Log first 10 device IDs being looked up
          console.log(`[METER LOOKUP] Looking up ${uniqueDeviceIds.length} unique device IDs`);
          console.log(`[METER LOOKUP] First 10 device IDs from CSV:`, uniqueDeviceIds.slice(0, 10));

          // // Create potential Elec device IDs with 1EMH00 prefix
          const elecDeviceIds = uniqueDeviceIds.map(id => `1EMH00${id}`);
          const allSearchIds = [...uniqueDeviceIds, ...elecDeviceIds];

          console.log(`[METER LOOKUP] Searching for ${allSearchIds.length} total IDs (including prefixed)`);
          const supabase = getSupabaseClient();
            // Single query to get all possible matches
            // const { data, error } = await supabase.from('local_meters').select('count');

            // if (error) {
            //     console.error('Error batch fetching meter IDs:', error);
            //     console.error('[METER LOOKUP] Query failed - ALL device IDs will show as unlinked');
            //     return { meterIdMap, prefixedMatches };
            // }

            // // // 🔍 DIAGNOSTIC: Log what the database returned
            // console.log(`[METER LOOKUP] Database returned ${meters?.length || 0} matching meters`);
            // if (meters && meters.length > 0) {
            //     console.log(`[METER LOOKUP] Matched meter_numbers from DB:`, meters.map((m: { meter_number: string }) => m.meter_number).slice(0, 10));
            // }

            // if (meters) {
            //     // Create lookup map
            //     const meterLookup = new Map<string, string>();
            //     meters.forEach((meter: { id: string; meter_number: string }) => {
            //         meterLookup.set(meter.meter_number, meter.id);
            //     });

            //     // Map device IDs to local_meter_ids, preferring exact matches
            //     uniqueDeviceIds.forEach(deviceId => {
            //         if (meterLookup.has(deviceId)) {
            //             // Exact match found
            //             meterIdMap.set(deviceId, meterLookup.get(deviceId)!);
            //         } else if (meterLookup.has(`1EMH00${deviceId}`)) {
            //             // Match found with Elec prefix
            //             meterIdMap.set(deviceId, meterLookup.get(`1EMH00${deviceId}`)!);
            //             prefixedMatches.add(deviceId);
            //         }
            //     });
            // }

            // // 🔍 DIAGNOSTIC: Log unmatched device IDs so we can debug
            // const unmatchedIds = uniqueDeviceIds.filter(id => !meterIdMap.has(id));
            // if (unmatchedIds.length > 0) {
            //     console.warn(`[METER LOOKUP] ${unmatchedIds.length} device IDs NOT found in local_meters`);
            //     console.warn(`[METER LOOKUP] First 10 unmatched IDs:`, unmatchedIds.slice(0, 10));
            //     console.warn(`[METER LOOKUP] ⚠️ These meters may need to be registered in local_meters table, or the meter_number format may not match the CSV device ID`);
            // }

        } catch (error) {
            console.error('Error in batch meter ID lookup:', error);
        }

        return { meterIdMap: new Map<string, string>(), prefixedMatches: new Set<string>() };
}

    /**
     * Check for existing records to prevent duplicates
     */
// export async function checkForDuplicates(records: ParsedRecord[], fileName?: string): Promise<Set<string>> {
//         try {
//             // Extract device IDs to check
//             const deviceIds = records
//                 .map(record => (record['ID'] || record['Number Meter'])?.toString())
//                 .filter(id => id) as string[];

//             const uniqueDeviceIds = [...new Set(deviceIds)];
//             console.log(`[DEDUP] Checking ${uniqueDeviceIds.length} unique device IDs:`, uniqueDeviceIds.slice(0, 5));

//             // Extract date from filename if available
//             const filenameDate = fileName ? extractDateFromFilename(fileName) : null;
//             if (filenameDate) {
//                 console.log(`[DEDUP] Will use filename date ${filenameDate} for records without CSV dates`);
//             }

//             // Create potential Elec device IDs with 1EMH00 prefix
//             const elecDeviceIds = uniqueDeviceIds.map(id => `1EMH00${id}`);
//             const allSearchIds = [...uniqueDeviceIds, ...elecDeviceIds];
//             console.log(`[DEDUP] Searching for ${allSearchIds.length} total IDs (including prefixed)`);

//             // Query existing records for BOTH original AND prefixed device IDs
//             // Use date_only column for accurate comparison (YYYY-MM-DD format)
//             // NOW INCLUDE RECORDS WITH NULL DATES since we'll apply filename dates
//             const twoYearsAgo = new Date();
// twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
// const dateFilter = twoYearsAgo.toISOString().split('T')[0];

// const { data: existingRecords, error } = await supabase
//     .from('parsed_data')
//     .select('device_id, device_type, date_only')
//     .in('device_id', allSearchIds)
//     .gte('date_only', dateFilter)  // Only check recent records
//     .limit(50000); 

//             if (error) {
//                 console.error('[DEDUP] Error checking duplicates:', error);
//                 return new Set();
//             }

//             console.log(`[DEDUP] Found ${existingRecords?.length || 0} existing records in database`);

//             // Create a Set of existing record signatures
//             // Signature format: device_id|device_type|dateYYYY-MM-DD
//             const existingSignatures = new Set<string>();

//             for (const existing of existingRecords || []) {
//                 // Use existing date_only or filename date as fallback
//                 const dateStr = existing.date_only?.toString() || filenameDate;

//                 if (dateStr) {
//                     const signature = `${existing.device_id}|${existing.device_type}|${dateStr}`;
//                     existingSignatures.add(signature);

//                     // ALSO add signature without prefix (if it has prefix)
//                     // So "1EMH0050893199" also creates signature for "50893199"
//                     if (existing.device_id.startsWith('1EMH00')) {
//                         const unprefixedId = existing.device_id.substring(6); // Remove "1EMH00"
//                         const unprefixedSignature = `${unprefixedId}|${existing.device_type}|${dateStr}`;
//                         existingSignatures.add(unprefixedSignature);
//                     }
//                 }
//             }

//             console.log(`[DEDUP] Created ${existingSignatures.size} unique signatures from existing records`);
//             if (existingSignatures.size > 0) {
//                 const firstFew = Array.from(existingSignatures).slice(0, 3);
//                 console.log(`[DEDUP] Sample signatures (format: device_id|type|YYYY-MM-DD):`, firstFew);
//             }

//             return existingSignatures;
//         } catch (error) {
//             console.error('Exception in checkForDuplicates:', error);
//             return new Set();
//         }
// }


//     /**
//      * Insert parsed records into the database with optimized batch operations and deduplication
//      */
// export async function insertParsedRecords(records: ParsedRecord[], fileName?: string): Promise<{
//         insertedCount: number;
//         errors: string[];
//         meterIdStats: { found: number; notFound: number };
//         skippedDuplicates: number;
//         skippedHeaders: number;
//     }> {
//         const errors: string[] = [];

//         // Extract unique device IDs for batch lookup - support both old and new CSV formats
//         const deviceIds = records
//             .map(record => (record['ID'] || record['Number Meter'])?.toString())
//             .filter(id => id) as string[];

//         const uniqueDeviceIds = [...new Set(deviceIds)];

//         // Batch lookup all meter IDs
//         const { meterIdMap, prefixedMatches } = await batchLookupMeterIds(uniqueDeviceIds);

//         // CHECK FOR DUPLICATES BEFORE PROCESSING
//         const existingSignatures = await checkForDuplicates(records, fileName);
//         let skippedDuplicates = 0;
//         let skippedHeaders = 0;

//         // Prepare all database records
//         const dbRecords: DatabaseRecord[] = [];

//         for (const record of records) {
//             try {
//                 // Extract core fields - support both old and new CSV formats
//                 const deviceId = (record['ID'] || record['Number Meter'])?.toString() || '';
//                 const deviceType = record['Device Type']?.toString() || '';
//                 const manufacturer = (record['Manufacturer'] || record['Telegram Type'])?.toString() || '';

//                 // SKIP HEADER ROWS: Check if this is a header row being parsed as data
//                 if (deviceId === 'ID' || deviceType === 'Device Type' || deviceId === 'Number Meter') {
//                     skippedHeaders++;
//                     console.log(`[HEADER SKIP] Skipping header row: ID="${deviceId}", Type="${deviceType}"`);
//                     continue;
//                 }

//                 // 🔥 RELAXED VALIDATION: SmokeDetector and HCA don't have standard consumption columns
//                 const noConsumptionDevices = ['SmokeDetector', 'HCA'];
//                 const isNoConsumptionDevice = noConsumptionDevices.includes(deviceType);

//                 if (!deviceId || !deviceType || !manufacturer) {
//                     errors.push(`Missing required fields for record: ${JSON.stringify(record)}`);
//                     continue;
//                 }

//                 // Get local_meter_id from cache
//                 const localMeterId = meterIdMap.get(deviceId) || null;

//                 // For Elec devices, determine if we need to update the device ID
//                 const updatedRecord = { ...record };

//                 let finalDeviceId = deviceId;

//                 // 🔥 RELAXED VALIDATION: SmokeDetector and HCA don't have standard consumption columns
//                 // (Already defined above)

//                 // 🔥 NEW: Alarm/Status Handling for Smoke Detectors AND HCAs
//                 // Both device types use the Status field to report errors/alarms.
//                 // We map this directly to the ErrorFlags field so the frontend/notification logic can interpret it.
//                 if (deviceType === 'SmokeDetector' || deviceType === 'HCA') {
//                     const status = record['Status'];
//                     // If Status is present and not 0/00/00h, treat as Error/Alarm
//                     if (status && status !== '0' && status !== '00' && status !== '00h' && status !== 0) {
//                         console.log(`[STATUS] ${deviceType} ${deviceId} has status ${status} - mapping to ErrorFlag`);
//                         // STATUS conversion:

//                         // Treat status as Hex (common in MBus CSVs). Convert to binary string with "0b" prefix.
//                         // This prevents ambiguity in the interpreter (e.g. "04" being parsed as binary "0").
//                         const code = parseInt(String(status), 16);
//                         if (!isNaN(code)) {
//                             updatedRecord['IV,0,0,0,,ErrorFlags(binary)(deviceType specific)'] = "0b" + code.toString(2);
//                         }

//                     }
//                 }

//                 if (deviceType === 'Elec' && localMeterId && prefixedMatches.has(deviceId)) {
//                     // This match was found with prefix, so update the device ID
//                     const updatedId = `1EMH00${deviceId}`;
//                     updatedRecord['ID'] = updatedId;
//                     finalDeviceId = updatedId;
//                 }


//                 // Extract date_only for DB unique constraint (YYYY-MM-DD format)
//                 let dateOnlyYYYYMMDD = extractDateOnly(record, fileName);

//                 // 🔥 NEW: FALLBACK FOR NO-CONSUMPTION DEVICES (HCA/SmokeDetector)
//                 // If they lack a date column, explicitly try filename date as a valid fallback
//                 if (!dateOnlyYYYYMMDD && isNoConsumptionDevice && fileName) {
//                     const fallbackDate = extractDateFromFilename(fileName);
//                     if (fallbackDate) {
//                         dateOnlyYYYYMMDD = fallbackDate;
//                         console.log(`[FALLBACK DATE] Using filename date for ${deviceType} ${deviceId}: ${fallbackDate}`);
//                     }
//                 }

//                 // 🔥 NEW: REJECT RECORDS WITHOUT DATES (prevents null date bugs)
//                 if (!dateOnlyYYYYMMDD) {
//                     console.error(`[SKIP] No date extracted for ${deviceType} device ${deviceId}`);
//                     console.error(`[SKIP DEBUG] Filename: "${fileName}"`);
//                     console.error(`[SKIP DEBUG] Record fields:`, Object.keys(record).slice(0, 10));
//                     errors.push(`Skipped device ${deviceId} (${deviceType}): No date found in CSV or filename`);
//                     continue; // Don't save records without dates!
//                 }

//                 // SURGICAL FIX: Inject filename date into JSONB if it was extracted from filename
//                 // This ensures chart filters work correctly by having dates in both places
//                 const usedFilenameDate = dateOnlyYYYYMMDD === extractDateFromFilename(  fileName || '');
//                 const hasNoDateFields = !record['Actual Date'] && !record['Raw Date'] && !record['IV,0,0,0,,Date/Time'];

//                 if (usedFilenameDate && hasNoDateFields) {
//                     // Convert YYYY-MM-DD to DD.MM.YYYY for Actual Date
//                     const [year, month, day] = dateOnlyYYYYMMDD.split('-');
//                     updatedRecord['Actual Date'] = `${day}.${month}.${year}`;
//                     updatedRecord['Raw Date'] = `${day}-${month}-${year}`;
//                     console.log(`[JSONB DATE] Injected filename date into JSONB for device ${finalDeviceId}: ${updatedRecord['Actual Date']}`);
//                 }

//                 // CHECK IF THIS RECORD ALREADY EXISTS (check both original and final device ID)
//                 if (dateOnlyYYYYMMDD) {
//                     // Check with final device ID (with prefix if applicable)
//                     const signatureFinal = `${finalDeviceId}|${deviceType}|${dateOnlyYYYYMMDD}`;
//                     // Also check with original device ID (without prefix)
//                     const signatureOriginal = `${deviceId}|${deviceType}|${dateOnlyYYYYMMDD}`;

//                     if (existingSignatures.has(signatureFinal) || existingSignatures.has(signatureOriginal)) {
//                         skippedDuplicates++;
//                         console.log(`[DEDUP] Skipping duplicate: ${signatureFinal}`);
//                         continue; // Skip this duplicate record
//                     }
//                 }

//                 // Prepare database record
//                 const dbRecord: DatabaseRecord = {
//                     local_meter_id: localMeterId || undefined,
//                     device_id: finalDeviceId,
//                     device_type: deviceType,
//                     manufacturer: manufacturer,
//                     frame_type: record['Frame Type']?.toString(),
//                     version: record['Version']?.toString(),
//                     access_number: typeof record['Access Number'] === 'number' ? record['Access Number'] : undefined,
//                     status: record['Status']?.toString(),
//                     encryption: typeof record['Encryption'] === 'number' ? record['Encryption'] : undefined,
//                     parsed_data: updatedRecord,
//                     date_only: dateOnlyYYYYMMDD || undefined
//                 };

//                 dbRecords.push(dbRecord);

//             } catch (error) {
//                 errors.push(`Unexpected error processing record: ${error instanceof Error ? error.message : String(error)}`);
//             }
//         }

//         // Batch insert all records
//         // Duplicates are prevented by:
//         // 1. App-level: checkForDuplicates() skips known duplicates BEFORE insert
//         // 2. DB-level: Unique index on (device_id, device_type, date_only) blocks any that slip through
//         let insertedCount = 0;
//         if (dbRecords.length > 0) {
//           try {
              
//                 const { data, error } = await supabase
//                     .from('parsed_data')
//                     .insert(dbRecords)
//                     .select('device_id');

//                 if (error) {
//                     // Unique constraint violations (error code 23505) mean duplicates were blocked by DB
//                     if (error.code === '23505') {
//                         console.log(`[DEDUP] DB unique constraint blocked ${dbRecords.length} duplicate records`);
//                         insertedCount = 0;
//                         // Count DB-blocked records as skipped duplicates for accurate reporting
//                         skippedDuplicates += dbRecords.length;
//                     } else {
//                         errors.push(`Batch insert error: ${error.message}`);
//                         console.error('Batch insert error details:', error);
//                     }
//                 } else {
//                     insertedCount = data ? data.length : 0;
//                     console.log(`Successfully inserted ${insertedCount} new records`);
//                 }
//             } catch (error) {
//                 errors.push(`Batch insert exception: ${error instanceof Error ? error.message : String(error)}`);
//                 console.error('Batch insert exception:', error);
//             }
//         }

//         return {
//             insertedCount,
//             errors,
//             meterIdStats: {
//                 found: 0,
//                 notFound: 0
//             },
//             skippedDuplicates,
//             skippedHeaders
//         };
//     }