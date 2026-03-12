'use server'

import { supabaseServer } from "@/utils/supabase/server";

// src/actions/admin/assignPropertyToAgency.ts
export async function assignPropertyToAgency(propertyId: string, agencyId: string) {
  const supabase = await supabaseServer();

  await supabase
    .from("objekte")
    .update({ agency_id: agencyId } )
    .eq("id", propertyId);
}
