"use server";

import { AdminEditObjekteUnitFormValues } from "@/components/Admin/Forms/Admin/Edit/AdminEditObjekteUnitForm";
import database from "@/db";
import { local_meters, locals } from "@/db/drizzle/schema";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { eq, inArray } from "drizzle-orm";

export async function createLocalMeters(
  formData: AdminEditObjekteUnitFormValues["meters"],
  localID: string
) {
  const user = await getAuthenticatedServerUser();
  if (!user) throw new Error("Nicht authentifiziert");

  const safeFormData = formData ?? [];

  // Get existing meters for this local
  const existingLocal = await database
    .select()
    .from(locals)
    .where(eq(locals.id, localID))
    .limit(1);
  const existingMeterIds = existingLocal[0]?.meter_ids ?? [];

  const formMeterIds = safeFormData.map((m) => m.meter_number).filter(Boolean) as string[];

  // Meters to delete: exist in DB but not in formData
  const metersToDelete = existingMeterIds.filter((id) => !formMeterIds.includes(id));

  if (metersToDelete.length > 0) {
    await database
      .delete(local_meters)
      .where(inArray(local_meters.meter_number, metersToDelete));
  }

  // Insert new meters (or update existing ones if needed)
  const insertData = safeFormData.map((meter) => ({
    meter_number: meter.meter_number ?? null,
    meter_note: meter.meter_note ?? null,
    meter_type: meter.meter_type ?? null,
    local_id: localID,
  }));

  const inserted = await database.insert(local_meters).values(insertData).returning();

  const updatedMeterIds = [...new Set([...existingMeterIds.filter(id => !metersToDelete.includes(id)), ...formMeterIds])];

  await database
    .update(locals)
    .set({ meter_ids: updatedMeterIds })
    .where(eq(locals.id, localID));

  return inserted;
}
