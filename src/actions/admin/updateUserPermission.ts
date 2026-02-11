'use server'

import { isAdmin, isSuperAdmin } from "@/auth";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { supabaseServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserPermission(userId: string, permission: string) {
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

  const { error } = await supabase
    .from("users")
    .update({ permission })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user permission:", error);
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}
