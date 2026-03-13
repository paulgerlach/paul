import { SupabaseClient } from "@supabase/supabase-js";
import { ParsedRecord } from "./models.ts";

export const getMeterIds = async (
  supabase: SupabaseClient,
  records: ParsedRecord[],
): Promise<{
  meterIdMap: Map<string, string>;
  prefixedMatches: Set<string>;
  uniqueDeviceIds: string[];
}> => {
  const deviceIds = records
    .map((record) => (record["ID"] || record["Number Meter"])?.toString())
    .filter((id) => id) as string[];

  const uniqueDeviceIds = [...new Set(deviceIds)];
  const { meterIdMap, prefixedMatches } = await isolateMeterIds(
    supabase,
    uniqueDeviceIds,
  );
  return {meterIdMap, prefixedMatches, uniqueDeviceIds };
};

const isolateMeterIds = async (
  supabase: SupabaseClient,
  deviceIds: string[],
): Promise<{
  meterIdMap: Map<string, string>;
  prefixedMatches: Set<string>;
}> => {
  const meterIdMap = new Map<string, string>();
  const prefixedMatches = new Set<string>();

  if (deviceIds.length === 0) return { meterIdMap, prefixedMatches };

  try {
    // Get all unique device IDs
    const uniqueDeviceIds = [...new Set(deviceIds)];

    // 🔍 DIAGNOSTIC: Log first 10 device IDs being looked up
    console.log(
      `[METER LOOKUP] Looking up ${uniqueDeviceIds.length} unique device IDs`,
    );
    console.log(
      `[METER LOOKUP] First 10 device IDs from CSV:`,
      uniqueDeviceIds.slice(0, 10),
    );

    // Create potential Elec device IDs with 1EMH00 prefix
    const elecDeviceIds = uniqueDeviceIds.map((id) => `1EMH00${id}`);
    const allSearchIds = [...uniqueDeviceIds, ...elecDeviceIds];

    // Single query to get all possible matches
    const { data: meters, error } = await supabase
      .from("local_meters")
      .select("id, meter_number")
      .in("meter_number", allSearchIds);

    if (error) {
      console.error("Error batch fetching meter IDs:", error);
      console.error(
        "[METER LOOKUP] Query failed - ALL device IDs will show as unlinked",
      );
      return { meterIdMap, prefixedMatches };
    }

    // 🔍 DIAGNOSTIC: Log what the database returned
    console.log(
      `[METER LOOKUP] Database returned ${meters?.length || 0} matching meters`,
    );
    if (meters && meters.length > 0) {
      console.log(
        `[METER LOOKUP] Matched meter_numbers from DB:`,
        meters
          .map((m: { meter_number: string }) => m.meter_number)
          .slice(0, 10),
      );
    }

    if (meters) {
      // Create lookup map
      const meterLookup = new Map<string, string>();
      meters.forEach((meter: { id: string; meter_number: string }) => {
        meterLookup.set(meter.meter_number, meter.id);
      });

      // Map device IDs to local_meter_ids, preferring exact matches
      uniqueDeviceIds.forEach((deviceId) => {
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
    const unmatchedIds = uniqueDeviceIds.filter((id) => !meterIdMap.has(id));
    if (unmatchedIds.length > 0) {
      console.warn(
        `[METER LOOKUP] ${unmatchedIds.length} device IDs NOT found in local_meters`,
      );
      console.warn(
        `[METER LOOKUP] First 10 unmatched IDs:`,
        unmatchedIds.slice(0, 10),
      );
      console.warn(
        `[METER LOOKUP] ⚠️ These meters may need to be registered in local_meters table, or the meter_number format may not match the CSV device ID`,
      );
    }
  } catch (error) {
    console.error("Error in batch meter ID lookup:", error);
  }

  return { meterIdMap, prefixedMatches };
};
