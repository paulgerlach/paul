import { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseRecord } from "./models.ts";

export interface InserterResult {
  errors: string[];
  skippedCount: number;
  insertedCount: number;
}

const BATCH_SIZE = 10; //Thulo, Liam, tweak as needed for testing.

export const doInsert = async (
  supabase: SupabaseClient,
  dbRecords: DatabaseRecord[],
): Promise<InserterResult> => {
  // let errors: string[] = [];
  // let skippedCount = 0;
  // let insertedCount = 0;
  const inserterResult: InserterResult = {
    errors: [],
    skippedCount: 0,
    insertedCount: 0,
  };

  if (dbRecords.length > 0) {
    for (let i = 0; i < dbRecords.length; i += BATCH_SIZE) {
      // if i+batchsize > dbRecords.length -- 
      const batch = dbRecords.slice(i, i + BATCH_SIZE);
      const { data, error } = await supabase
        .from("parsed_data")
        .insert(dbRecords)
        .select("device_id");

      if (!error) {
        inserterResult.insertedCount += data.length ?? 0;
        continue;
      }

      if (error.code === "23505") {
        for (const record of batch) {
          const { error: singleRowInsertError } = await supabase
            .from("parsed_data")
            .insert(record);
          if (singleRowInsertError && singleRowInsertError.code !== "23505") {
            inserterResult.errors.push(
              `Insert error for ${record.device_id}: ${singleRowInsertError.message}`,
            );
          } else if (!singleRowInsertError) {
            inserterResult.insertedCount++;
          } else {
            inserterResult.skippedCount++;
          }
        }
      } else {
        inserterResult.errors.push(`Batch insert error: ${error.message}`);
      }

    }
  }

  return inserterResult;
};
