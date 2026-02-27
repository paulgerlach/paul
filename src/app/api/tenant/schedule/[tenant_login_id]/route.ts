import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Helper to verify landlord owns the tenant
 */
async function verifyOwnership(tenantLoginId: string, userId: string): Promise<boolean> {
  const { data: tenantLogin } = await supabaseAdmin
    .from("tenant_logins")
    .select(`
      id,
      contractors (
        contracts (
          locals (
            objekte (
              user_id
            )
          )
        )
      )
    `)
    .eq("id", tenantLoginId)
    .single();

  if (!tenantLogin) return false;

  const objektUserId = (tenantLogin as any).contractors?.contracts?.locals?.objekte?.user_id;
  return objektUserId === userId;
}

/**
 * GET /api/tenant/schedule/[tenant_login_id]
 * 
 * Gets the email schedule for a tenant.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant_login_id: string }> }
) {
  try {
    const user = await getAuthenticatedServerUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { tenant_login_id } = await params;

    // Verify ownership
    const isOwner = await verifyOwnership(tenant_login_id, user.id);
    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Get schedule
    const { data: schedule, error } = await supabaseAdmin
      .from("tenant_email_schedules")
      .select("*")
      .eq("tenant_login_id", tenant_login_id)
      .single();

    if (error || !schedule) {
      return NextResponse.json({
        success: true,
        schedule: null,
      });
    }

    return NextResponse.json({
      success: true,
      schedule,
    });

  } catch (error) {
    console.error("[tenant/schedule] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tenant/schedule/[tenant_login_id]
 * 
 * Updates the email schedule for a tenant.
 * Can update: frequency, enabled
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ tenant_login_id: string }> }
) {
  try {
    const user = await getAuthenticatedServerUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { tenant_login_id } = await params;

    // Verify ownership
    const isOwner = await verifyOwnership(tenant_login_id, user.id);
    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { frequency, enabled } = body;

    // Build update object
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (frequency !== undefined) {
      if (!["weekly", "monthly"].includes(frequency)) {
        return NextResponse.json(
          { success: false, error: "frequency must be 'weekly' or 'monthly'" },
          { status: 400 }
        );
      }
      updates.frequency = frequency;

      // Recalculate next_send_at if frequency changed
      const now = new Date();
      if (frequency === "weekly") {
        updates.next_send_at = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      } else {
        updates.next_send_at = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }
    }

    if (enabled !== undefined) {
      updates.enabled = enabled;
    }

    // Check if schedule exists
    const { data: existingSchedule } = await supabaseAdmin
      .from("tenant_email_schedules")
      .select("id")
      .eq("tenant_login_id", tenant_login_id)
      .single();

    if (!existingSchedule) {
      return NextResponse.json(
        { success: false, error: "Schedule not found" },
        { status: 404 }
      );
    }

    // Update schedule
    const { data: updatedSchedule, error: updateError } = await supabaseAdmin
      .from("tenant_email_schedules")
      .update(updates)
      .eq("tenant_login_id", tenant_login_id)
      .select()
      .single();

    if (updateError) {
      console.error("[tenant/schedule] Update error:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update schedule" },
        { status: 500 }
      );
    }

    console.log("[tenant/schedule] Updated schedule for tenant:", tenant_login_id);

    return NextResponse.json({
      success: true,
      schedule: updatedSchedule,
    });

  } catch (error) {
    console.error("[tenant/schedule] PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tenant/schedule/[tenant_login_id]
 * 
 * Deletes the email schedule for a tenant.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tenant_login_id: string }> }
) {
  try {
    const user = await getAuthenticatedServerUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { tenant_login_id } = await params;

    // Verify ownership
    const isOwner = await verifyOwnership(tenant_login_id, user.id);
    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete schedule
    const { error: deleteError } = await supabaseAdmin
      .from("tenant_email_schedules")
      .delete()
      .eq("tenant_login_id", tenant_login_id);

    if (deleteError) {
      console.error("[tenant/schedule] Delete error:", deleteError);
      return NextResponse.json(
        { success: false, error: "Failed to delete schedule" },
        { status: 500 }
      );
    }

    console.log("[tenant/schedule] Deleted schedule for tenant:", tenant_login_id);

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("[tenant/schedule] DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
