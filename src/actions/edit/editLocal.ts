"use server";

import { type EditObjekteUnitFormValues } from "@/components/Admin/Forms/Edit/EditObjekteUnitForm";
import database from "@/db";
import { locals } from "@/db/drizzle/schema";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { eq } from "drizzle-orm";

export async function editLocal(
  localId: string,
  formData: EditObjekteUnitFormValues
) {
  const user = await getAuthenticatedServerUser();
  if (!user) throw new Error("Nicht authentifiziert");

  const updateData = {
    usage_type: formData.usage_type,
    floor: formData.floor ?? "",
    living_space: String(formData.living_space ?? 0),
    house_location: formData.house_location ?? null,
    outdoor: formData.outdoor ?? null,
    rooms: String(formData.rooms) ?? 0,
    house_fee: String(formData.house_fee) ?? 0,
    outdoor_area: String(formData.outdoor_area) ?? 0,
    residential_area: formData.residential_area ?? null,
    apartment_type: formData.apartment_type ?? null,
    cellar_available: formData.cellar_available ?? null,
    tags: formData.tags ?? [],
    heating_systems: formData.heating_systems ?? [],
  };

  const [updated] = await database
    .update(locals)
    .set(updateData)
    .where(eq(locals.id, localId))
    .returning();

  return updated;
}
