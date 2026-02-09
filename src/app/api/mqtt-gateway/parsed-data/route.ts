import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import type { FirmwareVersion } from "@/types";
import { WmbusTelegram } from "@/types/WmbusTelegram";
import { ParsedData } from "@/types/ParsedData";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("parsed_data")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching parsed data:", error);
      return NextResponse.json(
        { error: "Failed to fetch parsed data" },
        { status: 500 },
      ); 
    }

    return NextResponse.json(data as ParsedData[]);
  } catch (error) {
    console.error("Unexpected error fetching parsed data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}