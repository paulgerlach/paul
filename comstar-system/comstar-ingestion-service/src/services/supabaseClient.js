import { createClient } from '@supabase/supabase-js';
import config from '../config/environment.js';

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

export default supabase;
