import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "../supabase/client";
import { getCSVData } from "../csv/loader";
import type { TelegramData } from "../parser/types";
import { parseTelegram } from "../parser/parse";


export default class CSVTelegramSupabaseUploader {
    client: SupabaseClient
    
    csvFilepath: string; 
    verbose: boolean;
    ingest: boolean;

    constructor(csvFilepath: string, verbose: boolean, ingest: boolean) {
        this.csvFilepath = csvFilepath;
        this.verbose = verbose;
        this.ingest = ingest;

        this.client = getSupabaseClient();
    }


    async run() {
        const parser = await getCSVData(this.csvFilepath);

        for await (const row of parser) {
            let data: TelegramData;
            try {
                data = await parseTelegram(row.telegram, '', this.verbose);
                console.log("Gateway: ", row.gateway_eui);
                console.log(data, '\n');
            }
            catch (e: any) {
                continue;
            }

            if (!this.ingest) continue;

            try {
                const sent = await this.client
                    .from('parsed_data')
                    .insert([{
                        device_id: data.device_id,
                        device_type: data.device_type,
                        manufacturer: data.manufacturer,
                        version: data.version,
                        status: data.status,
                        parsed_data: data.src_data,
                    }])
                    .select();

                if (sent.error !== null) throw Error(`${sent.error.message}`);
            }
            catch (e: any) {
                console.error("failed upload: ", e);
            }
        }
    }
}