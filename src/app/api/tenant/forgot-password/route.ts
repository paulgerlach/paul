import { NextRequest, NextResponse } from 'next/server';
import {
  findTenantByEmail,
  setResetToken,
} from '@/lib/tenantAuth';
import { sendTenantPasswordResetEmail } from '@/utils/webhooks';

/**
 * POST /api/tenant/forgot-password
 * Request password reset email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'E-Mail-Adresse erforderlich' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Find tenant by email
    const tenant = await findTenantByEmail(email);

    // If tenant exists, generate reset token and send email
    if (tenant) {
      const resetToken = await setResetToken(tenant.id);

      if (resetToken) {
        // Build reset URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://heidi-systems.de';
        const resetUrl = `${baseUrl}/mieter/reset?token=${resetToken}`;

        // Send email via Make.com webhook
        try {
          await sendTenantPasswordResetEmail(tenant.email, resetUrl);
        } catch (emailError) {
          console.error('Failed to send reset email:', emailError);
          // Don't expose email sending failures to user
        }
      }
    }

    // Always return success (security: don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'Falls ein Konto existiert, wurde eine E-Mail gesendet',
    });

  } catch (error) {
    console.error('Tenant forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
