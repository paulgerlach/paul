import { readFileSync } from "fs";
import type { DatabaseRecord } from "./models";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "../supabase/client";


export class Injector {
    client: SupabaseClient;
    records: DatabaseRecord[];

    constructor(filepath: string) {
        this.client = getSupabaseClient();

        const content = readFileSync(filepath, 'utf-8');
        this.records = JSON.parse(content);
    }

    async run() {
        for (let record of this.records) {
            try {
                const {interpolated, ...clean} = record;
                const sent = await this.client
                    .from("parsed_data")
                    .insert(clean)
                    .select();

                if (sent.error !== null) throw Error(`${sent.error.message}`);
            } catch (e: any) {
                console.error("failed upload: ", e);
            }
        }
    }
};