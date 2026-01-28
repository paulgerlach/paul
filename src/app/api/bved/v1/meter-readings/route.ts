import database, { postgresClient } from "@/db";
import { objekte, locals, local_meters } from "@/db/drizzle/schema";
import { eq, inArray } from "drizzle-orm";
import { requireExternalAuth, formatError, createResponse } from "../_lib/auth";
import {
  parsePaginationParams,
  decodeCursor,
  encodeCursor,
} from "../_lib/pagination";

/**
 * GET /api/bved/v1/meter-readings
 * 
 * Returns meter readings (parsed_data) for meters linked to properties owned by the token's user.
 * 
 * Query parameters:
 * - cursor: Optional cursor for pagination (from previous response)
 * - limit: Maximum number of records (default: 100, max: 1000)
 * 
 * Data Scoping: Multi-step scoping process:
 * 1. Get properties: `objekte.user_id = token.user_id`
 * 2. Get units: `locals.objekt_id IN (user's properties)`
 * 3. Get meters: `local_meters.local_id IN (user's units)`
 * 4. Get readings: `parsed_data.local_meter_id IN (user's meters)`
 * 
 * Only returns readings where `parsed_data.local_meter_id` is set (linked readings only).
 */
export async function GET(request: Request) {
  let authResult: Awaited<ReturnType<typeof requireExternalAuth>> | undefined;

  try {
    authResult = await requireExternalAuth(request);
    const { token, tokenRateLimit, ipRateLimit } = authResult;

    // Scoped access - require user_id from token
    if (!token || !token.user_id) {
      return createResponse(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Token does not include user context. Database tokens required for scoped access.",
          },
        },
        401,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const paginationParams = parsePaginationParams(url);
    const { cursor, limit } = paginationParams;
    const pageLimit = limit || 100;

    // Step 1: Get all properties owned by token user
    const userProperties = await database
      .select({ id: objekte.id })
      .from(objekte)
      .where(eq(objekte.user_id, token.user_id));

    if (userProperties.length === 0) {
      return createResponse(
        {
          meter_readings: [],
          pagination: {
            cursor: null,
            has_more: false,
            limit: pageLimit,
            count: 0,
          },
        },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    }

    const propertyIds = userProperties.map((p) => p.id);

    // Step 2: Get units belonging to user's properties
    const userUnits = await database
      .select({ id: locals.id })
      .from(locals)
      .where(inArray(locals.objekt_id, propertyIds));

    if (userUnits.length === 0) {
      return createResponse(
        {
          meter_readings: [],
          pagination: {
            cursor: null,
            has_more: false,
            limit: pageLimit,
            count: 0,
          },
        },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    }

    const unitIds = userUnits.map((u) => u.id);

    // Step 3: Get meters belonging to user's units (using Drizzle schema)
    const userMeters = await database
      .select({ id: local_meters.id })
      .from(local_meters)
      .where(inArray(local_meters.local_id, unitIds));

    if (userMeters.length === 0) {
      return createResponse(
        {
          meter_readings: [],
          pagination: {
            cursor: null,
            has_more: false,
            limit: pageLimit,
            count: 0,
          },
        },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    }

    const meterIds = userMeters.map((m) => m.id);

    // Step 4: Fetch readings from parsed_data table
    // parsed_data is not in Drizzle schema, so we use raw SQL via postgres client
    const fetchLimit = pageLimit + 1;
    
    // Parse cursor data
    let cursorCreatedAt: string | null = null;
    let cursorId: string | null = null;
    if (cursor) {
      const cursorData = decodeCursor(cursor);
      if (cursorData) {
        cursorCreatedAt = cursorData.created_at || null;
        cursorId = cursorData.id || null;
      }
    }

    // Use postgres-js tagged template for safe parameterized queries
    // postgres-js handles arrays natively with ANY()
    let allReadings: any[];
    
    if (cursorCreatedAt && cursorId) {
      // With full cursor (created_at + id)
      allReadings = await postgresClient`
        SELECT 
          id,
          device_id,
          device_type,
          manufacturer,
          frame_type,
          version,
          access_number,
          status,
          encryption,
          parsed_data,
          local_meter_id,
          created_at
        FROM parsed_data
        WHERE local_meter_id = ANY(${meterIds}::uuid[])
          AND (created_at, id) < (${cursorCreatedAt}::timestamptz, ${cursorId}::uuid)
        ORDER BY created_at DESC, id DESC
        LIMIT ${fetchLimit}
      `;
    } else if (cursorCreatedAt) {
      // With created_at cursor only
      allReadings = await postgresClient`
        SELECT 
          id,
          device_id,
          device_type,
          manufacturer,
          frame_type,
          version,
          access_number,
          status,
          encryption,
          parsed_data,
          local_meter_id,
          created_at
        FROM parsed_data
        WHERE local_meter_id = ANY(${meterIds}::uuid[])
          AND created_at < ${cursorCreatedAt}::timestamptz
        ORDER BY created_at DESC, id DESC
        LIMIT ${fetchLimit}
      `;
    } else if (cursorId) {
      // With id cursor only
      allReadings = await postgresClient`
        SELECT 
          id,
          device_id,
          device_type,
          manufacturer,
          frame_type,
          version,
          access_number,
          status,
          encryption,
          parsed_data,
          local_meter_id,
          created_at
        FROM parsed_data
        WHERE local_meter_id = ANY(${meterIds}::uuid[])
          AND id < ${cursorId}::uuid
        ORDER BY created_at DESC, id DESC
        LIMIT ${fetchLimit}
      `;
    } else {
      // No cursor - first page
      allReadings = await postgresClient`
        SELECT 
          id,
          device_id,
          device_type,
          manufacturer,
          frame_type,
          version,
          access_number,
          status,
          encryption,
          parsed_data,
          local_meter_id,
          created_at
        FROM parsed_data
        WHERE local_meter_id = ANY(${meterIds}::uuid[])
        ORDER BY created_at DESC, id DESC
        LIMIT ${fetchLimit}
      `;
    }
    const hasMore = allReadings.length > pageLimit;
    const actualReadings = hasMore ? allReadings.slice(0, pageLimit) : allReadings;

    if (actualReadings.length === 0) {
      return createResponse(
        {
          meter_readings: [],
          pagination: {
            cursor: null,
            has_more: false,
            limit: pageLimit,
            count: 0,
          },
        },
        200,
        tokenRateLimit,
        ipRateLimit
      );
    }

    // Step 5: Format response
    const meterReadings = actualReadings.map((reading: any) => ({
      id: reading.device_id,
      device_type: reading.device_type,
      manufacturer: reading.manufacturer,
      frame_type: reading.frame_type || null,
      version: reading.version || null,
      access_number: reading.access_number || null,
      status: reading.status || null,
      encryption: reading.encryption || null,
      parsed_data: reading.parsed_data || {},
    }));

    // Build pagination cursor from last item
    let nextCursor: string | null = null;
    if (hasMore && actualReadings.length > 0) {
      const lastItem = actualReadings[actualReadings.length - 1];
      nextCursor = encodeCursor({
        created_at: lastItem.created_at,
        id: lastItem.id,
      });
    }

    return createResponse(
      {
        meter_readings: meterReadings,
        pagination: {
          cursor: nextCursor,
          has_more: hasMore,
          limit: pageLimit,
          count: meterReadings.length,
        },
      },
      200,
      tokenRateLimit,
      ipRateLimit
    );
  } catch (error) {
    console.error("[BVED API] Error fetching meter readings:", error);
    return formatError(error, authResult);
  }
}
