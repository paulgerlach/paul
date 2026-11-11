// The visitor's cookie choice, pure (no DOM): how it's stored and what it
// means for Google's Consent Mode v2. The only optional category is
// "Statistik" (Google Analytics); the site runs no ads, so the ad_* signals
// stay denied whatever the visitor picks.

/** localStorage key of the stored choice. */
export const CONSENT_KEY = "heidi_consent_v1";

/** A choice is asked again after this long (12 months). */
export const CONSENT_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

export type Consent = { analytics: boolean; at: number };

type ConsentState = "granted" | "denied";

/** Before any choice: everything denied (sent before gtag's `config`). */
export const CONSENT_DEFAULTS = {
	ad_storage: "denied",
	ad_user_data: "denied",
	ad_personalization: "denied",
	analytics_storage: "denied",
	wait_for_update: 500,
} as const;

/** The `consent update` for a choice. */
export function consentUpdate(c: Pick<Consent, "analytics">): {
	analytics_storage: ConsentState;
} {
	return { analytics_storage: c.analytics ? "granted" : "denied" };
}

/** A stored choice, or null when there's none, it's broken or too old. */
export function parseConsent(raw: string | null, now: number): Consent | null {
	if (!raw) return null;
	let value: unknown;
	try {
		value = JSON.parse(raw);
	} catch {
		return null;
	}
	if (typeof value !== "object" || value === null) return null;
	const { analytics, at } = value as Record<string, unknown>;
	if (typeof analytics !== "boolean" || typeof at !== "number") return null;
	if (!(at <= now && now - at < CONSENT_MAX_AGE)) return null;
	return { analytics, at };
}

export const serializeConsent = (c: Consent) => JSON.stringify(c);
