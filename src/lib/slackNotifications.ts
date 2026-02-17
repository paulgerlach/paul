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

const MAX_APARTMENT_ROWS = 25;

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
  /** Optional; omitted in batch mode to avoid per-local signed URL generation. */
  presignedUrl?: string;
  floor?: string | null;
  house_location?: string | null;
  living_space?: string | null;
  residential_area?: string | null;
}

export interface HeatingBillFailedEntry {
  localId: string;
  floor?: string | null;
  house_location?: string | null;
  living_space?: string | null;
  residential_area?: string | null;
  errorMessage?: string;
}

type SlackWebhookPayload = {
  text: string;
  unfurl_links?: boolean;
  unfurl_media?: boolean;
  channel?: string;
  username?: string;
  icon_emoji?: string;
};

function buildApartmentLabel(apt: {
  floor?: string | null;
  house_location?: string | null;
  residential_area?: string | null;
  living_space?: string | null;
  localId: string;
}): string {
  const name = buildLocalName({
    floor: apt.floor ?? undefined,
    house_location: apt.house_location ?? undefined,
    residential_area: apt.residential_area ?? undefined,
    living_space: apt.living_space ? String(apt.living_space) : undefined,
  });
  return name || apt.localId;
}

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
  failedInput?:
    | string[]
    | HeatingBillFailedEntry[]
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "[SlackNotifications] Skipping heating bill notification: SLACK_WEBHOOK_URL missing"
    );
    return;
  }

  const failedEntries: HeatingBillFailedEntry[] = Array.isArray(failedInput)
    ? failedInput.length > 0 && typeof failedInput[0] === "object" && "localId" in (failedInput[0] as object)
      ? (failedInput as HeatingBillFailedEntry[])
      : (failedInput as string[]).map((id) => ({ localId: id }))
    : [];

  const lines: string[] = [];
  lines.push("*Heating Bill Generation Completed*");
  lines.push("");
  lines.push("*Summary:*");
  lines.push(`• Mode: ${mode === "single" ? "Single" : "Batch"}`);
  lines.push(`• Doc ID: \`${metadata.docId}\``);
  lines.push(`• Building: ${metadata.buildingStreet}, ${metadata.buildingZip}`);
  lines.push(`• Object ID: \`${metadata.objektId}\``);
  lines.push(`• Initiated by: ${metadata.userName} (\`${metadata.userId}\`)`);
  lines.push(`• Timestamp: ${metadata.timestamp}`);
  if (metadata.useMock) {
    lines.push(`• _Using mock model (HEATING_BILL_USE_MOCK)_`);
  }
  lines.push("");
  lines.push("*Totals:*");
  lines.push(`• Generated: ${generated}`);
  if (failed > 0) {
    lines.push(`• Failed: ${failed}`);
  }
  lines.push("");

  const hasPerApartment = apartments.length > 0 || failedEntries.length > 0;
  if (hasPerApartment && (mode === "batch" || failedEntries.length > 0)) {
    lines.push("*Apartment Results:*");
    const generatedRows = apartments.slice(0, MAX_APARTMENT_ROWS).map((apt) => {
      const label = buildApartmentLabel(apt);
      return apt.presignedUrl
        ? `• *Generated*: <${apt.presignedUrl}|${label}>`
        : `• *Generated*: ${label}`;
    });
    const failedRows = failedEntries.slice(0, MAX_APARTMENT_ROWS).map((apt) => {
      const label = buildApartmentLabel(apt);
      const reason = apt.errorMessage ? ` – ${apt.errorMessage}` : "";
      return `• *Failed*: ${label}${reason}`;
    });
    lines.push(...generatedRows, ...failedRows);
    const extraGenerated = apartments.length - generatedRows.length;
    const extraFailed = failedEntries.length - failedRows.length;
    if (extraGenerated > 0 || extraFailed > 0) {
      lines.push(`• _... and ${extraGenerated + extraFailed} more_`);
    }
  } else if (apartments.length > 0) {
    lines.push("*PDF Links:*");
    const toShow = apartments.slice(0, MAX_APARTMENT_ROWS);
    for (const apt of toShow) {
      const label = buildApartmentLabel(apt);
      const link = apt.presignedUrl
        ? `<${apt.presignedUrl}|${label}>`
        : label;
      lines.push(`• ${link}`);
    }
    if (apartments.length > MAX_APARTMENT_ROWS) {
      lines.push(`• _... and ${apartments.length - MAX_APARTMENT_ROWS} more_`);
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

    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      console.error("[SlackNotifications] Webhook failed:", resp.status, body);
      return;
    }

    const body = await resp.text().catch(() => "");
    if (body && body.trim().toLowerCase() !== "ok") {
      console.warn("[SlackNotifications] Webhook non-ok response:", body);
    }
  } catch (error) {
    console.error(
      "[SlackNotifications] Failed to send heating bill notification:",
      error
    );
  }
}
