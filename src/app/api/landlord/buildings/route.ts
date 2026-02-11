import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

/**
 * GET /api/landlord/buildings
 * 
 * Returns list of buildings (objekte) for the authenticated landlord.
 */
export async function GET() {
  try {
    // Get authenticated user
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Query buildings for this landlord
    const { data: buildings, error } = await supabase
      .from("objekte")
      .select("id, street, zip, objekt_type, image_url")
      .eq("user_id", user.id)
      .order("street", { ascending: true });

    if (error) {
      console.error("[landlord/buildings] Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch buildings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      buildings: buildings || [],
      count: buildings?.length || 0,
    });

  } catch (error) {
    console.error("[landlord/buildings] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
