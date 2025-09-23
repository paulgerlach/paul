"use server";

import database from "@/db";
import { objekte } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { AdminEditObjekteFormValues } from "@/components/Admin/Forms/Admin/Edit/AdminEditObjekteForm";

export async function adminiEditObjekt(id: string, formData: AdminEditObjekteFormValues) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  try {
    await database
      .update(objekte)
      .set({
        objekt_type: formData.objekt_type,
        street: formData.street,
        zip: formData.zip,
        administration_type: formData.administration_type,
        hot_water_preparation: formData.hot_water_preparation,
        living_area: formData.livingArea || null,
        usable_area: formData.usableArea || null,
        land_area: formData.landArea || null,
        build_year: formData.buildYear || null,
        has_elevator: formData.hasElevator ?? false,
        tags: formData.tags || [],
        heating_systems: formData.heating_systems || [],
        image_url: formData.image_url
      })
      .where(eq(objekte.id, id));
  } catch (e) {
    console.error("Failed to update objekt:", e);
    throw new Error("Fehler beim Aktualisieren des Objekts");
  }
}
