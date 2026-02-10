import { NextResponse } from "next/server";
import { z } from "zod";
import { sendWebhookEvent } from "@/utils/webhooks";
import { checkIPRateLimit, getClientIP } from "@/app/api/bved/v1/_lib/rate-limit";

// ─── Server-side validation (mirrors frontend schema) ───────────────────────
const contactSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email().max(254),
    message: z.string().min(10).max(5000),
    infoChecked: z.literal(true),
    _hp: z.string().optional(),  // honeypot
    _t: z.number().optional(),   // form load timestamp
});

// ─── Gibberish detection ─────────────────────────────────────────────────────
// Detects random strings like "wyichtvxKjBGMhTz" or "mKfLTlwpwMchpAQpq"
// by checking consonant-to-total-letter ratio. Real text in any Latin-script
// language has vowels; random bot strings don't.
const VOWELS = new Set("aeiouAEIOUäöüÄÖÜàáâãèéêìíîòóôùúûñ");

function isGibberish(text: string): boolean {
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

// ─── Silent rejection helper ─────────────────────────────────────────────────
// Returns 200 OK to avoid tipping off bots about what triggered the block
function silentReject(reason: string) {
    console.log(`[CONTACT][SPAM] Blocked: ${reason}`);
    return NextResponse.json({ success: true });
}

// ─── POST handler ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Layer 1: Honeypot check
        // Bots auto-fill the hidden "website" field; real users never see it
        if (body._hp && body._hp.length > 0) {
            return silentReject(`honeypot filled: "${body._hp}"`);
        }

        // Layer 2: Timing check
        // Bots submit instantly; real humans need at least 3 seconds
        if (body._t) {
            const elapsed = Date.now() - body._t;
            if (elapsed < 3000) {
                return silentReject(`too fast: ${elapsed}ms`);
            }
        }

        // Layer 3: Server-side Zod validation
        const parsed = contactSchema.safeParse(body);
        if (!parsed.success) {
            console.log(`[CONTACT][SPAM] Validation failed:`, parsed.error.flatten());
            return NextResponse.json(
                { error: "Ungültige Eingabe. Bitte überprüfen Sie Ihre Angaben." },
                { status: 400 }
            );
        }

        const { name, email, message } = parsed.data;

        // Layer 4: Gibberish detection
        // Catches random strings like "wyichtvxKjBGMhTz" / "mKfLTlwpwMchpAQpq"
        if (isGibberish(name) || isGibberish(message)) {
            return silentReject(`gibberish detected — name: "${name}", message: "${message}"`);
        }

        // Layer 5: IP-based rate limiting (max 3 submissions per 10 minutes)
        // Reuses the existing BVED rate-limit utility
        const ip = getClientIP(req);
        const rateLimit = checkIPRateLimit(ip, 3, 600); // 3 per 600s (10 min)
        if (!rateLimit.allowed) {
            return silentReject(`rate limit exceeded for IP: ${ip}`);
        }

        // ✅ All checks passed — send to Make.com → Slack
        await sendWebhookEvent('contactform', email, {
            first_name: name,
            message: message,
        });

        console.log(`[CONTACT] Sent contact form event for ${email}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[CONTACT] Error sending webhook:', error);
        return NextResponse.json(
            { error: "Serverfehler. Bitte erneut versuchen." },
            { status: 500 }
        );
    }
}
