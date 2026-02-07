/**
 * Webhook utilities for Make.com integrations
 * Sends events to Denis's Make.com workflows
 */

const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/rfagboxirpwkbck0wkax3qh9nqum12g1';

type EventType = 'login' | 'registration' | 'newsletter' | 'pwrecovery' | 'newinquiry' | 'contactform' | 'invitation';

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
    const payload: WebhookPayload = {
      event_type: eventType,
      email,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    console.log(`[WEBHOOK] Sending ${eventType} event for ${email}`);

    const response = await fetch(MAKE_WEBHOOK_URL, {
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
 */
export async function sendPasswordRecoveryEvent(email: string): Promise<void> {
  await sendWebhookEvent('pwrecovery', email);
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


