"use server";

import { type CreateObjekteUnitFormValues } from "@/components/Admin/Forms/Create/CreateObjekteUnitForm";
import database from "@/db";
import { locals } from "@/db/drizzle/schema";
import { supabaseServer } from "@/utils/supabase/server";
import { InferInsertModel } from "drizzle-orm";

export async function createLocal(
  formData: CreateObjekteUnitFormValues,
  objekt_id: string
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

  const insertData: InferInsertModel<typeof locals> = {
    objekt_id,
    usage_type: formData.usage_type,
    floor: formData.floor,
    living_space: String(formData.living_space),
    house_location: formData.house_location ?? null,
    outdoor: formData.outdoor ?? null,
    rooms: String(formData.rooms ?? 0),
    house_fee: String(formData.house_fee ?? 0),
    outdoor_area: String(formData.outdoor_area ?? 0),
    residential_area: formData.residential_area ?? null,
    apartment_type: formData.apartment_type ?? null,
    cellar_available: formData.cellar_available ?? null,
    tags: formData.tags ?? [],
    heating_systems: formData.heating_systems ?? [],
    created_at: new Date().toISOString(),
  };

  const inserted = await database.insert(locals).values(insertData).returning();

  return inserted[0];
}
