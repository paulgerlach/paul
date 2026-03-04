import { WirelessMbusParser, type EvaluatedData } from "wireless-mbus-parser";
import type { DatabaseRecord } from "./models";
import { getDateTimeFromData } from "./dateTime";

export function byteArrayToHexString(byteArray: Uint8Array): string {
  return Array.from(byteArray, function(byte: number) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export async function parseTelegram(
  telegram: Uint8Array,
  key: Buffer<ArrayBufferLike>,
  verbose: boolean,
  meterIDs: Map<string, string>,
  deviceId?: string,
): Promise<DatabaseRecord> {
  const parser = new WirelessMbusParser();
  const parsedMQTT = await parser.parse(Buffer.from(telegram), {
    key,
    containsCrc: false,
    verbose: true,
  });

  if (verbose) console.log(parsedMQTT);
  if (!deviceId) {
    deviceId = parsedMQTT.meter.id;
  }
  const localMeterId: string | undefined = meterIDs.get(deviceId);
  if (!localMeterId) {
    throw {
      deviceId,
      message: `[${deviceId}] Missing Local Meter ID for record`,
      name: "MISSING_LOCAL_ID",
    };
  }

  // this throws
  const dt = getDateTimeFromData(deviceId, parsedMQTT.data);

  const databaseRecord: DatabaseRecord = {
    local_meter_id: localMeterId,
    device_id: parsedMQTT.meter.id,
    device_type: parsedMQTT.meter.deviceType,
    manufacturer: parsedMQTT.meter.manufacturer,
    version: parsedMQTT.meter.version.toString(),
    access_number: parsedMQTT.meter.accessNo,
    status: parsedMQTT.meter.status,
    parsed_data: JSON.stringify(parsedMQTT),
    date_only: dt!,
    
    // frame_type: "", // not sure where to pull this from
    // encryption: 0, // not sure where to pull this from
  };

  // self referential bullshit - lol
  databaseRecord.parsed_data = JSON.stringify(databaseRecord);

  return databaseRecord;
}

