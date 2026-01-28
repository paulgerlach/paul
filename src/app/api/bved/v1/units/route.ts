import { NextResponse } from "next/server";
import database from "@/db";
import {
  locals,
  objekte,
  contracts,
  contractors,
} from "@/db/drizzle/schema";
import { eq, inArray, desc, lt, or, and } from "drizzle-orm";
import { requireExternalAuth, formatError } from "../_lib/auth";
import {
  transformToOnSiteRoles,
  transformUnitsToConsumptionData,
  type InternalProperty,
  type InternalUnit,
} from "../_lib/transform";
import {
  parsePaginationParams,
  createPaginatedResponse,
  decodeCursor,
  SORT_FIELDS,
  type SortField,
} from "../_lib/pagination";

/**
 * GET /api/bved/v1/units
 * 
 * Returns units in BVED format (on-site-roles or consumption-data format)
 * 
 * Query parameters:
 * - format: "on-site-roles" | "consumption-data" | "internal" (default: "internal" for backward compatibility)
 * - cursor: Optional cursor for pagination (from previous response)
 * - limit: Maximum number of records (default: 100, max: 1000)
 */
export async function GET(request: Request) {
  try {
    const authResult = await requireExternalAuth(request);
    const { token, tokenRateLimit, ipRateLimit } = authResult;

    // Scoped access - require user_id from token
    if (!token || !token.user_id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Token does not include user context. Database tokens required for scoped access." } },
        { status: 401 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "internal";
    
    // Parse pagination parameters
    const paginationParams = parsePaginationParams(url);
    const { cursor, limit } = paginationParams;
    const pageLimit = limit || 100;

    // Build query conditions
    const conditions = [eq(objekte.user_id, token.user_id)];

    // Handle cursor-based pagination
    if (cursor) {
      const cursorData = decodeCursor(cursor);
      if (cursorData) {
        // Apply cursor filter: fetch items where (created_at, id) < (cursor.created_at, cursor.id)
        if (cursorData.created_at || cursorData.id) {
          const cursorConditions = [];
          if (cursorData.created_at) {
            cursorConditions.push(
              or(
                lt(locals.created_at, cursorData.created_at),
                and(
                  eq(locals.created_at, cursorData.created_at),
                  cursorData.id ? lt(locals.id, cursorData.id) : undefined
                )
              ) as any
            );
          } else if (cursorData.id) {
            cursorConditions.push(lt(locals.id, cursorData.id));
          }
          if (cursorConditions.length > 0) {
            conditions.push(and(...cursorConditions) as any);
          }
        }
      }
    }

    // Fetch limit + 1 to check if there are more items
    const fetchLimit = pageLimit + 1;
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
      .leftJoin(objekte, eq(locals.objekt_id, objekte.id))
      .where(and(...conditions))
      .orderBy(desc(locals.created_at), desc(locals.id))
      .limit(fetchLimit);
    
    // Check if there are more items
    const hasMore = unitRows.length > pageLimit;
    const actualUnitRows = hasMore ? unitRows.slice(0, pageLimit) : unitRows;

    const localIds = actualUnitRows.map((u) => u.id);
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
      const transformed = actualUnitRows.map((unit) => {
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

      const paginatedResponse = createPaginatedResponse(
        transformed,
        pageLimit,
        SORT_FIELDS.UNITS as readonly SortField[],
        hasMore
      );

      return NextResponse.json({
        units: paginatedResponse.data,
        pagination: paginatedResponse.pagination,
      });
    } else if (format === "consumption-data") {
      // Return in BVED consumption-data format
      // Group units by property
      const propertiesMap = new Map<string, InternalProperty & { units: InternalUnit[] }>();

      for (const unit of actualUnitRows) {
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
      
      // Note: For consumption-data format, pagination is applied to units before grouping
      // The response contains billingunits which may have fewer items than units
      // We return pagination info based on the units that were processed
      const paginatedResponse = createPaginatedResponse(
        transformed,
        pageLimit,
        SORT_FIELDS.UNITS as readonly SortField[],
        hasMore
      );

      return NextResponse.json({
        billingunits: paginatedResponse.data,
        pagination: paginatedResponse.pagination,
      });
    } else {
      // Default: Return internal format (backward compatibility)
      const response = actualUnitRows.map((unit) => ({
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

      const paginatedResponse = createPaginatedResponse(
        response,
        pageLimit,
        SORT_FIELDS.UNITS as readonly SortField[],
        hasMore
      );

      return NextResponse.json({
        units: paginatedResponse.data,
        pagination: paginatedResponse.pagination,
      });
    }
  } catch (error) {
    return formatError(error);
  }
}
