import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import database from "@/db";
import { requireExternalAuth, formatError, createResponse } from "../_lib/auth";

/**
 * BVED API: GET /api/bved/v1/health
 * Outbound health check with external auth and DB ping.
 */
export async function GET(request: Request) {
  try {
    const authResult = await requireExternalAuth(request);
    const { tokenRateLimit, ipRateLimit } = authResult;

    await database.execute(sql`SELECT 1`);

    return createResponse(
      {
        status: "healthy",
        version: "v1",
        timestamp: new Date().toISOString(),
      },
      200,
      tokenRateLimit,
      ipRateLimit
    );
  } catch (error) {
    // Try to get auth result for rate limit headers even on error
    let authResult;
    try {
      authResult = await requireExternalAuth(request);
    } catch {
      // Ignore auth errors, just return error without rate limit headers
    }
    return formatError(error, authResult);
  }
}
