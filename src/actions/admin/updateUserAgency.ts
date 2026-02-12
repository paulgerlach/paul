'use server'

import { isAdmin, isSuperAdmin } from "@/auth";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { supabaseServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserAgency(userId: string, agencyId: string | null) {
    const authenticatedUser = await getAuthenticatedServerUser();
    const isSuperAdminUser = await isSuperAdmin(authenticatedUser.id);
    const isAdminUser = await isAdmin(authenticatedUser.id);

  if (!isSuperAdminUser && !isAdminUser) {
    return {
      success: false,
      error: "Only administrators can change registration settings",
    };
  }
  
  const supabase = await supabaseServer();

  const updateData = agencyId === "" ? { agency_id: null } : { agency_id: agencyId };

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId);

  if (error) {
    console.error("Error updating user agency:", error);
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}
