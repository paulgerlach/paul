import { WirelessMbusParser, type EvaluatedData } from "wireless-mbus-parser";
import type { DatabaseRecord } from "./models";
import { getDateTimeFromData } from "./dateTime";
import type { MeterReading } from "./types";

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
    device_type: parsedMQTT.meter.deviceType === 'Heat Cost Allocator' ? 'HCA' : 'Unknown',
    manufacturer: parsedMQTT.meter.manufacturer,
    version: parsedMQTT.meter.version.toString(),
    access_number: parsedMQTT.meter.accessNo,
    status: parsedMQTT.meter.status === 'No error' ? '00h' : parsedMQTT.meter.status,
    parsed_data: JSON.stringify(transformMbusToWebFormat(
      parsedMQTT.data,
      parsedMQTT.meter.id,
      parsedMQTT.meter.manufacturer,
      parsedMQTT.meter.deviceType === 'Heat Cost Allocator' ? 'HCA' : 'Unknown',
      parsedMQTT.meter.version.toString(),
      parsedMQTT.meter.status ?? '',
      parsedMQTT.meter.accessNo ?? 0
    )),
    date_only: dt!,
  };

  // self referential bullshit - lol

  return databaseRecord;
}

function transformMbusToWebFormat(
  readings: EvaluatedData[],
  meterId: string,
  meterManufacturer: string,
  meterDeviceType: string,
  version: string,
  status: string,
  accessNo: number,
): MeterReading {
  const result: Partial<MeterReading> = {
    "Manufacturer": meterManufacturer,
    "ID": meterId,
    "Version": version,
    "Device Type": meterDeviceType,
    "Access Number": accessNo,
    "Status": status,
  };

  if (!Array.isArray(readings)) return result as MeterReading;

  const formatDate = (value: unknown): string => {
    const d = new Date(String(value));
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}.${month}.${year}`;
  };

  let dateCount = 0;

  for (const item of readings) {
    if (!item?.description) continue;

    if (item.description === "Time point" && item.type === "DateTime" && !result["IV,0,0,0,,Date/Time"]) {
      const d = new Date(String(item.value));
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      result["IV,0,0,0,,Date/Time"] = `${day}.${month}.${year} ${hours}:${minutes}`;
    } else if (item.description === "Time point" && item.type === "Date") {
      const key = `IV,${dateCount + 1},0,0,,Date` as keyof MeterReading;
      (result as Record<string, unknown>)[key] = formatDate(item.value);
      dateCount++;

    } else if (item.description === "Units for H.C.A.") {
      const storageNo = item.info?.storageNo ?? 0;
      const targetIndex = storageNo === 1 ? 28 : storageNo;
      const key = `IV,${targetIndex},0,0,,Units HCA` as keyof MeterReading;
      (result as Record<string, unknown>)[key] = item.value as number;
    }
  }

  return result as MeterReading;
}