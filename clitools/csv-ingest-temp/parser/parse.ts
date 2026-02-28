import type { DatabaseRecord, ParsedRecord } from "../csv/models";
import { extractDateTimeFromHCA } from "./datetime";

export function byteArrayToHexString(byteArray: Uint8Array): string {
  return Array.from(byteArray, function(byte: number) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export async function parseRow(
  record: ParsedRecord,
  meterIDs: Map<string, string>,
): Promise<DatabaseRecord> {
  // Extract core fields - support both old and new CSV formats
  const deviceId = (record["ID"] || record["Number Meter"])?.toString() || "";

  const deviceType = record["Device Type"]?.toString() || "";

  if (deviceType !== "HCA") {
    throw {
      deviceId,
      message: `[${deviceId}] Device type was not HCA`,
      name: "WRONG_DEVICE",
    };
  }

  const manufacturer =
    (record["Manufacturer"] || record["Telegram Type"])?.toString() || "";

  if (!deviceId || !deviceType || !manufacturer) {
    throw {
      deviceId,
      message: `[${deviceId}] Missing ID, Type or Manufacturer`,
      name: "MISSING_PARAMS",
    };
    // throw Error(`Missing required fields for record: ${JSON.stringify(record)}`);
  }

  // Get local meter
  const localMeterId: string | undefined = meterIDs.get(deviceId);
  if (!localMeterId) {
    throw {
      deviceId,
      message: `[${deviceId}] Missing Local Meter ID for record`,
      name: "MISSING_LOCAL_ID",
    };
    // throw Error(`Missing required fields for record: ${JSON.stringify(record)}`);
  }

  // Get date
  let recordDate = extractDateTimeFromHCA(record);
  console.log(recordDate);
  if (!recordDate) {
    throw { message: `[${deviceId}] Date was null`, name: "BAD_DATE" };
  }

  // Formulate record
  const dbRecord: DatabaseRecord = {
    local_meter_id: localMeterId || undefined,
    device_id: deviceId,
    device_type: deviceType,
    manufacturer: manufacturer,
    frame_type: record["Frame Type"]?.toString(),
    version: record["Version"]?.toString(),
    access_number:
      typeof record["Access Number"] === "number"
        ? record["Access Number"]
        : undefined,
    status: record["Status"]?.toString(),
    encryption:
      typeof record["Encryption"] === "number"
        ? record["Encryption"]
        : undefined,
    parsed_data: record,
    date_only: recordDate,
  };

  return dbRecord;
}
