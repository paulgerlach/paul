import { batchLookupMeterIds } from "../db/queries.ts";

export const getMappedRecords = async (uniqueDeviceIds: string[]) => {
  console.log("DEBUG: Entered getMappedRecords");
  const errors: string[] = [];
  try{
    console.log("DEBUG: Before batchLookupMeterIds call");
    const { meterIdMap, prefixedMatches } = await batchLookupMeterIds(uniqueDeviceIds);
    console.log("DEBUG: After batchLookupMeterIds call");
  } catch (error) {
    // ...
  }
}