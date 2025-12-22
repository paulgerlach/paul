import { NextResponse } from "next/server";
import database from "@/db";
import {
  locals,
  objekte,
  contracts,
  contractors,
} from "@/db/drizzle/schema";
import { eq, inArray } from "drizzle-orm";
import { requireExternalAuth, formatError } from "../_lib/auth";
import {
  transformToOnSiteRoles,
  transformUnitsToConsumptionData,
  type InternalProperty,
  type InternalUnit,
} from "../_lib/transform";

/**
 * GET /api/bved/v1/units
 * 
 * Returns units in BVED format (on-site-roles or consumption-data format)
 * 
 * Query parameters:
 * - format: "on-site-roles" | "consumption-data" | "internal" (default: "internal" for backward compatibility)
 */
export async function GET(request: Request) {
  try {
    await requireExternalAuth(request);

    // Parse query parameters
    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "internal";

    // Fetch units with property data
    const unitRows = await database
      .select({
        id: locals.id,
        objekt_id: locals.objekt_id,
        usage_type: locals.usage_type,
        floor: locals.floor,
        living_space: locals.living_space,
        house_location: locals.house_location,
        rooms: locals.rooms,
        tags: locals.tags,
        heating_systems: locals.heating_systems,
        created_at: locals.created_at,
        // Property fields
        property_id: objekte.id,
        property_type: objekte.objekt_type,
        property_street: objekte.street,
        property_zip: objekte.zip,
        property_administration_type: objekte.administration_type,
        property_hot_water_preparation: objekte.hot_water_preparation,
        property_living_area: objekte.living_area,
        property_usable_area: objekte.usable_area,
        property_land_area: objekte.land_area,
        property_build_year: objekte.build_year,
        property_has_elevator: objekte.has_elevator,
        property_heating_systems: objekte.heating_systems,
        property_tags: objekte.tags,
        property_created_at: objekte.created_at,
        property_user_id: objekte.user_id,
      })
      .from(locals)
      .leftJoin(objekte, eq(locals.objekt_id, objekte.id));

    const localIds = unitRows.map((u) => u.id);
    let contractRows: typeof contracts.$inferSelect[] = [];
    let contractorRows: typeof contractors.$inferSelect[] = [];

    if (localIds.length > 0) {
      contractRows = await database
        .select()
        .from(contracts)
        .where(inArray(contracts.local_id, localIds));

      const contractIds = contractRows.map((c) => c.id);
      if (contractIds.length > 0) {
        contractorRows = await database
          .select()
          .from(contractors)
          .where(inArray(contractors.contract_id, contractIds));
      }
    }

    // Group contractors by contract
    const contractorsByContract: Record<string, typeof contractorRows> = {};
    for (const ct of contractorRows) {
      contractorsByContract[ct.contract_id] = [
        ...(contractorsByContract[ct.contract_id] || []),
        ct,
      ];
    }

    // Group contracts by local
    const contractsByLocal: Record<string, Array<typeof contractRows[0] & { contractors: typeof contractorRows }>> = {};
    for (const c of contractRows) {
      contractsByLocal[c.local_id] = [
        ...(contractsByLocal[c.local_id] || []),
        {
          ...c,
          contractors: contractorsByContract[c.id] || [],
        },
      ];
    }

    // Transform based on requested format
    if (format === "on-site-roles") {
      // Return in BVED on-site-roles format
      const transformed = unitRows.map((unit) => {
        const property: InternalProperty = {
          id: unit.property_id!,
          objekt_type: unit.property_type || "",
          street: unit.property_street || "",
          zip: unit.property_zip || "",
          administration_type: unit.property_administration_type || "",
          hot_water_preparation: unit.property_hot_water_preparation || "",
          living_area: unit.property_living_area || null,
          usable_area: unit.property_usable_area || null,
          land_area: unit.property_land_area || null,
          build_year: unit.property_build_year || null,
          has_elevator: unit.property_has_elevator || false,
          heating_systems: unit.property_heating_systems || [],
          tags: unit.property_tags || [],
          created_at: unit.property_created_at || "",
          user_id: unit.property_user_id || "",
          image_url: null,
        };

        const floorValue: string = unit.floor ?? "";
        const unitData = {
          id: unit.id,
          objekt_id: unit.objekt_id || "",
          usage_type: unit.usage_type || "",
          floor: floorValue,
          living_space: unit.living_space || null,
          house_location: unit.house_location || null,
          rooms: unit.rooms || null,
          tags: unit.tags || null,
          heating_systems: unit.heating_systems || null,
          created_at: unit.created_at || "",
        } as InternalUnit;

        const contractData = (contractsByLocal[unit.id] || []).map((c) => ({
          ...c,
          contractors: c.contractors,
        }));

        return transformToOnSiteRoles(property, unitData, contractData);
      });

      return NextResponse.json({ units: transformed });
    } else if (format === "consumption-data") {
      // Return in BVED consumption-data format
      // Group units by property
      const propertiesMap = new Map<string, InternalProperty & { units: InternalUnit[] }>();

      for (const unit of unitRows) {
        if (!unit.property_id) continue;

        const propertyId = unit.property_id;
        if (!propertiesMap.has(propertyId)) {
          const property: InternalProperty = {
            id: propertyId,
            objekt_type: unit.property_type || "",
            street: unit.property_street || "",
            zip: unit.property_zip || "",
            administration_type: unit.property_administration_type || "",
            hot_water_preparation: unit.property_hot_water_preparation || "",
            living_area: unit.property_living_area || null,
            usable_area: unit.property_usable_area || null,
            land_area: unit.property_land_area || null,
            build_year: unit.property_build_year || null,
            has_elevator: unit.property_has_elevator || false,
            heating_systems: unit.property_heating_systems || [],
            tags: unit.property_tags || [],
            created_at: unit.property_created_at || "",
            user_id: unit.property_user_id || "",
            image_url: null,
          };
          propertiesMap.set(propertyId, { ...property, units: [] });
        }

        const floorValue: string = unit.floor ?? "";
        const unitData = {
          id: unit.id,
          objekt_id: unit.objekt_id || "",
          usage_type: unit.usage_type || "",
          floor: floorValue,
          living_space: unit.living_space || null,
          house_location: unit.house_location || null,
          rooms: unit.rooms || null,
          tags: unit.tags || null,
          heating_systems: unit.heating_systems || null,
          created_at: unit.created_at || "",
        } as InternalUnit;

        propertiesMap.get(propertyId)!.units.push(unitData);
      }

      const transformed = transformUnitsToConsumptionData(Array.from(propertiesMap.values()));
      return NextResponse.json({ billingunits: transformed });
    } else {
      // Default: Return internal format (backward compatibility)
      const response = unitRows.map((unit) => ({
        unit: {
          id: unit.id,
          usage_type: unit.usage_type,
          floor: unit.floor,
          living_space: unit.living_space,
          house_location: unit.house_location,
          rooms: unit.rooms,
          tags: unit.tags,
          heating_systems: unit.heating_systems,
          created_at: unit.created_at,
        },
        property: {
          id: unit.objekt_id,
          type: unit.property_type,
          street: unit.property_street,
          zip: unit.property_zip,
        },
        contracts: contractsByLocal[unit.id] || [],
      }));

      return NextResponse.json({ units: response });
    }
  } catch (error) {
    return formatError(error);
  }
}


