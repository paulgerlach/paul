import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "../supabase/client";
import { getCSVData } from "../csv/loader";
import type { TelegramData } from "../parser/types";
import { parseTelegram } from "../parser/parse";
// import { ParserError } from "wireless-mbus-parser";
import { getDecryptionKey } from "./keys";

// moved this here to initialise it for all env variables
import dotenv from "dotenv";
import { guessDeviceId } from "wireless-mbus-parser";
import { getMeterIds } from "../parser/getmeterids";
import type { DatabaseRecord } from "../parser/models";
dotenv.config({ path: "../.env", quiet: true }); // local

export default class CSVTelegramSupabaseUploader {
  client: SupabaseClient;

  csvFilepath: string;
  verbose: boolean;
  ingest: boolean;
  key: string;

  constructor(csvFilepath: string, verbose: boolean, ingest: boolean) {
    this.csvFilepath = csvFilepath;
    this.verbose = verbose;
    this.ingest = ingest;

    this.client = getSupabaseClient();
    this.key = getDecryptionKey();
  }


  async run() {
    let totalCount: number = 0;
    let succesCount: number = 0;
    let failedCount: number = 0;
    const keyBuffer = Buffer.from(this.key, "hex");
    const parser = await getCSVData(this.csvFilepath);
    let deviceIds: string[] = [];
    let errors: string[] = [];

    //prevents duplication
    let uploaded: Set<string> = new Set<string>();

    const { meterIdMap } = await getMeterIds(this.client);

    try {
      for await (const row of parser) {
        if (!row.telegram) throw new Error("null telegram");

        const telegram = row.telegram as Buffer;

        let deviceId: string | undefined;
        try {
          const info = guessDeviceId(telegram);
          deviceId = info.substring(4);
          deviceIds.push(deviceId)
        } catch (_) { }


        totalCount += 1;
        let dbRecord: DatabaseRecord;
        try {
          dbRecord = await parseTelegram(telegram, keyBuffer, this.verbose, meterIdMap, deviceId);
          succesCount += 1;
          console.log("Gateway: ", row.gateway_eui);
          console.log(dbRecord, '\n');
        } catch (e: any) {
          if (e?.name === "NO_AES_KEY") {
            
            errors.push(`${deviceId ?? "Unknown Device"}, ParserError [${e.name}]:: ${e.message}`);
          } else if (e?.name !== "NO_AES_KEY") {
            errors.push(`${deviceId ?? "Unknown Device"}, Other [${e.name}]: ${e.message}`);
          } else {
            errors.push(
              `${deviceId ?? "Unknown Device"}, [${e?.constructor?.name}] name=${e?.name} msg=${e?.message}`,
            );
          }
          failedCount += 1;
          continue;
        }

        if (!this.ingest) continue;

        let key = `${dbRecord.device_id}${dbRecord.manufacturer}${dbRecord.date_only}`;
        if (uploaded.has(key)) continue;
        uploaded.add(key);

        try {
          const sent = await this.client
            .from("parsed_data")
            .insert(dbRecord)
            // [
            //   {
            //     device_id: dbRecord.device_id,
            //     device_type: dbRecord.device_type,
            //     manufacturer: dbRecord.manufacturer,
            //     version: dbRecord.version,
            //     status: dbRecord.status,
            //     parsed_data: dbRecord.parsed_data,
            //   },
            // ])
            .select();

          if (sent.error !== null) throw Error(`${sent.error.message}`);
        } catch (e: any) {
          console.error("failed upload: ", e);
        }
      }
    } catch (e: any) {
      console.error("CSV iteration error:", e);
    }

    let folder = `./output/${Date.now()}/`
    Bun.write(`${folder}DeviceIds.txt`, deviceIds.join("\n"))
    Bun.write(`${folder}Errors.txt`, errors.join("\n"))

    console.log(
      `Total: ${totalCount}, Succeeded: ${succesCount}, Failed ${failedCount}`,
    );
  }
}
