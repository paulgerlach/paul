import { UserRole } from "@/types/UserRole";
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

export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("users")
    .select("permission, agency_id")
    .eq("id", userId)
    .single();
  return (data?.permission as UserRole) || 'user';
}

export async function isSuperAdmin(userId: string): Promise<boolean> {
  return (await getUserRole(userId)) === 'super_admin';
}

export async function isAgencyAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'agency_admin' || role === 'super_admin';
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin' || role === 'super_admin';
}