'use server'

import { TablesUpdate } from "@/types/supabase";
import { supabaseServer } from "@/utils/supabase/server";

// src/actions/admin/assignPropertyToAgency.ts
export async function assignPropertyToAgency(propertyId: string, agencyId: string) {
  const supabase = await supabaseServer();

  const update: TablesUpdate<"objekte"> = { agency_id: agencyId };

  await supabase
    .from("objekte")
    .update(update)
    .eq("id", propertyId);
}
