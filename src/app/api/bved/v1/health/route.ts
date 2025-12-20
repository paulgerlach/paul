import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import database from "@/db";
import { requireExternalAuth, formatError } from "../_lib/auth";

/**
 * BVED API: GET /api/bved/v1/health
 * Outbound health check with external auth and DB ping.
 */
export async function GET(request: Request) {
  try {
    requireExternalAuth(request);

    await database.execute(sql`SELECT 1`);

    return NextResponse.json({
      status: "healthy",
      version: "v1",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return formatError(error);
  }
}








