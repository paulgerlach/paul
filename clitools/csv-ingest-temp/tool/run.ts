import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "../supabase/client";
// import { getCSVData } from "../csv/loader";
// import type { TelegramData } from "../parser/types";
// import { parseTelegram } from "../parser/parse";
// import { ParserError } from "wireless-mbus-parser";
// import { getDecryptionKey } from "./keys";

// moved this here to initialise it for all env variables
import dotenv from "dotenv";
// import { guessDeviceId } from "wireless-mbus-parser";
import { readFileSync } from "fs";
import { Utils } from "../csv/utils";
import { parseRow } from "../parser/parse";
import type { DatabaseRecord } from "../csv/models";
import { getMeterIds } from "../parser/getmeterids";
dotenv.config({ path: "../.env", quiet: true }); // local

export default class CSVDirectInjector {
  client: SupabaseClient;

  filename: string;
  verbose: boolean;
  ingest: boolean;

  constructor(filename: string, verbose: boolean, ingest: boolean) {
    this.filename = filename;
    this.verbose = verbose;
    this.ingest = ingest;

    this.client = getSupabaseClient();
  }

  async run() {
    let totalCount: number = 0;
    let succesCount: number = 0;
    let failedCount: number = 0;

    const text = readFileSync(this.filename).toString("utf-8");

    const processed = Utils.processCSVContent(text);
    let deviceIds: string[] = [];
    let errors: string[] = [];

    const { meterIdMap } = await getMeterIds(this.client, processed);

    try {
      for (const row of processed) {
        totalCount += 1;
        let data: DatabaseRecord;
        try {
          data = await parseRow(row, meterIdMap);
          succesCount += 1;
          console.log(data, "\n");
        } catch (e: any) {
          if (e?.name !== undefined) {
            errors.push(`[${e.deviceId ?? "Unknown"}] ${e.name}:: ${e.message}`);
            failedCount += 1;
          } else {
            errors.push(e)
          }
          continue;
        }

        if (!this.ingest) continue;

        try {
          const sent = await this.client
            .from("parsed_data")
            .insert(data)
            .select();

          if (sent.error !== null) throw Error(`${sent.error.message}`);
        } catch (e: any) {
          console.error("failed upload: ", e);
        }
      }
    } catch (e: any) {
      console.error("CSV iteration error:", e);
    }

    let folder = `./output/${Date.now()}/`;
    Bun.write(`${folder}DeviceIds.txt`, deviceIds.join("\n"));
    Bun.write(`${folder}Errors.txt`, errors.join("\n"));

    console.log(
      `Total: ${totalCount}, Succeeded: ${succesCount}, Failed ${failedCount}`,
    );
  }
}
