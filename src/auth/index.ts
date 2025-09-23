import { supabaseServer } from "@/utils/supabase/server";

export async function isAdminUser(userId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("users")
    .select("permission")
    .eq("id", userId)
    .single();

  if (error || !data) return false;

  return data.permission === "admin";
}
