import { createClient } from "@supabase/supabase-js";
import config from "../config/environment.js";
import { Database } from "../../../../src/utils/supabase/database.types.js";

const exitAppMissingSupabaseFeatures = () => {
  console.error("Failed to start, supabase instance url or serviceKey missing");
  process.exit(1);
};

const supabase = createClient<Database>(
  config.supabase.url ?? exitAppMissingSupabaseFeatures(),
  config.supabase.serviceKey ?? exitAppMissingSupabaseFeatures(),
);

export default supabase;
