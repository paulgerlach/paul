'use server'

import { supabaseServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserPermission(userId: string, permission: string) {
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
