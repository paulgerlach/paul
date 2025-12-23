import { NextResponse } from "next/server";
import database from "@/db";
import { bved_api_tokens } from "@/db/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { extractTokenPrefix, verifyToken } from "./token-hash";

export class ExternalAuthError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 401, code = "UNAUTHORIZED") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/**
 * External auth guard for BVED outbound APIs.
 * 
 * Supports:
 * 1. Database tokens (hashed, with expiration) - primary method
 * 2. Environment variable tokens (backward compatibility)
 * 
 * Headers:
 * - Authorization: Bearer <token>
 * - X-API-Key: <token>
 */
export type TokenRecord = typeof bved_api_tokens.$inferSelect;

/**
 * External auth guard. Returns the validated token record so callers
 * can scope data (e.g., filter by tokenRecord.user_id).
 */
export async function requireExternalAuth(request: Request): Promise<TokenRecord> {
  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");

  const providedToken =
    apiKeyHeader ||
    (authHeader?.startsWith("Bearer ")
      ? authHeader.replace(/^Bearer\s+/i, "")
      : null);

  if (!providedToken) {
    throw new ExternalAuthError("Missing authentication token", 401, "UNAUTHORIZED");
  }

  // First, check database tokens (hashed, with expiration)
  // NOTE: This query uses a direct database connection (DATABASE_URL) which should
  // use service role credentials that bypass RLS. If using Supabase connection pooling,
  // ensure it's configured with service role key to bypass RLS for token validation.
  try {
    const tokenPrefix = extractTokenPrefix(providedToken);

    // Look up by prefix first (fast lookup)
    // Security: This query bypasses RLS via service role connection
    const tokenRecords = await database
      .select()
      .from(bved_api_tokens)
      .where(
        and(
          eq(bved_api_tokens.access_token_prefix, tokenPrefix),
          eq(bved_api_tokens.revoked, false)
        )
      )
      .limit(10); // Limit to prevent excessive queries

    // Verify token against all matching records (handle hash collisions)
    let tokenRecord: TokenRecord | null = null;
    for (const record of tokenRecords) {
      if (verifyToken(providedToken, record.access_token_hash)) {
        tokenRecord = record;
        break;
      }
    }

    if (tokenRecord) {
      // Check if token is expired
      const expiresAt = new Date(tokenRecord.access_token_expires_at);
      if (expiresAt < new Date()) {
        throw new ExternalAuthError("Token has expired", 401, "TOKEN_EXPIRED");
      }

      // Update last_used_at (non-blocking)
      database
        .update(bved_api_tokens)
        .set({ last_used_at: new Date().toISOString() })
        .where(eq(bved_api_tokens.id, tokenRecord.id))
        .catch(() => {}); // Don't fail if update fails

        return tokenRecord; // Token is valid, return record for scoping
    }
  } catch (error) {
    // If it's an ExternalAuthError, re-throw it
    if (error instanceof ExternalAuthError) {
      throw error;
    }
    // Otherwise, fall through to env var check
  }

   // NOTE: Env tokens have no user context; with Option B (scoped by user_id), they cannot be used.
  const bearerEnv = process.env.BVED_EXTERNAL_BEARER_TOKEN;
  const apiKeyEnv = process.env.BVED_EXTERNAL_API_KEY;
  const allowedTokens = [bearerEnv, apiKeyEnv].filter(Boolean);

  if (!allowedTokens.includes(providedToken)) {
    throw new ExternalAuthError("Invalid authentication token", 401, "UNAUTHORIZED");
  }
   // Env tokens are not allowed for scoped access (no user_id available)
   throw new ExternalAuthError("Token does not include user context", 401, "UNAUTHORIZED");
}

export function formatError(error: unknown) {
  if (error instanceof ExternalAuthError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status }
    );
  }

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Unexpected server error",
      },
    },
    { status: 500 }
  );
}


