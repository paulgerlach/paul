import { NextResponse } from "next/server";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/tenant/schedule
 * 
 * Creates an email schedule for a tenant.
 * Authorization: Landlord must own the tenant (via tenant_logins.contractor_id ownership check)
 */
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedServerUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tenant_login_id, frequency } = body;

    if (!tenant_login_id) {
      return NextResponse.json(
        { success: false, error: "tenant_login_id is required" },
        { status: 400 }
      );
    }

    if (!frequency || !["weekly", "monthly"].includes(frequency)) {
      return NextResponse.json(
        { success: false, error: "frequency must be 'weekly' or 'monthly'" },
        { status: 400 }
      );
    }

    // Verify tenant_login exists and landlord owns it
    const { data: tenantLogin, error: tenantError } = await supabaseAdmin
      .from("tenant_logins")
      .select(`
        id,
        contractor_id,
        contractors (
          id,
          contract_id,
          contracts (
            local_id,
            locals (
              objekt_id,
              objekte (
                user_id
              )
            )
          )
        )
      `)
      .eq("id", tenant_login_id)
      .single();

    if (tenantError || !tenantLogin) {
      console.error("[tenant/schedule] Tenant login not found:", tenantError);
      return NextResponse.json(
        { success: false, error: "Tenant login not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const objektUserId = (tenantLogin as any).contractors?.contracts?.locals?.objekte?.user_id;
    if (objektUserId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Check if schedule already exists
    const { data: existingSchedule } = await supabaseAdmin
      .from("tenant_email_schedules")
      .select("id")
      .eq("tenant_login_id", tenant_login_id)
      .single();

    if (existingSchedule) {
      return NextResponse.json(
        { success: false, error: "Schedule already exists for this tenant" },
        { status: 409 }
      );
    }

    // Calculate next_send_at based on frequency
    const now = new Date();
    let nextSendAt: Date;
    if (frequency === "weekly") {
      nextSendAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      // monthly - use proper calendar month to handle varying month lengths
      nextSendAt = new Date(now);
      nextSendAt.setMonth(nextSendAt.getMonth() + 1);
    }

    // Create schedule
    const { data: newSchedule, error: insertError } = await supabaseAdmin
      .from("tenant_email_schedules")
      .insert({
        tenant_login_id,
        frequency,
        enabled: true,
        next_send_at: nextSendAt.toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("[tenant/schedule] Insert error:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to create schedule" },
        { status: 500 }
      );
    }

    console.log("[tenant/schedule] Created schedule:", newSchedule.id);

    return NextResponse.json({
      success: true,
      schedule: newSchedule,
    });

  } catch (error) {
    console.error("[tenant/schedule] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
