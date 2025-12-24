import { NextRequest, NextResponse } from "next/server";
import database from "@/db";
import { bved_api_tokens } from "@/db/drizzle/schema";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { formatError } from "../../_lib/auth";
import { generateToken, hashToken, extractTokenPrefix } from "../../_lib/token-hash";

/**
 * BVED API: POST /api/bved/v1/auth/token
 * 
 * Generate access and refresh tokens for external API clients.
 * Requires authenticated user (admin or service account).
 * 
 * Tokens are hashed using HMAC-SHA256 with pepper before storage.
 * Only the prefix is stored for fast lookup, full hash for verification.
 * 
 * Request body:
 * {
 *   "client_name": "Casavi Integration",
 *   "expires_in": 3600, // Optional: access token TTL in seconds (default: 1 hour)
 *   "refresh_expires_in": 2592000 // Optional: refresh token TTL in seconds (default: 30 days)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Require authenticated user
    const user = await getAuthenticatedServerUser();

    const body = await request.json().catch(() => ({}));
    const { client_name, expires_in = 3600, refresh_expires_in = 2592000 } = body;

    if (!client_name || typeof client_name !== "string") {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "client_name is required" } },
        { status: 400 }
      );
    }

    // Validate expiration times
    if (expires_in < 60 || expires_in > 86400) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "expires_in must be between 60 and 86400 seconds" } },
        { status: 400 }
      );
    }

    if (refresh_expires_in < 86400 || refresh_expires_in > 31536000) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "refresh_expires_in must be between 86400 and 31536000 seconds" } },
        { status: 400 }
      );
    }

    // Generate secure tokens
    const accessToken = generateToken("bved");
    const refreshToken = generateToken("bved_refresh");

    // Hash tokens before storage
    const accessTokenHash = hashToken(accessToken);
    const refreshTokenHash = hashToken(refreshToken);
    const accessTokenPrefix = extractTokenPrefix(accessToken);
    const refreshTokenPrefix = extractTokenPrefix(refreshToken);

    // Calculate expiration times
    const now = new Date();
    const accessTokenExpiresAt = new Date(now.getTime() + expires_in * 1000);
    const refreshTokenExpiresAt = new Date(now.getTime() + refresh_expires_in * 1000);

    // Store hashed tokens in database
    const [tokenRecord] = await database
      .insert(bved_api_tokens)
      .values({
        user_id: user.id,
        client_name,
        access_token_prefix: accessTokenPrefix,
        access_token_hash: accessTokenHash,
        refresh_token_prefix: refreshTokenPrefix,
        refresh_token_hash: refreshTokenHash,
        access_token_expires_at: accessTokenExpiresAt.toISOString(),
        refresh_token_expires_at: refreshTokenExpiresAt.toISOString(),
      })
      .returning();

    // Return plain tokens to client (only time they're exposed)
    return NextResponse.json(
      {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in,
        refresh_expires_in,
        expires_at: accessTokenExpiresAt.toISOString(),
        refresh_expires_at: refreshTokenExpiresAt.toISOString(),
        client_name,
        token_id: tokenRecord.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[BVED API] Error generating token:", error);
    return formatError(error);
  }
}



