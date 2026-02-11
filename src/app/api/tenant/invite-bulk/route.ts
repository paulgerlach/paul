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
 * POST /api/tenant/invite-bulk
 * 
 * Invites all eligible tenants for a building to create their dashboard login.
 * Skips: tenants without email, already invited, already active
 * 
 * Authorization: Landlord must own the building (via objekte.user_id)
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
    const { building_id } = body;

    if (!building_id) {
      return NextResponse.json(
        { success: false, error: "building_id is required" },
        { status: 400 }
      );
    }

    // Step 3: Verify landlord owns this building
    const supabase = await supabaseServer();
    
    const { data: building, error: buildingError } = await supabase
      .from("objekte")
      .select("id")
      .eq("id", building_id)
      .eq("user_id", user.id)
      .single();

    if (buildingError || !building) {
      console.error("[tenant/invite-bulk] Building not found or access denied:", buildingError);
      return NextResponse.json(
        { success: false, error: "Building not found or access denied" },
        { status: 403 }
      );
    }

    // Step 4: Get all tenants for this building
    // Chain: objekte → locals → contracts → contractors
    const { data: locals } = await supabase
      .from("locals")
      .select("id")
      .eq("objekt_id", building_id);

    if (!locals || locals.length === 0) {
      return NextResponse.json({
        success: true,
        summary: {
          total_tenants: 0,
          invited_count: 0,
          skipped_count: 0,
          skipped: [],
          invited: [],
        },
        message: "No apartments found in this building",
      });
    }

    const localIds = locals.map(l => l.id);
    
    const { data: contracts } = await supabase
      .from("contracts")
      .select("id")
      .in("local_id", localIds);

    if (!contracts || contracts.length === 0) {
      return NextResponse.json({
        success: true,
        summary: {
          total_tenants: 0,
          invited_count: 0,
          skipped_count: 0,
          skipped: [],
          invited: [],
        },
        message: "No contracts found in this building",
      });
    }

    const contractIds = contracts.map(c => c.id);

    const { data: contractors } = await supabase
      .from("contractors")
      .select("id, email, first_name, last_name")
      .in("contract_id", contractIds);

    if (!contractors || contractors.length === 0) {
      return NextResponse.json({
        success: true,
        summary: {
          total_tenants: 0,
          invited_count: 0,
          skipped_count: 0,
          skipped: [],
          invited: [],
        },
        message: "No tenants found in this building",
      });
    }

    // Step 5: Get existing tenant_logins for these contractors
    const contractorIds = contractors.map(c => c.id);
    const { data: existingLogins } = await supabaseAdmin
      .from("tenant_logins")
      .select("contractor_id")
      .in("contractor_id", contractorIds);

    const existingContractorIds = new Set(existingLogins?.map(l => l.contractor_id) || []);

    // Step 6: Filter and invite eligible tenants
    const skipped: Array<{ contractor_id: string; name: string; reason: string }> = [];
    const invited: Array<{ contractor_id: string; email: string; name: string }> = [];
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    for (const contractor of contractors) {
      const name = `${contractor.first_name || ""} ${contractor.last_name || ""}`.trim() || "Unknown";

      // Skip if no email
      if (!contractor.email) {
        skipped.push({
          contractor_id: contractor.id,
          name,
          reason: "no_email",
        });
        continue;
      }

      // Skip if already has login record
      if (existingContractorIds.has(contractor.id)) {
        skipped.push({
          contractor_id: contractor.id,
          name,
          reason: "already_has_login",
        });
        continue;
      }

      // Generate invite token and placeholder password
      const inviteToken = generateSecureToken();
      const inviteExpiry = getTokenExpiry(168); // 7 days
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const placeholderHash = await hashPassword(randomPassword);

      // INSERT into tenant_logins
      const { error: insertError } = await supabaseAdmin
        .from("tenant_logins")
        .insert({
          contractor_id: contractor.id,
          email: contractor.email.toLowerCase().trim(),
          password_hash: placeholderHash,
          enabled: true,
          invite_token: inviteToken,
          invite_expires_at: inviteExpiry.toISOString(),
        });

      if (insertError) {
        console.error(`[tenant/invite-bulk] Failed to invite ${contractor.email}:`, insertError);
        skipped.push({
          contractor_id: contractor.id,
          name,
          reason: "insert_failed",
        });
        continue;
      }

      const setupUrl = `${origin}/mieter/setup?token=${inviteToken}`;
      console.log(`[tenant/invite-bulk] Invited ${contractor.email}, setup URL: ${setupUrl}`);

      invited.push({
        contractor_id: contractor.id,
        email: contractor.email,
        name,
      });

      // Trigger email via Make.com webhook
      await sendTenantInviteEmail(contractor.email, name, setupUrl);
    }

    console.log(`[tenant/invite-bulk] Complete: ${invited.length} invited, ${skipped.length} skipped`);

    return NextResponse.json({
      success: true,
      summary: {
        total_tenants: contractors.length,
        invited_count: invited.length,
        skipped_count: skipped.length,
        skipped,
        invited,
      },
      message: `${invited.length} Mieter eingeladen, ${skipped.length} übersprungen`,
    });

  } catch (error) {
    console.error("[tenant/invite-bulk] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
