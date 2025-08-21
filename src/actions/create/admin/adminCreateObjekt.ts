"use server";

import { CreateObjekteFormValues } from "@/components/Admin/Forms/Create/CreateObjekteForm";
import database from "@/db";
import { objekte } from "@/db/drizzle/schema";

export async function adminCreateObjekt(formData: CreateObjekteFormValues, userID: string) {

  await database.insert(objekte).values({
    user_id: userID,
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
    created_at: new Date().toISOString(),
  });
}
