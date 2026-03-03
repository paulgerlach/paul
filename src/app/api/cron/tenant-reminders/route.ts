import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTenantReminderEmail } from "@/utils/webhooks";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CRON_SECRET = process.env.CRON_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://heidisystems.com";

/**
 * GET /api/cron/tenant-reminders
 * 
 * Cron job endpoint to send scheduled tenant reminder emails.
 * Should be called by Vercel Cron or external scheduler (e.g., daily at 9am).
 * 
 * Security: Requires CRON_SECRET in Authorization header
 * 
 * Process:
 * 1. Find all schedules where enabled=true AND next_send_at <= now
 * 2. For each schedule, get tenant info and send reminder email
 * 3. Update last_sent_at and calculate new next_send_at
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (fail-closed: reject if secret not set or doesn't match)
    const authHeader = request.headers.get("authorization");
    if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
      console.error("[cron/tenant-reminders] Unauthorized request");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[cron/tenant-reminders] Starting scheduled reminder job...");

    const now = new Date().toISOString();

    // Find all due schedules with tenant info
    const { data: dueSchedules, error: queryError } = await supabaseAdmin
      .from("tenant_email_schedules")
      .select(`
        id,
        tenant_login_id,
        frequency,
        next_send_at,
        tenant_logins (
          id,
          email,
          contractors (
            first_name,
            last_name
          )
        )
      `)
      .eq("enabled", true)
      .lte("next_send_at", now);

    if (queryError) {
      console.error("[cron/tenant-reminders] Query error:", queryError);
      return NextResponse.json(
        { success: false, error: "Database query failed" },
        { status: 500 }
      );
    }

    if (!dueSchedules || dueSchedules.length === 0) {
      console.log("[cron/tenant-reminders] No reminders due at this time");
      return NextResponse.json({
        success: true,
        message: "No reminders due",
        processed: 0,
      });
    }

    console.log(`[cron/tenant-reminders] Found ${dueSchedules.length} due reminders`);

    let processed = 0;
    let failed = 0;

    // Process each due schedule
    for (const schedule of dueSchedules) {
      try {
        const tenantLogin = schedule.tenant_logins as any;
        
        if (!tenantLogin?.email) {
          console.warn(`[cron/tenant-reminders] No email for schedule ${schedule.id}, skipping`);
          failed++;
          continue;
        }

        const tenantName = tenantLogin.contractors 
          ? `${tenantLogin.contractors.first_name || ""} ${tenantLogin.contractors.last_name || ""}`.trim()
          : "Mieter";
        
        const tenantEmail = tenantLogin.email;
        const dashboardURL = `${BASE_URL}/mieter/dashboard`;

        // Send reminder email via webhook
        await sendTenantReminderEmail(tenantEmail, tenantName, dashboardURL);

        // Calculate new next_send_at based on frequency
        const newNextSendAt = calculateNextSendAt(schedule.frequency);

        // Update schedule
        const { error: updateError } = await supabaseAdmin
          .from("tenant_email_schedules")
          .update({
            last_sent_at: now,
            next_send_at: newNextSendAt,
            updated_at: now,
          })
          .eq("id", schedule.id);

        if (updateError) {
          console.error(`[cron/tenant-reminders] Failed to update schedule ${schedule.id}:`, updateError);
          failed++;
        } else {
          console.log(`[cron/tenant-reminders] Sent reminder to ${tenantEmail}, next: ${newNextSendAt}`);
          processed++;
        }

      } catch (err) {
        console.error(`[cron/tenant-reminders] Error processing schedule ${schedule.id}:`, err);
        failed++;
      }
    }

    console.log(`[cron/tenant-reminders] Job complete. Processed: ${processed}, Failed: ${failed}`);

    return NextResponse.json({
      success: true,
      message: "Reminder job completed",
      processed,
      failed,
      total: dueSchedules.length,
    });

  } catch (error) {
    console.error("[cron/tenant-reminders] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Calculate the next send date based on frequency
 */
function calculateNextSendAt(frequency: string): string {
  const now = new Date();
  
  if (frequency === "weekly") {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  } else {
    // monthly - use proper calendar month to handle varying month lengths
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString();
  }
}
