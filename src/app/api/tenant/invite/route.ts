import { NextResponse } from "next/server";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { supabaseServer } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { generateSecureToken, getTokenExpiry, hashPassword } from "@/lib/tenantAuth";
import { sendTenantInviteEmail } from "@/utils/webhooks";
import crypto from "crypto";

// Service role client for tenant_logins table (RLS bypassed)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/tenant/invite
 * 
 * Invites a single tenant to create their dashboard login.
 * Creates a tenant_logins record with an invite token.
 * 
 * Authorization: Landlord must own the contractor (via objekte.user_id)
 */
export async function POST(request: Request) {
  try {
    // Step 1: Get authenticated landlord
    let user;
    try {
      user = await getAuthenticatedServerUser();
    } catch {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Step 2: Parse request body
    const body = await request.json();
    const { contractor_id, email } = body;

    // Validate required fields
    if (!contractor_id) {
      return NextResponse.json(
        { success: false, error: "contractor_id is required" },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Step 3: Verify landlord owns this contractor
    // Join path: contractors → contracts → locals → objekte.user_id
    const supabase = await supabaseServer();
    
    const { data: contractor, error: contractorError } = await supabase
      .from("contractors")
      .select(`
        id,
        first_name,
        last_name,
        contract_id,
        contracts!inner (
          id,
          local_id,
          locals!inner (
            id,
            objekt_id,
            objekte!inner (
              id,
              user_id
            )
          )
        )
      `)
      .eq("id", contractor_id)
      .single();

    if (contractorError || !contractor) {
      console.error("[tenant/invite] Contractor not found:", contractorError);
      return NextResponse.json(
        { success: false, error: "Contractor not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const objektUserId = (contractor as any).contracts?.locals?.objekte?.user_id;
    if (objektUserId !== user.id) {
      console.error("[tenant/invite] Forbidden: user", user.id, "does not own contractor", contractor_id);
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Step 4: Check for duplicate tenant_login
    const { data: existingLogin } = await supabaseAdmin
      .from("tenant_logins")
      .select("id")
      .eq("contractor_id", contractor_id)
      .single();

    if (existingLogin) {
      return NextResponse.json(
        { success: false, error: "Tenant already has a login record" },
        { status: 409 }
      );
    }

    // Step 5: Generate invite token and placeholder password
    const inviteToken = generateSecureToken();
    const inviteExpiry = getTokenExpiry(168); // 7 days
    
    // Placeholder password hash - tenant can't login until they complete setup
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const placeholderHash = await hashPassword(randomPassword);

    // Step 6: INSERT into tenant_logins
    const { data: newTenantLogin, error: insertError } = await supabaseAdmin
      .from("tenant_logins")
      .insert({
        contractor_id: contractor_id,
        email: email.toLowerCase().trim(),
        password_hash: placeholderHash,
        enabled: true,
        invite_token: inviteToken,
        invite_expires_at: inviteExpiry.toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("[tenant/invite] Insert error:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to create tenant login" },
        { status: 500 }
      );
    }

    console.log("[tenant/invite] Created tenant login:", newTenantLogin.id);
    console.log("[tenant/invite] Invite token:", inviteToken);

    // Step 7: Build setup URL
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const setupUrl = `${origin}/mieter/setup?token=${inviteToken}`;

    // Step 8: Trigger email via Make.com webhook
    const tenantName = `${(contractor as any).first_name || ""} ${(contractor as any).last_name || ""}`.trim() || "Mieter";
    await sendTenantInviteEmail(email, tenantName, setupUrl);
    console.log("[tenant/invite] Sent invite email to:", email);

    // Return success
    return NextResponse.json({
      success: true,
      tenant_login_id: newTenantLogin.id,
      setup_url: setupUrl,
      invite_expires_at: inviteExpiry.toISOString(),
    });

  } catch (error) {
    console.error("[tenant/invite] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
