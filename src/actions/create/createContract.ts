"use server";

import { type CreateContractFormValues } from "@/components/Admin/Forms/Create/CreateContractForm";
import database from "@/db";
import { contractors, contracts } from "@/db/drizzle/schema";
import { ContractType } from "@/types";
import { supabaseServer } from "@/utils/supabase/server";
import { and, eq } from "drizzle-orm";

export async function createContract(
  formData: CreateContractFormValues,
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

  const now = new Date().toISOString();

  if (formData.is_current) {
    await database
      .update(contracts)
      .set({ is_current: false, updated_at: now })
      .where(
        and(
          eq(contracts.user_id, user.id),
          eq(contracts.local_id, localID),
          eq(contracts.is_current, true)
        )
      );
  }

  const insertData: ContractType = {
    user_id: user.id,
    local_id: localID,
    is_current: formData.is_current,
    rental_start_date: formData.rental_start_date.toISOString(),
    rental_end_date: formData.rental_end_date
      ? formData.rental_end_date.toISOString()
      : null,
    cold_rent: String(formData.cold_rent ?? 0),
    additional_costs: String(formData.additional_costs ?? 0),
    deposit: String(formData.deposit ?? 0),
    custody_type: formData.custody_type ?? null,
    created_at: now,
    updated_at: now,
  };

  const [insertedContract] = await database
    .insert(contracts)
    .values(insertData)
    .returning();

  if (formData.contractors && formData.contractors.length > 0) {
    const contractorRows = formData.contractors.map((contractor) => ({
      first_name: contractor.first_name,
      last_name: contractor.last_name,
      birth_date: contractor.birth_date
        ? contractor.birth_date.toISOString()
        : null,
      is_main: contractor.is_main ?? false,
      user_id: user.id,
      contract_id: insertedContract.id,
      email: contractor.email,
      phone: contractor.phone ?? null,
      created_at: now,
      updated_at: now,
    }));

    await database.insert(contractors).values(contractorRows);
  }

  return insertedContract;
}
