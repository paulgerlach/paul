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

export interface HeatingBillNotificationMetadata {
  docId: string;
  userId: string;
  /** Generator user display name (initiated by). */
  userName: string;
  /** Building owner name (from objekte.user_id); falls back to userName if omitted. */
  customerName?: string;
  buildingStreet: string;
  buildingZip: string;
  objektId: string;
  useMock: boolean;
  timestamp: string;
  /** Total apartments in the building. */
  totalApartments?: number;
  /** Total tenants (contractors from contracts overlapping bill period). */
  totalTenants?: number;
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

/** Label for hyperlinks: floor + living space concatenated. */
function buildApartmentLinkLabel(apt: {
  floor?: string | null;
  living_space?: string | null;
  localId: string;
}): string {
  const floor = apt.floor ?? "";
  const livingSpace = apt.living_space != null ? String(apt.living_space) : "";
  const parts = [floor, livingSpace].filter(Boolean);
  return parts.length > 0 ? parts.join(" • ") : apt.localId;
}

/** Full descriptive label for failed entries (uses buildLocalName when available). */
function buildApartmentDisplayLabel(apt: {
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

  const customerName = metadata.customerName ?? metadata.userName;
  const totalApts = metadata.totalApartments ?? apartments.length + failedEntries.length;
  const totalTenants = metadata.totalTenants;

  const lines: string[] = [];

  // Header
  lines.push("📄 *Heating Bill Generation Completed*");
  lines.push("");

  // Summary compact rows
  const tenantsPart =
    totalTenants != null ? ` | 👥 *Tenants:* ${totalTenants}` : "";
  lines.push(`👤 *Customer:* ${customerName}`)
  lines.push(`📍 *Street:* ${metadata.buildingStreet}, ${metadata.buildingZip}`);
  lines.push(`🏢 *Apartments:* ${totalApts}${tenantsPart}`);
  lines.push(`🔧 *Initiated by:* ${metadata.userName}`);
  lines.push(`🕐 *Timestamp:* ${metadata.timestamp}`);
  if (metadata.useMock) {
    lines.push("");
    lines.push("⚠️ _Using mock model (HEATING_BILL_USE_MOCK)_");
  }
  lines.push("");
  lines.push("");

  // Totals
  const failedSummary = failed > 0 ? ` | ❌ *Failed:* ${failed}` : "";
  lines.push(`📊 *Totals:* ✅ *Generated:* ${generated}${failedSummary}`);
  lines.push("");

  // Results (hyperlinks with floor + living_space as label)
  const hasPerApartment = apartments.length > 0 || failedEntries.length > 0;
  if (hasPerApartment && (mode === "batch" || failedEntries.length > 0)) {
    lines.push("🏠 *Apartment Bills*");
    lines.push("");
    const generatedRows = apartments.map((apt) => {
      const label = buildApartmentLinkLabel(apt);
      return apt.presignedUrl
        ? `• <${apt.presignedUrl}|${label}>`
        : `• ${label}`;
    });
    const failedRows = failedEntries.map((apt) => {
      const label = buildApartmentDisplayLabel(apt);
      const reason = apt.errorMessage ? ` – ${apt.errorMessage}` : "";
      return `• Failed: ${label}${reason}`;
    });
    lines.push(...generatedRows, ...failedRows);
  } else if (apartments.length > 0) {
    lines.push("🔗 *PDF Links*");
    lines.push("");
    const links = apartments.map((apt) => {
      const label = buildApartmentLinkLabel(apt);
      return apt.presignedUrl
        ? `<${apt.presignedUrl}|${label}>`
        : label;
    });
    lines.push(...links.map((link) => `• ${link}`));
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
