'use server'

import { supabaseServer } from "@/utils/supabase/server";

// src/actions/admin/assignPropertyToAgency.ts
export async function assignPropertyToAgency(propertyId: string, agencyId: string) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  await supabase
    .from("objekte")
    .update({ agency_id: agencyId } as any)
    .eq("id", propertyId);
}
