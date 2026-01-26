import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import type { FirmwareVersion } from "@/types";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("firmware_versions")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Error fetching firmware versions:", error);
      return NextResponse.json(
        { error: "Failed to fetch firmware versions" },
        { status: 500 },
      );
    }

    return NextResponse.json(data as FirmwareVersion[]);
  } catch (error) {
    console.error("Unexpected error fetching firmware versions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
