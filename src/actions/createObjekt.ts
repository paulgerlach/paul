"use server";

import { CreateObjekteFormValues } from "@/components/Admin/Forms/Create/CreateObjekteForm";
import database from "@/db";
import { objekte } from "@/db/drizzle/schema";
import { supabaseServer } from "@/utils/supabase/server";

export async function createObjekt(formData: CreateObjekteFormValues) {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error("Nicht authentifiziert");
  }

  await database.insert(objekte).values({
    user_id: user.id,
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
