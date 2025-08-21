"use server";

import database from "@/db";
import { contractors, contracts } from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { EditContractFormValues } from "@/components/Admin/Forms/Edit/EditContractForm";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function adminEditContract(
  contractId: string,
  localID: string,
  userID: string,
  formData: EditContractFormValues
) {
  const user = await getAuthenticatedServerUser();

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
          eq(contracts.user_id, userID),
          eq(contracts.local_id, localID),
          eq(contracts.is_current, true)
        )
      );
  }

  const updateData = {
    is_current: formData.is_current,
    rental_start_date: formData.rental_start_date.toISOString(),
    rental_end_date: formData.rental_end_date?.toISOString() ?? null,
    cold_rent: String(formData.cold_rent ?? 0),
    additional_costs: String(formData.additional_costs ?? 0),
    deposit: String(formData.deposit ?? 0),
    custody_type: formData.custody_type ?? null,
    updated_at: new Date().toISOString(),
  };

  const [updatedContract] = await database
    .update(contracts)
    .set(updateData)
    .where(eq(contracts.id, contractId))
    .returning();

  if (formData.contractors) {
    await database
      .delete(contractors)
      .where(eq(contractors.contract_id, contractId));

    const contractorRows = formData.contractors.map((contractor) => ({
      contract_id: contractId,
      first_name: contractor.first_name,
      last_name: contractor.last_name,
      email: contractor.email,
      birth_date: contractor.birth_date
        ? contractor.birth_date.toISOString()
        : null,
      phone: contractor.phone ?? null,
      created_at: now,
      updated_at: now,
      user_id: userID,
    }));

    if (contractorRows.length > 0) {
      await database.insert(contractors).values(contractorRows);
    }
  }

  return updatedContract;
}
