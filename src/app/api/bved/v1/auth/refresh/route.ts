import {NextRequest, NextResponse} from "next/server";
import database from "@/db";
import { bved_api_tokens } from "@/db/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { formatError } from "../../_lib/auth";
import { generateToken, hashToken, extractTokenPrefix, verifyToken } from "../../_lib/token-hash";

/**
 * BVED API: POST /api/bved/v1/auth/refresh
 * 
 * Refresh an expired access token using a valid refresh token.
 * 
 * Tokens are verified using constant-time hash comparison.
 * 
 * Request body:
 * {
 *   "refresh_token": "bved_refresh_..."
 * }
 */
export async function POST(request: NextRequest) {
    try {
      const body = await request.json().catch(() => ({}));
      const { refresh_token } = body;
  
      if (!refresh_token || typeof refresh_token !== "string") {
        return NextResponse.json(
          { error: { code: "VALIDATION_ERROR", message: "refresh_token is required" } },
          { status: 400 }
        );
      }
  
      // Extract prefix for fast lookup
      const refreshTokenPrefix = extractTokenPrefix(refresh_token);
  
      // Find token record by prefix first (fast lookup)
      const tokenRecords = await database
        .select()
        .from(bved_api_tokens)
        .where(
          and(
            eq(bved_api_tokens.refresh_token_prefix, refreshTokenPrefix),
            eq(bved_api_tokens.revoked, false)
          )
        )
        .limit(10); // Limit to prevent excessive queries
  
      // Verify token against all matching records (handle hash collisions)
      let tokenRecord = null;
      for (const record of tokenRecords) {
        if (verifyToken(refresh_token, record.refresh_token_hash)) {
          tokenRecord = record;
          break;
        }
      }
  
      if (!tokenRecord) {
        return NextResponse.json(
          { error: { code: "INVALID_TOKEN", message: "Invalid or revoked refresh token" } },
          { status: 401 }
        );
      }
  
      // Check if refresh token is expired
      const refreshExpiresAt = new Date(tokenRecord.refresh_token_expires_at);
      if (refreshExpiresAt < new Date()) {
        return NextResponse.json(
          { error: { code: "TOKEN_EXPIRED", message: "Refresh token has expired" } },
          { status: 401 }
        );
      }
  
      // Generate new access token (keep same refresh token)
      const newAccessToken = generateToken("bved");
      const expiresIn = 3600; // 1 hour default
      const accessTokenExpiresAt = new Date(Date.now() + expiresIn * 1000);
  
      // Hash new access token
      const newAccessTokenHash = hashToken(newAccessToken);
      const newAccessTokenPrefix = extractTokenPrefix(newAccessToken);
  
      // Update token record
      const [updatedToken] = await database
        .update(bved_api_tokens)
        .set({
          access_token_prefix: newAccessTokenPrefix,
          access_token_hash: newAccessTokenHash,
          access_token_expires_at: accessTokenExpiresAt.toISOString(),
          last_used_at: new Date().toISOString(),
        })
        .where(eq(bved_api_tokens.id, tokenRecord.id))
        .returning();
  
      // Return new access token (refresh token stays the same)
      return NextResponse.json(
        {
          access_token: newAccessToken,
          refresh_token: refresh_token, // Same refresh token
          token_type: "Bearer",
          expires_in: expiresIn,
          expires_at: accessTokenExpiresAt.toISOString(),
          refresh_expires_at: refreshExpiresAt.toISOString(),
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("[BVED API] Error refreshing token:", error);
      return formatError(error);
    }
  }
  
  
  
  