import { z } from "zod";
import { sendWebhookEvent } from "$lib/server/webhooks";
import { checkIPRateLimit } from "$lib/server/rateLimit";

// ─── Server-side validation (mirrors frontend schema) ───────────────────────
export const contactSchema = z.object({
	name: z.string().min(3).max(100),
	email: z.email().max(254),
	message: z.string().min(10).max(5000),
	infoChecked: z.literal(true),
	_hp: z.string().optional(), // honeypot
	_t: z.number().optional(), // form load timestamp
});

// ─── Gibberish detection ─────────────────────────────────────────────────────
// Detects random strings like "wyichtvxKjBGMhTz" or "mKfLTlwpwMchpAQpq"
// by checking consonant-to-total-letter ratio. Real text in any Latin-script
// language has vowels; random bot strings don't.
const VOWELS = new Set("aeiouAEIOUäöüÄÖÜàáâãèéêìíîòóôùúûñ");

export function isGibberish(text: string): boolean {
	// Strip non-letter characters
	const letters = text.replace(/[^a-zA-ZäöüÄÖÜàáâãèéêìíîòóôùúûñ]/g, "");
	if (letters.length < 5) return false; // too short to judge

	const vowelCount = [...letters].filter((ch) => VOWELS.has(ch)).length;
	const vowelRatio = vowelCount / letters.length;

	// Real text: ~35-45% vowels. Gibberish like "wyichtvxKjBGMhTz": <15%
	// Threshold at 15% is very conservative — catches obvious gibberish only
	if (vowelRatio < 0.15) return true;

	// Also check for no spaces in long text (real messages have word breaks)
	if (text.length > 20 && !text.includes(" ")) return true;

	return false;
}

/**
 * - `sent`: passed every check, webhook sent.
 * - `blocked`: caught by a spam layer. Callers still answer with success, so
 *   bots aren't told what triggered the block.
 * - `invalid`: failed validation; answer 400.
 */
export type ContactResult = "sent" | "blocked" | "invalid";

function silentReject(reason: string): ContactResult {
	console.log(`[CONTACT][SPAM] Blocked: ${reason}`);
	return "blocked";
}

/**
 * Honeypot → timing → zod → gibberish → rate limit, then the Make.com
 * webhook. Shared by `/api/contact` and the /kontakt form action (phase 7).
 */
export async function runContactPipeline(
	body: Record<string, unknown>,
	ip: string,
): Promise<ContactResult> {
	// Layer 1: Honeypot check
	// Bots auto-fill the hidden "website" field; real users never see it
	if (typeof body._hp === "string" && body._hp.length > 0) {
		return silentReject(`honeypot filled: "${body._hp}"`);
	}

	// Layer 2: Timing check
	// Bots submit instantly; real humans need at least 3 seconds
	if (typeof body._t === "number" && body._t) {
		const elapsed = Date.now() - body._t;
		if (elapsed < 3000) {
			return silentReject(`too fast: ${elapsed}ms`);
		}
	}

	// Layer 3: Server-side Zod validation
	const parsed = contactSchema.safeParse(body);
	if (!parsed.success) {
		console.log(
			`[CONTACT][SPAM] Validation failed:`,
			z.flattenError(parsed.error),
		);
		return "invalid";
	}

	const { name, email, message } = parsed.data;

	// Layer 4: Gibberish detection
	if (isGibberish(name) || isGibberish(message)) {
		return silentReject(
			`gibberish detected — name: "${name}", message: "${message}"`,
		);
	}

	// Layer 5: IP-based rate limiting (max 3 submissions per 10 minutes)
	const rateLimit = checkIPRateLimit(ip, 3, 600);
	if (!rateLimit.allowed) {
		return silentReject(`rate limit exceeded for IP: ${ip}`);
	}

	// ✅ All checks passed — send to Make.com → Slack
	await sendWebhookEvent("contactform", email, {
		first_name: name,
		message: message,
	});

	console.log(`[CONTACT] Sent contact form event for ${email}`);
	return "sent";
}
