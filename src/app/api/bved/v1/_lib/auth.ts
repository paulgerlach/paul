import { NextResponse } from "next/server";

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
 * Simple static token check (env-based).
 *
 * Headers:
 * - Authorization: Bearer <token>
 * - X-API-Key: <token>
 */
export async function requireExternalAuth(request: Request) {
  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");

  const providedToken =
    apiKeyHeader ||
    (authHeader?.startsWith("Bearer ")
      ? authHeader.replace(/^Bearer\s+/i, "")
      : null);

  // Env-based static tokens
  const bearerEnv = process.env.BVED_EXTERNAL_BEARER_TOKEN;
  const apiKeyEnv = process.env.BVED_EXTERNAL_API_KEY;
  const allowedTokens = [bearerEnv, apiKeyEnv].filter(Boolean);

  if (!providedToken || !allowedTokens.includes(providedToken)) {
    throw new ExternalAuthError("Invalid authentication token", 401, "UNAUTHORIZED");
  }
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


