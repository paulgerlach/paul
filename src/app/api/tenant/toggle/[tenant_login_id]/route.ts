import { NextResponse } from "next/server";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { supabaseServer } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";

// Service role client for tenant_logins table (RLS bypassed)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * PATCH /api/tenant/toggle/[tenant_login_id]
 * 
 * Enable or disable a tenant's dashboard access.
 * 
 * Authorization: Landlord must own the tenant (via objekte.user_id)
 * 
 * Request body: { enabled: boolean }
 * Response: { success: true, enabled: boolean }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tenant_login_id: string }> }
) {
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

    // Step 2: Get tenant_login_id from params
    const { tenant_login_id } = await params;

    if (!tenant_login_id) {
      return NextResponse.json(
        { success: false, error: "tenant_login_id is required" },
        { status: 400 }
      );
    }

    // Step 3: Parse request body
    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { success: false, error: "enabled must be a boolean" },
        { status: 400 }
      );
    }

    // Step 4: Get the tenant_login record to find contractor_id
    const { data: tenantLogin, error: loginError } = await supabaseAdmin
      .from("tenant_logins")
      .select("id, contractor_id, enabled")
      .eq("id", tenant_login_id)
      .single();

    if (loginError || !tenantLogin) {
      console.error("[tenant/toggle] Tenant login not found:", loginError);
      return NextResponse.json(
        { success: false, error: "Tenant login not found" },
        { status: 404 }
      );
    }

    // Step 5: Verify landlord owns this contractor
    // Join path: contractors → contracts → locals → objekte.user_id
    const supabase = await supabaseServer();
    
    const { data: contractor, error: contractorError } = await supabase
      .from("contractors")
      .select(`
        id,
        contracts!inner (
          id,
          locals!inner (
            id,
            objekte!inner (
              id,
              user_id
            )
          )
        )
      `)
      .eq("id", tenantLogin.contractor_id)
      .single();

    if (contractorError || !contractor) {
      console.error("[tenant/toggle] Contractor not found:", contractorError);
      return NextResponse.json(
        { success: false, error: "Contractor not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const objektUserId = (contractor as any).contracts?.locals?.objekte?.user_id;
    if (objektUserId !== user.id) {
      console.error("[tenant/toggle] Forbidden: user", user.id, "does not own contractor", tenantLogin.contractor_id);
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Step 6: Update enabled status
    const { error: updateError } = await supabaseAdmin
      .from("tenant_logins")
      .update({ enabled })
      .eq("id", tenant_login_id);

    if (updateError) {
      console.error("[tenant/toggle] Update error:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update tenant status" },
        { status: 500 }
      );
    }

    console.log(`[tenant/toggle] Tenant ${tenant_login_id} enabled=${enabled}`);

    // Return success with new status
    return NextResponse.json({
      success: true,
      tenant_login_id,
      enabled,
      message: enabled ? "Tenant access enabled" : "Tenant access disabled",
    });

  } catch (error) {
    console.error("[tenant/toggle] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
