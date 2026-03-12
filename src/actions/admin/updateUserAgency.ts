'use server'

import { Database } from "@/utils/supabase/database.types";
import { supabaseServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserAgency(userId: string, agencyId: string | null) {  
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from("users")
    .update({ agency_id: agencyId } as Database["public"]["Tables"]["users"]["Update"])
    .eq("id", userId);


  if (error) {
    console.error("Error updating user agency:", error);
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}
