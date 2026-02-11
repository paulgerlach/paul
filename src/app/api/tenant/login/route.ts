import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  findTenantByEmail,
  findTenantByEmailIncludeDisabled,
  verifyPassword,
  createSessionToken,
  updateLastLogin,
  TENANT_SESSION_COOKIE,
  getSessionCookieOptions,
} from '@/lib/tenantAuth';

/**
 * POST /api/tenant/login
 * Authenticate tenant with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'E-Mail und Passwort erforderlich' },
        { status: 400 }
      );
    }

    // Find tenant by email (including disabled to show proper message)
    const tenantAny = await findTenantByEmailIncludeDisabled(email);
    
    if (!tenantAny) {
      // Generic error to not reveal if email exists
      return NextResponse.json(
        { success: false, error: 'E-Mail oder Passwort ungültig' },
        { status: 401 }
      );
    }

    // Check if account is disabled
    if (!tenantAny.enabled) {
      return NextResponse.json(
        { success: false, error: 'Konto deaktiviert. Bitte kontaktieren Sie Ihren Vermieter.' },
        { status: 403 }
      );
    }

    const tenant = tenantAny;

    // Check if tenant has set up their password
    if (!tenant.password_hash) {
      return NextResponse.json(
        { success: false, error: 'Bitte richten Sie zuerst Ihr Passwort ein' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, tenant.password_hash);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'E-Mail oder Passwort ungültig' },
        { status: 401 }
      );
    }

    // Create session token
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
      tenant: {
        id: tenant.id,
        email: tenant.email,
      },
    });

  } catch (error) {
    console.error('Tenant login error:', error);
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
