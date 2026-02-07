"use server";

import { AdminEditObjekteUnitFormValues } from "@/components/Admin/Forms/Admin/Edit/AdminEditObjekteUnitForm";
import database from "@/db";
import { local_meters } from "@/db/drizzle/schema";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { eq, and } from "drizzle-orm";

export async function createLocalMeters(
  formData: AdminEditObjekteUnitFormValues["meters"],
  localID: string
) {
  const user = await getAuthenticatedServerUser();
  if (!user) throw new Error("Nicht authentifiziert");

  const safeFormData = formData ?? [];

  // Get valid meter numbers from form data
  const formMeterIds = safeFormData
    .map((m) => m.meter_number)
    .filter(Boolean) as string[];

  // Get existing meters from the database for this local
  const existingMeters = await database
    .select()
    .from(local_meters)
    .where(eq(local_meters.local_id, localID));

  // Process each meter from the form
  for (const meter of safeFormData) {
    if (!meter.meter_number) continue;

    const existingMeter = existingMeters.find(
      (m) => m.meter_number === meter.meter_number
    );

    if (existingMeter) {
      // UPDATE existing meter with new values
      await database
        .update(local_meters)
        .set({
          meter_note: meter.meter_note ?? null,
          meter_type: meter.meter_type ?? null,
        })
        .where(
          and(
            eq(local_meters.local_id, localID),
            eq(local_meters.meter_number, meter.meter_number)
          )
        );
    } else {
      // INSERT new meter
      await database.insert(local_meters).values({
        meter_number: meter.meter_number,
        meter_note: meter.meter_note ?? null,
        meter_type: meter.meter_type ?? null,
        local_id: localID,
      });
    }
  }

  // Delete meters that are no longer in the form
  const metersToDelete = existingMeters.filter(
    (m) => m.meter_number && !formMeterIds.includes(m.meter_number)
  );

  for (const meter of metersToDelete) {
    await database
      .delete(local_meters)
      .where(eq(local_meters.id, meter.id));
  }

  // NOTE: We intentionally do NOT update locals.meter_ids here
  // because there's a database trigger that auto-creates local_meters
  // records when meter_ids changes, which overwrites our updates.

  // Return updated meters
  const updatedMeters = await database
    .select()
    .from(local_meters)
    .where(eq(local_meters.local_id, localID));

  return updatedMeters;
}
