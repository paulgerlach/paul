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
import { exit } from "node:process";
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
    let successIds: string[] = [];

    let records: DatabaseRecord[] = [];

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
          deviceIds.push(deviceId);
        } catch (_) { }

        // if (deviceId !== "54919619") {
        //   continue
        // }

        totalCount += 1;
        let dbRecord: DatabaseRecord;
        try {
          dbRecord = await parseTelegram(
            telegram,
            keyBuffer,
            this.verbose,
            meterIdMap,
            deviceId,
          );
          // HERE
          succesCount += 1;
          console.log("Gateway: ", row.gateway_eui);
          console.log(dbRecord, "\n");
          if (deviceId) {
            successIds.push(deviceId);
          }
        } catch (e: any) {
          if (e?.name === "NO_AES_KEY") {
            errors.push(
              `${deviceId ?? "Unknown Device"}, ParserError [${e.name}]:: ${e.message}`,
            );
          } else if (e?.name !== "NO_AES_KEY") {
            errors.push(
              `${deviceId ?? "Unknown Device"}, Other [${e.name}]: ${e.message}`,
            );
          } else {
            errors.push(
              `${deviceId ?? "Unknown Device"}, [${e?.constructor?.name}] name=${e?.name} msg=${e?.message}`,
            );
          }
          failedCount += 1;
          continue;
        }

        interface Timepoint {
          start_date: Date;
          total: number;
          days: number;
        }

        interface DayRecord {
          date: Date;
          value: number;
        }

        const interpolate_days = (total: number, days: number, start_date: Date): DayRecord[] => {
          const d = Math.floor(total / days);
          const r = total % days;

          let result: DayRecord[] = new Array(days).fill({ value: d });

          result = result.map((o, i) => {
            return {
              date: new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate() + i),
              value: o.value
            };
          });

          for (let i = 0; i < r; ++i) {
            result[result.length - i - 1]!.value++;
          }

          return result;
        };

        const create_time_point = (days: number, date: Date, total?: number): Timepoint => {
          if (total === undefined) exit(1);
          if (total < 0 || total > 60_000) total = 0;
          if (total > 1_000) {
            exit(1);
          }

          return {
            days: days,
            total: total,
            start_date: date,
          } as Timepoint;
        };


        const dec_h1 = dbRecord.parsed_data?.["IV,27,0,0,,Units HCA"];
        const dec_h2 = dbRecord.parsed_data?.["IV,28,0,0,,Units HCA"];
        const jan_h1 = dbRecord.parsed_data?.["IV,29,0,0,,Units HCA"];
        const jan_h2 = dbRecord.parsed_data?.["IV,30,0,0,,Units HCA"];
        const feb_h1 = dbRecord.parsed_data?.["IV,31,0,0,,Units HCA"];

        const feb_h2 =
          dbRecord.parsed_data!["IV,0,0,0,,Units HCA"]!
          - dbRecord.parsed_data!["IV,1,0,0,,Units HCA"]!
          - jan_h1! - jan_h2! - feb_h1!;

        const bimonthly_data: Timepoint[] = [
          create_time_point(15, new Date("2025-12-01T05:00:00.000Z"), dec_h1),
          create_time_point(16, new Date("2025-12-16T05:00:00.000Z"), dec_h2),
          create_time_point(15, new Date("2026-01-01T05:00:00.000Z"), jan_h1),
          create_time_point(16, new Date("2026-01-16T05:00:00.000Z"), jan_h2),
          create_time_point(15, new Date("2026-02-01T05:00:00.000Z"), feb_h1),
          create_time_point(13, new Date("2026-02-16T05:00:00.000Z"), feb_h2),
        ];


        for (let timepoint of bimonthly_data) {
          const days = interpolate_days(timepoint.total, timepoint.days, timepoint.start_date);

          for (let day of days) {
            const record: DatabaseRecord = {
              ...dbRecord,
              date_only: `${day.date.getFullYear()}-${day.date.getMonth() + 1}-${day.date.getDate()}`,
              parsed_data: {
                ...dbRecord.parsed_data,
                "IV,0,0,0,,Date/Time": `${day.date.getDate()}.${day.date.getMonth() + 1}.${day.date.getFullYear()} 00:01`,
                "IV,0,0,0,,Units HCA": day.value,
                "IV,24,0,0,,Units HCA": 0,
                "IV,25,0,0,,Units HCA": 0,
                "IV,26,0,0,,Units HCA": 0,
                "IV,27,0,0,,Units HCA": 0,
                "IV,28,0,0,,Units HCA": 0,
                "IV,29,0,0,,Units HCA": 0,
                "IV,30,0,0,,Units HCA": 0,
                "IV,31,0,0,,Units HCA": 0,
              }
            } as DatabaseRecord;
            if (record.parsed_data!["IV,1,0,0,,Date"]! === "30.11.1999") continue;
            if (record.parsed_data!["IV,1,0,0,,Date"]! !== "31.12.2025") exit(1);
            records.push(record);
          }
        }
        // convert to DBRecord, jsonify -> output file

        // console.log(records);
      }
    } catch (e: any) {
      console.error("CSV iteration error:", e);
    }

    let folder = `./output/${Date.now()}/`;
    Bun.write(`${folder}SuccessIds.txt`, successIds.join("\n"));
    Bun.write(`${folder}DeviceIds.txt`, deviceIds.join("\n"));
    Bun.write(`${folder}Errors.txt`, errors.join("\n"));

    Bun.write(`out.txt`, JSON.stringify(records, null, 2));

    console.log(
      `Total: ${totalCount}, Succeeded: ${succesCount}, Failed ${failedCount}`,
    );
  }
}
