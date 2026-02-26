import { createClient } from "@supabase/supabase-js";
import config from "../config/environment.js";
import { Database } from "../../../../src/utils/supabase/database.types.js";
import { exitAppWithError } from "../errors/generalError.js";


const supabase = createClient<Database>(
  config.supabase.url ?? exitAppWithError("Failed to start, supabase instance url or serviceKey missing"),
  config.supabase.serviceKey ?? exitAppWithError("Failed to start, supabase instance url or serviceKey missing"),
);

export default supabase;
