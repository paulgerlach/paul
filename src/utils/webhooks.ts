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

type EventType = 'login' | 'registration' | 'newsletter' | 'pwrecovery' | 'newinquiry' | 'contactform' | 'leakdetected';

interface WebhookPayload {
  event_type: EventType;
  email: string;
  timestamp?: string;
  ip_address?: string;
  [key: string]: any; // Additional data for complex events
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
