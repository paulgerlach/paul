import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  findTenantByInviteToken,
  updateTenantPassword,
  createSessionToken,
  updateLastLogin,
  TENANT_SESSION_COOKIE,
  getSessionCookieOptions,
} from '@/lib/tenantAuth';

/**
 * POST /api/tenant/setup
 * First-time password setup using invite token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token und Passwort erforderlich' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Passwort muss mindestens 8 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // Find tenant by invite token
    const tenant = await findTenantByInviteToken(token);

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'Ungültiger oder abgelaufener Link' },
        { status: 400 }
      );
    }

    // Update password and clear invite token
    const success = await updateTenantPassword(
      tenant.id,
      password,
      true, // clear invite token
      false // don't clear reset token
    );

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Einrichtung fehlgeschlagen' },
        { status: 500 }
      );
    }

    // Auto-login: Create session token
    const sessionToken = createSessionToken({
      id: tenant.id,
      email: tenant.email,
      contractor_id: tenant.contractor_id,
    });

    // Update last login timestamp
    await updateLastLogin(tenant.id);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(TENANT_SESSION_COOKIE, sessionToken, getSessionCookieOptions());

    return NextResponse.json({
      success: true,
      message: 'Passwort erfolgreich eingerichtet',
      autoLogin: true,
    });

  } catch (error) {
    console.error('Tenant setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
