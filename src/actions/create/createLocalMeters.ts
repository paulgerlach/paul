"use server";

import { AdminEditObjekteUnitFormValues } from "@/components/Admin/Forms/Edit/AdminEditObjekteUnitForm";
import database from "@/db";
import { local_meters, locals } from "@/db/drizzle/schema";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { eq } from "drizzle-orm";

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

  const newMeterIds = inserted.map((m) => m.meter_number || "");

  const existingLocal = await database
    .select()
    .from(locals)
    .where(eq(locals.id, localID))
    .limit(1);

  const existingMeterIds = existingLocal[0]?.meter_ids ?? [];

  const updatedMeterIds = [...existingMeterIds, ...newMeterIds];

  await database
    .update(locals)
    .set({ meter_ids: updatedMeterIds })
    .where(eq(locals.id, localID));

  return inserted;
}
