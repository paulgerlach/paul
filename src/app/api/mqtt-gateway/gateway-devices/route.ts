import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { GatewayDevice } from "@/types/GatewayDevice";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("gateway_devices")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching gateway devices:", error);
      return NextResponse.json(
        { error: "Failed to fetch gateway devices" },
        { status: 500 },
      );
    }

    return NextResponse.json(data as GatewayDevice[]);
  } catch (error) {
    console.error("Unexpected error fetching gateway devices:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}