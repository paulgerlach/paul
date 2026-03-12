'use server'

import { supabaseServer } from "@/utils/supabase/server";

// src/actions/admin/assignPropertyToAgency.ts
export async function assignPropertyToAgency(propertyId: string, agencyId: string) {
  const supabase = await supabaseServer();

  const updateData = agencyId === "" ? { agency_id: null } : { agency_id: agencyId };
  await (supabase
    .from("objekte") as any)
    .update(updateData as never)
    .eq("id", propertyId);
}
