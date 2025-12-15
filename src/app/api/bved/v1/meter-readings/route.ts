import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { requireExternalAuth, formatError } from "../_lib/auth";

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

export async function GET(request: Request) {
  try {
    await requireExternalAuth(request);

    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("parsed_data")
      .select(
        "device_id, device_type, manufacturer, frame_type, version, access_number, status, encryption, parsed_data"
      )
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


