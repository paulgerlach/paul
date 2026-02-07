import { NextResponse } from "next/server";
import database from "@/db";
import { locals, objekte } from "@/db/drizzle/schema";
import { eq, sql, inArray, desc, lt, or, and } from "drizzle-orm";
import { requireExternalAuth, formatError } from "../_lib/auth";
import { addRateLimitHeaders } from "../_lib/rate-limit";
import { transformPropertyToBVED, type InternalProperty } from "../_lib/transform";
import {
  parsePaginationParams,
  createPaginatedResponse,
  decodeCursor,
  SORT_FIELDS,
  type SortField,
} from "../_lib/pagination";

/**
 * GET /api/bved/v1/properties
 * 
 * Returns properties in BVED format or internal format
 * 
 * Query parameters:
 * - format: "bved" | "internal" (default: "internal" for backward compatibility)
 * - cursor: Optional cursor for pagination (from previous response)
 * - limit: Maximum number of records (default: 100, max: 1000)
 */
export async function GET(request: Request) {
  try {
    const authResult = await requireExternalAuth(request);
    const { token, tokenRateLimit, ipRateLimit } = authResult;

    // Option B: Scoped access - require user_id from token
    if (!token || !token.user_id) {
      const response = NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Token does not include user context. Database tokens required for scoped access." } },
        { status: 401 }
      );
      return addRateLimitHeaders(response, tokenRateLimit, ipRateLimit);
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
                lt(objekte.created_at, cursorData.created_at),
                and(
                  eq(objekte.created_at, cursorData.created_at),
                  cursorData.id ? lt(objekte.id, cursorData.id) : undefined
                )
              ) as any
            );
          } else if (cursorData.id) {
            cursorConditions.push(lt(objekte.id, cursorData.id));
          }
          if (cursorConditions.length > 0) {
            conditions.push(and(...cursorConditions) as any);
          }
        }
      }
    }

    // Fetch limit + 1 to check if there are more items
    const fetchLimit = pageLimit + 1;
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
        agency_id: objekte.agency_id,
      })
      .from(objekte)
      .where(and(...conditions))
      .orderBy(desc(objekte.created_at), desc(objekte.id))
      .limit(fetchLimit);
    
    // Check if there are more items
    const hasMore = properties.length > pageLimit;
    const actualProperties = hasMore ? properties.slice(0, pageLimit) : properties;

    // Fetch locals per property to provide counts (single query, avoid N+1)
    // Scope to user's properties only
    const propertyIds = actualProperties.map(p => p.id);
    const unitsCountRows = propertyIds.length > 0
      ? await database
          .select({
            property_id: locals.objekt_id,
            count: sql<number>`count(*)`,
          })
          .from(locals)
          .where(inArray(locals.objekt_id, propertyIds))
          .groupBy(locals.objekt_id)
      : [];

    const localsByProperty: Record<string, number> = {};
    for (const row of unitsCountRows) {
      if (row.property_id) {
        localsByProperty[row.property_id] = Number(row.count) || 0;
      }
    }

    if (format === "bved") {
      // Return in BVED format
      const transformed = actualProperties.map((p) => {
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
          agency_id: p.agency_id || null,
        };

        return {
          ...transformPropertyToBVED(property, { includeAddress: true }),
          units_count: localsByProperty[p.id] || 0,
        };
      });

      const paginatedResponse = createPaginatedResponse(
        transformed,
        pageLimit,
        SORT_FIELDS.PROPERTIES as readonly SortField[],
        hasMore
      );

      const response = NextResponse.json({
        billingunits: paginatedResponse.data,
        pagination: paginatedResponse.pagination,
      });
      return addRateLimitHeaders(response, tokenRateLimit, ipRateLimit);
    } else {
      // Default: Return internal format (backward compatibility)
      const responseData = actualProperties.map((p) => ({
        ...p,
        units_count: localsByProperty[p.id] || 0,
      }));

      const paginatedResponse = createPaginatedResponse(
        responseData,
        pageLimit,
        SORT_FIELDS.PROPERTIES as readonly SortField[],
        hasMore
      );

      const response = NextResponse.json({
        properties: paginatedResponse.data,
        pagination: paginatedResponse.pagination,
      });
      return addRateLimitHeaders(response, tokenRateLimit, ipRateLimit);
    }
  } catch (error) {
    return formatError(error);
  }
}


