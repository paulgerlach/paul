import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import database from "@/db";
import { tenants } from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { supabase } from "@/utils/supabase/client";

export const fetchCsvData = async (): Promise<Record<string, string>[]> => {
  const filePath = path.resolve(
    process.cwd(),
    "public/data/cleaned_heat_meter_data.csv"
  );

  try {
    const text = await fs.readFile(filePath, "utf-8");

    return new Promise((resolve, reject) => {
      Papa.parse<Record<string, string>>(text, {
        skipEmptyLines: true,
        header: true, // Enable header parsing
        delimiter: ",",
        quoteChar: '"',
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(results.errors);
          } else {
            resolve(results.data);
          }
        },
        error: reject,
      });
    });
  } catch (err) {
    console.error("CSV file not found at:", filePath);
    throw err;
  }
};

export async function getTenantsByLocalIDWithAuth(localID: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  const result = await database
    .select()
    .from(tenants)
    .where(and(eq(tenants.local_id, localID), eq(tenants.user_id, user.id)));

  return result;
}
