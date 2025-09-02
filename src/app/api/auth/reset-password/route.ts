import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-Mail-Adresse ist erforderlich" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
      console.error("Password reset error:", error.message);
      return NextResponse.json(
        { error: "Fehler beim Senden der E-Mail" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "E-Mail zum Zurücksetzen des Passworts wurde gesendet" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in reset-password API:", error);
    return NextResponse.json(
      { error: "Ein unerwarteter Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
