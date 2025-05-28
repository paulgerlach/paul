"use server";

import database from "@/db";
import { tenants } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { supabaseServer } from "@/utils/supabase/server";
import { EditTenantFormValues } from "@/components/Admin/Forms/Edit/EditTenantForm";

export async function editTenant(
  tenantId: string,
  formData: EditTenantFormValues
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

  const updateData = {
    is_current: formData.is_current,
    rental_start_date: formData.rental_start_date.toISOString(),
    rental_end_date: formData.rental_end_date?.toISOString() ?? null,
    first_name: formData.first_name,
    last_name: formData.last_name,
    birth_date: formData.birth_date.toISOString(),
    email: formData.email,
    phone: formData.phone,
    cold_rent: String(formData.cold_rent),
    additional_costs: String(formData.additional_costs),
    deposit: String(formData.deposit),
    custody_type: formData.custody_type ?? null,
    updated_at: new Date(),
  };

  const updated = await database
    .update(tenants)
    .set(updateData)
    .where(eq(tenants.id, tenantId))
    .returning();

  return updated[0];
}
