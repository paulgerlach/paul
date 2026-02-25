// Just use the npm: prefix directly in the import

import { createClient } from "@supabase/supabase-js";


export const getSupabaseClient = () => {
  try{
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    console.log('Creating Supabase client with URL:', Deno.env.get('SUPABASE_URL'));
    console.log('Using service role key:', serviceRoleKey ? 'Yes' : 'No');
    return createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            },
            db: { schema: 'public' },
            global: {
                headers: {
                    Authorization: `Bearer ${serviceRoleKey}`
                }
            }
        }
    );
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw new Error(`Failed to create Supabase client: ${error instanceof Error ? error.message : String(error)}`);
  }
}