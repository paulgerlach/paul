import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { requireExternalAuth, formatError } from "../_lib/auth";
import database from "@/db";
import { objekte, locals, local_meters } from "@/db/drizzle/schema";
import { eq, inArray } from "drizzle-orm";

type ParsedDataRecord = {
  device_id: string;
  device_type?: string;
  manufacturer?: string;
  frame_type?: string;
  version?: string;
  access_number?: number;
  status?: string;
  encryption?: number;
  parsed_data?: Record<string, unknown>;
};

/**
 * GET /api/bved/v1/meter-readings
 * 
 */
export async function GET(request: Request) {
  try {
    const authResult = await requireExternalAuth(request);
    const { token, tokenRateLimit, ipRateLimit } = authResult;

    // Option B: Scoped access - require user_id from token
    if (!token || !token.user_id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Token does not include user context. Database tokens required for scoped access." } },
        { status: 401 }
      );
    }

    // Step 1: Get all properties owned by token user
    const userProperties = await database
      .select({ id: objekte.id })
      .from(objekte)
      .where(eq(objekte.user_id, token.user_id));

    if (userProperties.length === 0) {
      return NextResponse.json({ meter_readings: [] });
    }

    const propertyIds = userProperties.map(p => p.id);

    // Step 2: Get all locals (units) for user's properties
    const userLocals = await database
      .select({ id: locals.id })
      .from(locals)
      .where(inArray(locals.objekt_id, propertyIds));

    if (userLocals.length === 0) {
      return NextResponse.json({ meter_readings: [] });
    }

    const localIds = userLocals.map(l => l.id);

    // Step 3: Get all local_meters for user's locals
    const userMeters = await database
      .select({ id: local_meters.id })
      .from(local_meters)
      .where(inArray(local_meters.local_id, localIds));

    if (userMeters.length === 0) {
      return NextResponse.json({ meter_readings: [] });
    }

    const meterIds = userMeters.map(m => m.id);

    // Step 4: Query parsed_data filtered by local_meter_id
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("parsed_data")
      .select(
        "device_id, device_type, manufacturer, frame_type, version, access_number, status, encryption, parsed_data"
      )
      .in("local_meter_id", meterIds)
      .limit(200);

    if (error) {
      throw error;
    }

    const readings = (data || []).map((record: ParsedDataRecord) => ({
      id: record.device_id,
      device_type: record.device_type,
      manufacturer: record.manufacturer,
      frame_type: record.frame_type,
      version: record.version,
      access_number: record.access_number,
      status: record.status,
      encryption: record.encryption,
      parsed_data: record.parsed_data,
    }));

    return NextResponse.json({ meter_readings: readings });
  } catch (error) {
    return formatError(error);
  }
}


