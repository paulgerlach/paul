import { NextResponse } from "next/server";
import database from "@/db";
import { locals, objekte } from "@/db/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { requireExternalAuth, formatError } from "../_lib/auth";
import { transformPropertyToBVED, type InternalProperty } from "../_lib/transform";

/**
 * GET /api/bved/v1/properties
 * 
 * Returns properties in BVED format or internal format
 * 
 * Query parameters:
 * - format: "bved" | "internal" (default: "internal" for backward compatibility)
 */
export async function GET(request: Request) {
  try {
    const token = await requireExternalAuth(request);

    // Parse query parameters
    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "internal";

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
        image_url: objekte.image_url,
      })
      .from(objekte)
      .where(eq(objekte.user_id, token.user_id));

    // Fetch locals per property to provide counts (single query, avoid N+1)
    const unitsCountRows = await database
      .select({
        property_id: locals.objekt_id,
        count: sql<number>`count(*)`,
      })
      .from(locals)
      .groupBy(locals.objekt_id);

    const localsByProperty: Record<string, number> = {};
    for (const row of unitsCountRows) {
      if (row.property_id) {
        localsByProperty[row.property_id] = Number(row.count) || 0;
      }
    }

    if (format === "bved") {
      // Return in BVED format
      const transformed = properties.map((p) => {
        const property: InternalProperty = {
          id: p.id,
          objekt_type: p.type || "",
          street: p.street || "",
          zip: p.zip || "",
          administration_type: p.administration_type || "",
          hot_water_preparation: p.hot_water_preparation || "",
          living_area: p.living_area || null,
          usable_area: p.usable_area || null,
          land_area: p.land_area || null,
          build_year: p.build_year || null,
          has_elevator: p.has_elevator || false,
          heating_systems: p.heating_systems || [],
          tags: p.tags || [],
          created_at: p.created_at || "",
          user_id: p.user_id || "",
          image_url: p.image_url || null,
        };

        return {
          ...transformPropertyToBVED(property, { includeAddress: true }),
          units_count: localsByProperty[p.id] || 0,
        };
      });

      return NextResponse.json({ billingunits: transformed });
    } else {
      // Default: Return internal format (backward compatibility)
      const response = properties.map((p) => ({
        ...p,
        units_count: localsByProperty[p.id] || 0,
      }));

      return NextResponse.json({ properties: response });
    }
  } catch (error) {
    return formatError(error);
  }
}


