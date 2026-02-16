import { NextRequest, NextResponse } from 'next/server';
import {
  findTenantByResetToken,
  updateTenantPassword,
} from '@/lib/tenantAuth';

/**
 * POST /api/tenant/reset-password
 * Reset password using reset token
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

    // Find tenant by reset token
    const tenant = await findTenantByResetToken(token);

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'Ungültiger oder abgelaufener Link' },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    const success = await updateTenantPassword(
      tenant.id,
      password,
      false, // don't clear invite token
      true   // clear reset token
    );

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Zurücksetzen fehlgeschlagen' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Passwort erfolgreich geändert',
    });

  } catch (error) {
    console.error('Tenant reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
