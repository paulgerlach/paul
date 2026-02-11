import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TENANT_SESSION_COOKIE } from '@/lib/tenantAuth';

/**
 * POST /api/tenant/logout
 * Clear tenant session
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(TENANT_SESSION_COOKIE);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tenant logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
