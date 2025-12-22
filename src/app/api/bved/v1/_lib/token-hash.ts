import { createHmac, randomBytes } from "crypto";

const PEPPER = process.env.BVED_TOKEN_PEPPER || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "default-pepper-change-in-production";

if (!process.env.BVED_TOKEN_PEPPER && process.env.NODE_ENV === "production") {
    console.warn("BVED_TOKEN_PEPPER is not set, using default pepper");
}

// generate a secure random token
export function generateToken(prefix: string = "bved"): string {
    const randomPart = randomBytes(32).toString("hex");
    return `${prefix}-${randomPart}`;
}

// Extract prefix from token (first  8 chars after prefix)
export function extractTokenPrefix(token: string): string {
    // Extract first 8 chars after the prefix ("bved_" or "bved_refresh_");
    const parts = token.split("_");
    if (parts.length >= 2) {
        return parts[1].substring(0, 8);
    }
    return token.substring(0, 8);
}

export function hashToken(token: string): string {
    const hmac = createHmac("sha256", PEPPER);
    hmac.update(token);
    return hmac.digest("hex");
}

/**
 * Verify a token against a stored hash
 * 
 * @param token - Plain token to verify
 * @param storedHash - Hash stored in database
 * @returns true if token matches hash
 */
export function verifyToken(token: string, storedHash: string): boolean {
    const computedHash = hashToken(token);
    // Use constant-time comparison to prevent timing attacks
    return constantTimeEquals(computedHash, storedHash);
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeEquals(a: string, b: string): boolean {
    if (a.length !== b.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
}