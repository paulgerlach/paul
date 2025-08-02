"use server";

import { AdminEditObjekteUnitFormValues } from "@/components/Admin/Forms/Edit/AdminEditObjekteUnitForm";
import database from "@/db";
import { local_meters } from "@/db/drizzle/schema";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function createLocalMeters(
  formData: AdminEditObjekteUnitFormValues["meters"],
  localID: string
) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const safeFormData = formData ?? [];

  const insertData = safeFormData.map((meter) => ({
    meter_number: meter.meter_number ?? null,
    meter_note: meter.meter_note ?? null,
    meter_type: meter.meter_type ?? null,
    local_id: localID,
  }));

  const inserted = await database.insert(local_meters)
    .values(insertData)
    .returning();

  return inserted;
}
