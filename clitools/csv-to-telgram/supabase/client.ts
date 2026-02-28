import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // local

let supabase: SupabaseClient | undefined = undefined;

export function getSupabaseClient(): SupabaseClient {
    if (!supabase) {
        const url: string | undefined = process.env.SUPABASE_URL;
        const key: string | undefined = process.env.SUPABASE_SECRET_KEY;
        
        if (!url) throw Error("SUPABASE_URL not set");
        if (!key) throw Error("SUPABASE_SECRET_KEY not set");

        supabase = createClient(url, key);
    }

    return supabase;
}