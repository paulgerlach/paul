/**
 * Server-side Slack notification helpers (Incoming Webhook version).
 * Failures are logged but never throw - callers should not depend on Slack for success.
 *
 * ENV required:
 *   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
 *
 * Notes:
 * - Incoming webhooks typically post to the channel configured when the webhook was created.
 * - Channel overrides may be ignored depending on Slack settings.
 */
import { buildLocalName } from "@/utils";

const MAX_APARTMENT_LINKS = 20; // Truncate if more to keep message readable

export interface HeatingBillNotificationMetadata {
  docId: string;
  userId: string;
  userName: string;
  buildingStreet: string;
  buildingZip: string;
  objektId: string;
  useMock: boolean;
  timestamp: string;
}

export interface HeatingBillApartmentResult {
  localId: string;
  presignedUrl: string;
  floor?: string | null;
  house_location?: string | null;
  living_space?: string | null;
  residential_area?: string | null;
}

type SlackWebhookPayload = {
  text: string;
  unfurl_links?: boolean;
  unfurl_media?: boolean;
  // Optional fields; may be ignored by Slack depending on webhook configuration.
  channel?: string;
  username?: string;
  icon_emoji?: string;
};

/**
 * Sends an admin Slack notification when heating bill generation completes.
 * Never throws; logs and returns silently if Slack is misconfigured or fails.
 */
export async function sendHeatingBillNotification(
  metadata: HeatingBillNotificationMetadata,
  mode: "single" | "batch",
  generated: number,
  failed: number,
  apartments: HeatingBillApartmentResult[],
  failedLocalIds?: string[]
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "[SlackNotifications] Skipping heating bill notification: SLACK_WEBHOOK_URL missing"
    );
    return;
  }

  const lines: string[] = [];
  lines.push("*Heating Bill Generation Completed*");
  lines.push("");
  lines.push("*Request:*");
  lines.push(`• Doc ID: \`${metadata.docId}\``);
  lines.push(`• Mode: ${mode === "single" ? "single" : "batch"}`);
  lines.push(`• Initiated by: ${metadata.userName} (\`${metadata.userId}\`)`);
  lines.push(`• Timestamp: ${metadata.timestamp}`);
  if (metadata.useMock) {
    lines.push(`• _Using mock model (HEATING_BILL_USE_MOCK)_`);
  }
  lines.push("");
  lines.push("*Building:*");
  lines.push(`• ${metadata.buildingStreet}, ${metadata.buildingZip}`);
  lines.push(`• Object ID: \`${metadata.objektId}\``);
  lines.push("");
  lines.push("*Result:*");
  lines.push(`• Generated: ${generated}`);
  if (failed > 0) {
    lines.push(`• Failed: ${failed}`);
    if (failedLocalIds && failedLocalIds.length > 0) {
      lines.push(`• Failed local IDs: ${failedLocalIds.join(", ")}`);
    }
  }
  lines.push("");

  if (apartments.length > 0) {
    lines.push("*PDF Links:*");
    const toShow = apartments.slice(0, MAX_APARTMENT_LINKS);

    for (const apt of toShow) {
      const label = buildLocalName({
        floor: apt.floor ?? undefined,
        house_location: apt.house_location ?? undefined,
        residential_area: apt.residential_area ?? undefined,
        living_space: apt.living_space ? String(apt.living_space) : undefined,
      });

      const link = `<${apt.presignedUrl}|${label || apt.localId}>`;
      lines.push(`• ${link}`);
    }

    if (apartments.length > MAX_APARTMENT_LINKS) {
      lines.push(`• _... and ${apartments.length - MAX_APARTMENT_LINKS} more_`);
    }
  }

  const text = lines.join("\n");

  const payload: SlackWebhookPayload = {
    text,
    unfurl_links: false,
    unfurl_media: false,
  };

  try {
    const resp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Slack incoming webhooks typically return "ok" (plain text) on success.
    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      console.error("[SlackNotifications] Webhook failed:", resp.status, body);
      return;
    }

    // Optional: log non-"ok" responses even when status is 200
    const body = await resp.text().catch(() => "");
    if (body && body.trim().toLowerCase() !== "ok") {
      console.warn("[SlackNotifications] Webhook non-ok response:", body);
    }
  } catch (error) {
    console.error("[SlackNotifications] Failed to send heating bill notification:", error);
  }
}
