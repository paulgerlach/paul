'use server'

import { supabaseServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserAgency(userId: string, agencyId: string | null) {  
  const supabase = await supabaseServer();

  const updateData = agencyId === "" ? { agency_id: null } : { agency_id: agencyId };

  const { error } = await supabase
    .from("users")
    .update(updateData as never)
    .eq("id", userId);

  if (error) {
    console.error("Error updating user agency:", error);
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}
