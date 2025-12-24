import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Use service role key for secure database access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Simple hash function for PIN (using SHA-256)
function hashPin(pin: string): string {
  return crypto.createHash("sha256").update(pin).digest("hex");
}

// Max attempts before blocking
const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin, shareToken, linkParams } = body;

    // Validate PIN format (6 digits)
    if (!pin || !/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { error: "Invalid PIN format" },
        { status: 400 }
      );
    }

    // Must have either shareToken (new way) or linkParams (legacy)
    if (!shareToken && !linkParams) {
      return NextResponse.json(
        { error: "shareToken or linkParams required" },
        { status: 400 }
      );
    }

    let record = null;

    // NEW WAY: Find by share_token (simple and fast)
    if (shareToken) {
      const { data, error: findError } = await supabase
        .from("share_pins")
        .select("*")
        .eq("share_token", shareToken)
        .single();

      if (findError || !data) {
        console.log("[share-pin/verify] No record found for token:", shareToken);
        return NextResponse.json(
          { success: false, error: "Invalid or expired access code" },
          { status: 401 }
        );
      }
      record = data;
    } 
    // LEGACY WAY: Find by linkParams (for backward compatibility)
    else if (linkParams) {
      const params = new URLSearchParams(linkParams);
      const meters = params.get('meters') || '';
      const exp = params.get('exp') || '';
      
      const { data: records, error: findError } = await supabase
        .from("share_pins")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      record = records?.find(r => {
        const storedParams = new URLSearchParams(r.link_params);
        return storedParams.get('meters') === meters && storedParams.get('exp') === exp;
      });

      if (findError || !record) {
        console.log("[share-pin/verify] No record found for meters:", meters, "exp:", exp);
        return NextResponse.json(
          { success: false, error: "Invalid or expired access code" },
          { status: 401 }
        );
      }
    }

    // Check if expired
    if (new Date(record.expires_at) < new Date()) {
      console.log("[share-pin/verify] PIN expired");
      return NextResponse.json(
        { success: false, error: "Access code has expired" },
        { status: 401 }
      );
    }

    // Check attempt count (rate limiting)
    if (record.attempts >= MAX_ATTEMPTS) {
      console.log("[share-pin/verify] Too many attempts");
      return NextResponse.json(
        { success: false, error: "Too many failed attempts. Please request a new code." },
        { status: 429 }
      );
    }

    // Hash the provided PIN and compare
    const providedHash = hashPin(pin);
    
    if (providedHash !== record.pin_hash) {
      // Increment attempt counter
      await supabase
        .from("share_pins")
        .update({ attempts: record.attempts + 1 })
        .eq("id", record.id);

      const remainingAttempts = MAX_ATTEMPTS - record.attempts - 1;
      console.log("[share-pin/verify] Invalid PIN, attempts remaining:", remainingAttempts);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid code. ${remainingAttempts} attempts remaining.`,
          remainingAttempts 
        },
        { status: 401 }
      );
    }

    // PIN is correct!
    console.log("[share-pin/verify] PIN verified successfully for:", record.email);

    // Optional: Delete the record after successful verification (one-time use)
    // Uncomment if you want PINs to be single-use:
    // await supabase.from("share_pins").delete().eq("id", record.id);

    // Return success with link_params so client can redirect
    return NextResponse.json({
      success: true,
      email: record.email,
      linkParams: record.link_params, // Return stored params for redirect
    });

  } catch (error) {
    console.error("[share-pin/verify] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

