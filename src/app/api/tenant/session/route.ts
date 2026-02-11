import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  verifySessionToken,
  TENANT_SESSION_COOKIE,
} from '@/lib/tenantAuth';

/**
 * GET /api/tenant/session
 * Check if tenant is authenticated
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(TENANT_SESSION_COOKIE);

    if (!sessionCookie?.value) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    const session = verifySessionToken(sessionCookie.value);

    if (!session) {
      // Invalid or expired session
      cookieStore.delete(TENANT_SESSION_COOKIE);
      return NextResponse.json({
        authenticated: false,
      });
    }

    return NextResponse.json({
      authenticated: true,
      tenant: {
        id: session.tenantId,
        email: session.email,
        contractorId: session.contractorId,
      },
    });

  } catch (error) {
    console.error('Tenant session error:', error);
    return NextResponse.json({
      authenticated: false,
    });
  }
}
