import { NextResponse } from "next/server";
import database from "@/db";
import { bved_api_tokens } from "@/db/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { extractTokenPrefix, verifyToken } from "./token-hash";
import {
  checkTokenRateLimit,
  checkIPRateLimit,
  getClientIP,
  addRateLimitHeaders,
  type RateLimitResult,
} from "./rate-limit";

export class ExternalAuthError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 401, code = "UNAUTHORIZED") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export type TokenRecord = typeof bved_api_tokens.$inferSelect;

export interface AuthResult {
  token: TokenRecord | null;
  tokenRateLimit: RateLimitResult;
  ipRateLimit: RateLimitResult;
  clientIP: string;
}

/**
 * External auth guard for BVED outbound APIs.
 * Returns the validated token record so routes can scope data by user_id.
 * Also performs rate limiting checks.
 * 
 * Supports:
 * 1. Database tokens (hashed, with expiration) - primary method
 * 2. Environment variable tokens (backward compatibility) - NOTE: No user_id available
 * 
 * Headers:
 * - Authorization: Bearer <token>
 * - X-API-Key: <token>
 * 
 * Rate Limiting:
 * - Per-token: 1000 requests/hour (default)
 * - Per-IP: 100 requests/minute (default)
 * 
 * @throws ExternalAuthError if rate limit exceeded or token invalid
 */
export async function requireExternalAuth(request: Request): Promise<AuthResult> {
  const clientIP = getClientIP(request);
  
  // Check IP rate limit first (before token validation)
  const ipRateLimit = checkIPRateLimit(clientIP, 100, 60); // 100 req/min
  if (!ipRateLimit.allowed) {
    throw new ExternalAuthError(
      `Rate limit exceeded. Try again after ${new Date(ipRateLimit.reset * 1000).toISOString()}`,
      429,
      "RATE_LIMIT_EXCEEDED"
    );
  }

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

      // Check token rate limit
      const tokenRateLimit = checkTokenRateLimit(tokenRecord.id, 1000, 3600); // 1000 req/hour
      if (!tokenRateLimit.allowed) {
        throw new ExternalAuthError(
          `Rate limit exceeded. Try again after ${new Date(tokenRateLimit.reset * 1000).toISOString()}`,
          429,
          "RATE_LIMIT_EXCEEDED"
        );
      }

      // Update last_used_at (fire and forget, but log errors)
      database
        .update(bved_api_tokens)
        .set({ last_used_at: new Date().toISOString() })
        .where(eq(bved_api_tokens.id, tokenRecord.id))
        .catch((err) => {
          // Log but don't fail the request
          console.error("[BVED API] Failed to update last_used_at:", err);
        });

      return {
        token: tokenRecord,
        tokenRateLimit,
        ipRateLimit,
        clientIP,
      };
    }
  } catch (error) {
    // If it's an ExternalAuthError, re-throw it
    if (error instanceof ExternalAuthError) {
      throw error;
    }
    // Otherwise, fall through to env var check
  }

  // Fallback: Check environment variables (backward compatibility)
  // NOTE: Env tokens have no user_id, so return null (routes must handle this)
  const bearerEnv = process.env.BVED_EXTERNAL_BEARER_TOKEN;
  const apiKeyEnv = process.env.BVED_EXTERNAL_API_KEY;
  const allowedTokens = [bearerEnv, apiKeyEnv].filter(Boolean);

  if (allowedTokens.includes(providedToken)) {
    // Env token is valid but has no user context
    // Return null - routes should handle this (either reject or allow full access)
    // Note: No token rate limiting for env tokens (no token ID)
    return {
      token: null,
      tokenRateLimit: { allowed: true, limit: 0, remaining: 0, reset: 0 },
      ipRateLimit,
      clientIP,
    };
  }

  throw new ExternalAuthError("Invalid authentication token", 401, "UNAUTHORIZED");
}

/**
 * Helper to create a response with rate limit headers
 */
export function createResponse(
  data: any,
  status: number,
  tokenRateLimit: RateLimitResult,
  ipRateLimit: RateLimitResult
): Response {
  const response = NextResponse.json(data, { status });
  addRateLimitHeaders(response, tokenRateLimit, ipRateLimit);
  return response;
}

export function formatError(error: unknown, authResult?: AuthResult) {
  if (error instanceof ExternalAuthError) {
    const response = NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status }
    );
    
    // Add rate limit headers if available
    if (authResult) {
      addRateLimitHeaders(response, authResult.tokenRateLimit, authResult.ipRateLimit);
    }
    
    // Add rate limit headers even on error (if available)
    if (error.status === 429) {
      response.headers.set("Retry-After", "60"); // Suggest retry after 60 seconds
    }
    
    return response;
  }

  const response = NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Unexpected server error",
      },
    },
    { status: 500 }
  );
  
  // Add rate limit headers if available
  if (authResult) {
    addRateLimitHeaders(response, authResult.tokenRateLimit, authResult.ipRateLimit);
  }
  
  return response;
}


