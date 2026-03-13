// import { DatabaseRecord, ParsedRecord } from "./models.ts";
//
// export interface ParserResult {
//   errors: string[];
//   skippedCount: number;
//   insertedCount: number;
//   dbRecords: DatabaseRecord[];
// }
//
// export const parseRecords = (records: ParsedRecord[]) => {
//   const parserResult: ParserResult = {
//     errors: [],
//     skippedCount: 0,
//     insertedCount: 0,
//     dbRecords: [],
//   };
//
//   for (const record of records) {
//     try {
//       // Extract core fields - support both old and new CSV formats
//       const deviceId = (record["ID"] || record["Number Meter"])?.toString() ||
//         "";
//       const deviceType = record["Device Type"]?.toString() || "";
//       const manufacturer =
//         (record["Manufacturer"] || record["Telegram Type"])?.toString() || "";
//
//       // SKIP HEADER ROWS: Check if this is a header row being parsed as data
//       if (
//         deviceId === "ID" ||
//         deviceType === "Device Type" ||
//         deviceId === "Number Meter"
//       ) {
//         skippedHeaders++;
//         console.log(
//           `[HEADER SKIP] Skipping header row: ID="${deviceId}", Type="${deviceType}"`,
//         );
//         continue;
//       }
//
//       // 🔥 RELAXED VALIDATION: SmokeDetector and HCA don't have standard consumption columns
//       const noConsumptionDevices = ["SmokeDetector", "HCA"];
//       const isNoConsumptionDevice = noConsumptionDevices.includes(deviceType);
//
//       if (!deviceId || !deviceType || !manufacturer) {
//         parserResult.errors.push(
//           `Missing required fields for record: ${JSON.stringify(record)}`,
//         );
//         continue;
//       }
//
//       // Get local_meter_id from cache
//       const localMeterId = meterIdMap.get(deviceId) || null;
//
//       // For Elec devices, determine if we need to update the device ID
//       const updatedRecord = { ...record };
//
//       let finalDeviceId = deviceId;
//
//       // 🔥 RELAXED VALIDATION: SmokeDetector and HCA don't have standard consumption columns
//       // (Already defined above)
//
//       // 🔥 NEW: Alarm/Status Handling for Smoke Detectors AND HCAs
//       // Both device types use the Status field to report errors/alarms.
//       // We map this directly to the ErrorFlags field so the frontend/notification logic can interpret it.
//       if (deviceType === "SmokeDetector" || deviceType === "HCA") {
//         const status = record["Status"];
//         // If Status is present and not 0/00/00h, treat as Error/Alarm
//         if (
//           status &&
//           status !== "0" &&
//           status !== "00" &&
//           status !== "00h" &&
//           status !== 0
//         ) {
//           console.log(
//             `[STATUS] ${deviceType} ${deviceId} has status ${status} - mapping to ErrorFlag`,
//           );
//           // STATUS conversion:
//
//           // Treat status as Hex (common in MBus CSVs). Convert to binary string with "0b" prefix.
//           // This prevents ambiguity in the interpreter (e.g. "04" being parsed as binary "0").
//           const code = parseInt(String(status), 16);
//           if (!isNaN(code)) {
//             updatedRecord["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"] =
//               "0b" + code.toString(2);
//           }
//         }
//       }
//
//       if (
//         deviceType === "Elec" &&
//         localMeterId &&
//         prefixedMatches.has(deviceId)
//       ) {
//         // This match was found with prefix, so update the device ID
//         const updatedId = `1EMH00${deviceId}`;
//         updatedRecord["ID"] = updatedId;
//         finalDeviceId = updatedId;
//       }
//
//       // Extract date_only for DB unique constraint (YYYY-MM-DD format)
//       let dateOnlyYYYYMMDD = extractDateOnly(record, fileName);
//
//       // 🔥 NEW: FALLBACK FOR NO-CONSUMPTION DEVICES (HCA/SmokeDetector)
//       // If they lack a date column, explicitly try filename date as a valid fallback
//       if (!dateOnlyYYYYMMDD && isNoConsumptionDevice && fileName) {
//         const fallbackDate = extractDateFromFilename(fileName);
//         if (fallbackDate) {
//           dateOnlyYYYYMMDD = fallbackDate;
//           console.log(
//             `[FALLBACK DATE] Using filename date for ${deviceType} ${deviceId}: ${fallbackDate}`,
//           );
//         }
//       }
//
//       // 🔥 NEW: REJECT RECORDS WITHOUT DATES (prevents null date bugs)
//       if (!dateOnlyYYYYMMDD) {
//         console.error(
//           `[SKIP] No date extracted for ${deviceType} device ${deviceId}`,
//         );
//         console.error(`[SKIP DEBUG] Filename: "${fileName}"`);
//         console.error(
//           `[SKIP DEBUG] Record fields:`,
//           Object.keys(record).slice(0, 10),
//         );
//         errors.push(
//           `Skipped device ${deviceId} (${deviceType}): No date found in CSV or filename`,
//         );
//         continue; // Don't save records without dates!
//       }
//
//       // SURGICAL FIX: Inject filename date into JSONB if it was extracted from filename
//       // This ensures chart filters work correctly by having dates in both places
//       const usedFilenameDate =
//         dateOnlyYYYYMMDD === extractDateFromFilename(fileName || "");
//       const hasNoDateFields = !record["Actual Date"] &&
//         !record["Raw Date"] &&
//         !record["IV,0,0,0,,Date/Time"];
//
//       if (usedFilenameDate && hasNoDateFields) {
//         // Convert YYYY-MM-DD to DD.MM.YYYY for Actual Date
//         const [year, month, day] = dateOnlyYYYYMMDD.split("-");
//         updatedRecord["Actual Date"] = `${day}.${month}.${year}`;
//         updatedRecord["Raw Date"] = `${day}-${month}-${year}`;
//         console.log(
//           `[JSONB DATE] Injected filename date into JSONB for device ${finalDeviceId}: ${
//             updatedRecord["Actual Date"]
//           }`,
//         );
//       }
//
//       // CHECK IF THIS RECORD ALREADY EXISTS (check both original and final device ID)
//       if (dateOnlyYYYYMMDD) {
//         // Check with final device ID (with prefix if applicable)
//         const signatureFinal =
//           `${finalDeviceId}|${deviceType}|${dateOnlyYYYYMMDD}`;
//         // Also check with original device ID (without prefix)
//         const signatureOriginal =
//           `${deviceId}|${deviceType}|${dateOnlyYYYYMMDD}`;
//
//         if (
//           existingSignatures.has(signatureFinal) ||
//           existingSignatures.has(signatureOriginal)
//         ) {
//           skippedDuplicates++;
//           console.log(`[DEDUP] Skipping duplicate: ${signatureFinal}`);
//           continue; // Skip this duplicate record
//         }
//       }
//
//       // Prepare database record
//       const dbRecord: DatabaseRecord = {
//         local_meter_id: localMeterId || undefined,
//         device_id: finalDeviceId,
//         device_type: deviceType,
//         manufacturer: manufacturer,
//         frame_type: record["Frame Type"]?.toString(),
//         version: record["Version"]?.toString(),
//         access_number: typeof record["Access Number"] === "number"
//           ? record["Access Number"]
//           : undefined,
//         status: record["Status"]?.toString(),
//         encryption: typeof record["Encryption"] === "number"
//           ? record["Encryption"]
//           : undefined,
//         parsed_data: updatedRecord,
//         date_only: dateOnlyYYYYMMDD || undefined,
//       };
//
//       parserResult.dbRecords.push(dbRecord);
//     } catch (error) {
//       parserResult.errors.push(
//         `Unexpected error processing record: ${
//           error instanceof Error ? error.message : String(error)
//         }`,
//       );
//     }
//   }
// };
