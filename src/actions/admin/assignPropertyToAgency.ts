import { isSuperAdmin } from "@/auth";
import { supabaseServer } from "@/utils/supabase/server";

// src/actions/admin/assignPropertyToAgency.ts
export async function assignPropertyToAgency(propertyId: string, agencyId: string) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isSuperAdmin(user.id))) {
    throw new Error("Unauthorized");
  }

  await supabase
    .from("objekte")
    .update({ agency_id: agencyId })
    .eq("id", propertyId);
}
