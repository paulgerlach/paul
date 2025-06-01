"use server";

import { type CreateTenantFormValues } from "@/components/Admin/Forms/Create/CreateTenantForm";
import database from "@/db";
import { tenants } from "@/db/drizzle/schema";
import { TenantType } from "@/types";
import { supabaseServer } from "@/utils/supabase/server";

export async function createTenant(
  formData: CreateTenantFormValues,
  localID: string
) {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Supabase Auth Error: ${error.message}`);
  }

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const insertData: TenantType = {
    user_id: user.id,
    local_id: localID,
    is_current: formData.is_current,
    rental_start_date: formData.rental_start_date.toISOString(),
    rental_end_date: formData.rental_end_date.toISOString() ?? null,
    first_name: formData.first_name,
    last_name: formData.last_name,
    birth_date: formData.birth_date.toISOString(),
    email: formData.email,
    phone: formData.phone,
    cold_rent: String(formData.cold_rent ?? 0),
    additional_costs: String(formData.additional_costs ?? 0),
    deposit: String(formData.deposit ?? 0),
    custody_type: formData.custody_type ?? null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const inserted = await database
    .insert(tenants)
    .values(insertData)
    .returning();

  return inserted[0];
}
