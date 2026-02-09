import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("parsed_data")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Fetched parsed data:", data?.length, "records");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
