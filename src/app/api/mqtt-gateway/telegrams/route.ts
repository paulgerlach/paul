import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import type { FirmwareVersion } from "@/types";
import { WmbusTelegram } from "@/types/WmbusTelegram";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("wmbus_telegrams")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching wmbus telegrams:", error);
      return NextResponse.json(
        { error: "Failed to fetch wmbus telegrams" },
        { status: 500 },
      ); 
    }

    return NextResponse.json(data as WmbusTelegram[]);
  } catch (error) {
    console.error("Unexpected error fetching wmbus telegrams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}