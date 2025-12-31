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

// Generate random 6-digit PIN
function generatePin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Generate short unique share token (8 characters)
function generateShareToken(): string {
  return crypto.randomBytes(4).toString("hex"); // 8 hex chars
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, linkParams, expiresAt } = body;

    // Validate input
    if (!email || !linkParams) {
      return NextResponse.json(
        { error: "Email and linkParams are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Generate PIN and share token
    const pin = generatePin();
    const pinHash = hashPin(pin);
    const shareToken = generateShareToken();

    // Calculate expiry (default 30 days if not provided)
    const expiryDate = expiresAt
      ? new Date(expiresAt)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Store in database
    const { data, error } = await supabase
      .from("share_pins")
      .insert({
        pin_hash: pinHash,
        email: email.toLowerCase().trim(),
        link_params: linkParams,
        expires_at: expiryDate.toISOString(),
        attempts: 0,
        share_token: shareToken,
      })
      .select()
      .single();

    if (error) {
      console.error("[share-pin/generate] Database error:", error);
      return NextResponse.json(
        { error: "Failed to generate PIN" },
        { status: 500 }
      );
    }

    console.log("[share-pin/generate] PIN created for:", email);
    console.log("[share-pin/generate] Share token:", shareToken);

    // Return PIN and share token
    return NextResponse.json({
      success: true,
      pin: pin,
      shareToken: shareToken,
      expiresAt: expiryDate.toISOString(),
      id: data.id,
    });

  } catch (error) {
    console.error("[share-pin/generate] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

