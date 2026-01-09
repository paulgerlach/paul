import { NextRequest, NextResponse } from "next/server";
import database from "@/db";
import { bved_api_tokens } from "@/db/drizzle/schema";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { formatError } from "../../_lib/auth";
import { eq, and } from "drizzle-orm";

/**
 * BVED API: POST /api/bved/v1/auth/revoke
 * 
 * Revoke a token by setting revoked = true.
 * Requires authenticated user (must own the token or be admin).
 * 
 * Request body:
 * {
 *   "token_id": "uuid-of-token-to-revoke"
 * }
 * 
 * Alternative: Can revoke by access_token (for self-revocation)
 * {
 *   "access_token": "bved_..."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Require authenticated user
    const user = await getAuthenticatedServerUser();

    const body = await request.json().catch(() => ({}));
    const { token_id, access_token } = body;

    if (!token_id && !access_token) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Either token_id or access_token is required" } },
        { status: 400 }
      );
    }

    // Find token record
    let tokenRecord;
    if (token_id) {
      // Revoke by token_id
      const records = await database
        .select()
        .from(bved_api_tokens)
        .where(eq(bved_api_tokens.id, token_id))
        .limit(1);

      if (records.length === 0) {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Token not found" } },
          { status: 404 }
        );
      }

      tokenRecord = records[0];
    } else if (access_token) {
      // Revoke by access_token (self-revocation)
      // Import token utilities
      const { extractTokenPrefix, verifyToken } = await import("../../_lib/token-hash");
      
      const tokenPrefix = extractTokenPrefix(access_token);
      const records = await database
        .select()
        .from(bved_api_tokens)
        .where(
          and(
            eq(bved_api_tokens.access_token_prefix, tokenPrefix),
            eq(bved_api_tokens.revoked, false)
          )
        )
        .limit(10);

      // Verify token against all matching records
      let found = false;
      for (const record of records) {
        if (verifyToken(access_token, record.access_token_hash)) {
          tokenRecord = record;
          found = true;
          break;
        }
      }

      if (!found) {
        return NextResponse.json(
          { error: { code: "INVALID_TOKEN", message: "Invalid or already revoked token" } },
          { status: 401 }
        );
      }
    }

    if (!tokenRecord) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Token not found" } },
        { status: 404 }
      );
    }

    // Check authorization: user must own the token or be admin
    // Note: is_admin() check would need to be implemented based on your auth system
    // For now, we check user_id match
    if (tokenRecord.user_id !== user.id) {
      // Check if user is admin (you may need to implement this check)
      // const isAdmin = await checkIsAdmin(user.id);
      // if (!isAdmin) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "You can only revoke your own tokens" } },
        { status: 403 }
      );
      // }
    }

    // Revoke the token
    await database
      .update(bved_api_tokens)
      .set({ revoked: true })
      .where(eq(bved_api_tokens.id, tokenRecord.id));

    return NextResponse.json(
      {
        success: true,
        message: "Token revoked successfully",
        token_id: tokenRecord.id,
        revoked_at: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[BVED API] Error revoking token:", error);
    return formatError(error);
  }
}
