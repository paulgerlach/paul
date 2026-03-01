import { SupabaseClient } from "@supabase/supabase-js";

export const getMeterIds = async (
  supabase: SupabaseClient,
): Promise<{
  meterIdMap: Map<string, string>;
}> => {
  const { meterIdMap } = await isolateMeterIds(supabase);
  return { meterIdMap };
};

const isolateMeterIds = async (
  supabase: SupabaseClient,
): Promise<{
  meterIdMap: Map<string, string>;
}> => {
  const meterIdMap = new Map<string, string>();
  try {
    const { data: meters, error } = await supabase
      .from("local_meters")
      .select("id, meter_number");

    if (error) {
      console.error("Error batch fetching meter IDs:", error);
      console.error(
        "[METER LOOKUP] Query failed - ALL device IDs will show as unlinked",
      );
      return { meterIdMap };
    }

    if (meters) {
      meters.forEach((meter: { id: string; meter_number: string }) => {
        meterIdMap.set(meter.meter_number, meter.id);
      });
    }
  } catch (error) {
    console.error("Error in batch meter ID lookup:", error);
  }

  return { meterIdMap };
};
