/**
 * Webhook utilities for Make.com integrations
 * Sends events to Denis's Make.com workflows
 *
 * Two separate webhooks per Denis's Make.com architecture:
 * - UNIFIED: login, registration, newsletter, pwrecovery, newinquiry, contactform
 * - LEAK DETECTION: leakdetected only
 */

const MAKE_WEBHOOK_UNIFIED = process.env.MAKE_WEBHOOK_UNIFIED;
const MAKE_WEBHOOK_LEAK = process.env.MAKE_WEBHOOK_LEAK_DETECTION;
const MAKE_WEBHOOK_TENANT_INVITE = process.env.MAKE_WEBHOOK_TENANT_INVITE;
const MAKE_WEBHOOK_PASSWORD_RESET = process.env.MAKE_WEBHOOK_PASSWORD_RESET;

type EventType = 'login' | 'registration' | 'newsletter' | 'pwrecovery' | 'newinquiry' | 'contactform' | 'leakdetected' | 'invitation';

interface WebhookPayload {
  event_type: EventType;
  email: string;
  timestamp?: string;
  ip_address?: string;
  [key: string]: any; // Additional data for complex events
}

export interface InvitationData {
  inviter_name: string;
  agency_name?: string;
  role: string;
  invitation_token: string;
  expires_at: string;
  invite_url: string; // Constructed frontend URL
}
/**
 * Route event to the correct Make.com webhook URL
 */
function getWebhookUrl(eventType: EventType): string | undefined {
  if (eventType === 'leakdetected') return MAKE_WEBHOOK_LEAK;
  return MAKE_WEBHOOK_UNIFIED;
}

/**
 * Send event to Make.com webhook
 * @param eventType - Type of event
 * @param email - User email
 * @param additionalData - Any additional data for the event
 */
export async function sendWebhookEvent(
  eventType: EventType,
  email: string,
  additionalData?: Record<string, any>
): Promise<void> {
  try {
    const webhookUrl = getWebhookUrl(eventType);

    if (!webhookUrl) {
      const envVar = eventType === 'leakdetected' ? 'MAKE_WEBHOOK_LEAK_DETECTION' : 'MAKE_WEBHOOK_UNIFIED';
      console.warn(`[WEBHOOK] ${envVar} environment variable is not set. Skipping ${eventType} webhook.`);
      return;
    }

    const payload: WebhookPayload = {
      event_type: eventType,
      email,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    console.log(`[WEBHOOK] Sending ${eventType} event for ${email}`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[WEBHOOK] Failed to send ${eventType} event:`, response.statusText);
    } else {
      console.log(`[WEBHOOK] Successfully sent ${eventType} event`);
    }
  } catch (error) {
    console.error(`[WEBHOOK] Error sending ${eventType} event:`, error);
    // Don't throw - webhook failures shouldn't break user flow
  }
}

/**
 * Send login event
 */
export async function sendLoginEvent(email: string): Promise<void> {
  await sendWebhookEvent('login', email);
}

/**
 * Send registration event
 */
export async function sendRegistrationEvent(email: string): Promise<void> {
  await sendWebhookEvent('registration', email);
}

/**
 * Send newsletter signup event
 */
export async function sendNewsletterEvent(email: string, ipAddress?: string): Promise<void> {
  await sendWebhookEvent('newsletter', email, { ip_address: ipAddress });
}

/**
 * Send password recovery event
 * @param email - User email
 * @param resetUrl - Optional reset URL for tenant password reset
 */
export async function sendPasswordRecoveryEvent(email: string, resetUrl?: string): Promise<void> {
  await sendWebhookEvent('pwrecovery', email, resetUrl ? { reset_url: resetUrl } : undefined);
}

/**
 * Send offer inquiry event (with full questionnaire data)
 */
export async function sendOfferInquiryEvent(
  email: string,
  questionnaireData: Record<string, any>
): Promise<void> {
  await sendWebhookEvent('newinquiry', email, questionnaireData);
}

export async function sendInvitationEvent(
  email: string,
  invitationData: InvitationData
): Promise<void> {
  await sendWebhookEvent('invitation', email, {
    inviter_name: invitationData.inviter_name,
    agency_name: invitationData.agency_name,
    role: invitationData.role,
    invitation_token: invitationData.invitation_token,
    expires_at: invitationData.expires_at,
    invite_url: `${process.env.NEXT_PUBLIC_APP_URL}/invitation/accept?token=${invitationData.invitation_token}`
  });
}


/**
 * Send leak detected event
 * Triggered when CSV processing detects error flags indicating leaks or pipe breakage
 */
export async function sendLeakDetectedEvent(
  email: string,
  deviceId: string,
  deviceType: string,
  errorDescription: string,
  propertyAddress?: string,
  apartmentInfo?: string
): Promise<void> {
  // Validate required fields to prevent empty notifications
  if (!email || !deviceId || !errorDescription) {
    console.warn('[WEBHOOK] Skipping leakdetected event - missing required fields:', { email: !!email, deviceId: !!deviceId, errorDescription: !!errorDescription });
    return;
  }

  await sendWebhookEvent('leakdetected', email, {
    device_id: deviceId,
    device_type: deviceType,
    error_description: errorDescription,
    property_address: propertyAddress,
    apartment_info: apartmentInfo,
    severity: 'critical'
  });
}

// ============================================
// TENANT LOGIN SYSTEM WEBHOOKS
// ============================================

/**
 * Send tenant invite email via Make.com
 * Triggered when landlord invites a tenant to access the dashboard
 * 
 * @param tenantMail - Tenant's email address
 * @param tenantName - Tenant's full name
 * @param setupURL - URL for tenant to set up their password
 */
export async function sendTenantInviteEmail(
  tenantMail: string,
  tenantName: string,
  setupURL: string
): Promise<void> {
  if (!MAKE_WEBHOOK_TENANT_INVITE) {
    console.warn('[WEBHOOK] MAKE_WEBHOOK_TENANT_INVITE not set. Skipping tenant invite email.');
    return;
  }

  try {
    console.log(`[WEBHOOK] Sending tenant invite email to ${tenantMail}`);

    const response = await fetch(MAKE_WEBHOOK_TENANT_INVITE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantMail,
        tenantName,
        setupURL,
      }),
    });

    if (!response.ok) {
      console.error('[WEBHOOK] Failed to send tenant invite email:', response.statusText);
    } else {
      console.log('[WEBHOOK] Successfully sent tenant invite email');
    }
  } catch (error) {
    console.error('[WEBHOOK] Error sending tenant invite email:', error);
    // Don't throw - webhook failures shouldn't break user flow
  }
}

/**
 * Send tenant password reset email via Make.com
 * Triggered when tenant requests a password reset
 * 
 * @param tenantMail - Tenant's email address
 * @param resetURL - URL for tenant to reset their password
 */
export async function sendTenantPasswordResetEmail(
  tenantMail: string,
  resetURL: string
): Promise<void> {
  if (!MAKE_WEBHOOK_PASSWORD_RESET) {
    console.warn('[WEBHOOK] MAKE_WEBHOOK_PASSWORD_RESET not set. Skipping password reset email.');
    return;
  }

  try {
    console.log(`[WEBHOOK] Sending tenant password reset email to ${tenantMail}`);

    const response = await fetch(MAKE_WEBHOOK_PASSWORD_RESET, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantMail,
        resetURL,
      }),
    });

    if (!response.ok) {
      console.error('[WEBHOOK] Failed to send tenant password reset email:', response.statusText);
    } else {
      console.log('[WEBHOOK] Successfully sent tenant password reset email');
    }
  } catch (error) {
    console.error('[WEBHOOK] Error sending tenant password reset email:', error);
    // Don't throw - webhook failures shouldn't break user flow
  }
}
