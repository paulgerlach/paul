import { NextResponse } from "next/server";
import database from "@/db";
import { locals, objekte } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { requireExternalAuth, formatError } from "../_lib/auth";

export async function GET(request: Request) {
  try {
    await requireExternalAuth(request);

    const properties = await database
      .select({
        id: objekte.id,
        type: objekte.objekt_type,
        street: objekte.street,
        zip: objekte.zip,
        administration_type: objekte.administration_type,
        hot_water_preparation: objekte.hot_water_preparation,
        living_area: objekte.living_area,
        usable_area: objekte.usable_area,
        land_area: objekte.land_area,
        build_year: objekte.build_year,
        has_elevator: objekte.has_elevator,
        heating_systems: objekte.heating_systems,
        tags: objekte.tags,
        created_at: objekte.created_at,
        user_id: objekte.user_id,
      })
      .from(objekte);

    // Fetch locals per property to provide counts
    const localsByProperty: Record<string, number> = {};
    for (const property of properties) {
      const units = await database
        .select({ id: locals.id })
        .from(locals)
        .where(eq(locals.objekt_id, property.id));
      localsByProperty[property.id] = units.length;
    }

    const response = properties.map((p) => ({
      ...p,
      units_count: localsByProperty[p.id] || 0,
    }));

    return NextResponse.json({ properties: response });
  } catch (error) {
    return formatError(error);
  }
}


