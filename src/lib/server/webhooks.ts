/**
 * Webhook utilities for Make.com integrations
 * Sends events to Denis's Make.com workflows
 *
 * UNIFIED webhook: newsletter, newinquiry, contactform, switchinquiry
 */
import { env } from "$env/dynamic/private";

type EventType =
	| "newsletter"
	| "newinquiry"
	| "contactform"
	// Signup on a landing page (/messdienstwechsel, /messdienstanbieter and
	// its city pages). Payload: placement, page, and `city` (slug) on city pages.
	| "switchinquiry";

interface WebhookPayload {
	event_type: EventType;
	email: string;
	timestamp?: string;
	ip_address?: string;
	[key: string]: unknown; // Additional data for complex events
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
	additionalData?: Record<string, unknown>,
): Promise<void> {
	try {
		// Read per call, not at module load, so the build doesn't need it
		const webhookUrl = env.MAKE_WEBHOOK_UNIFIED;

		if (!webhookUrl) {
			console.warn(
				`[WEBHOOK] MAKE_WEBHOOK_UNIFIED environment variable is not set. Skipping ${eventType} webhook.`,
			);
			return;
		}

		const payload: WebhookPayload = {
			event_type: eventType,
			email,
			timestamp: new Date().toISOString(),
			...additionalData,
		};

		console.log(`[WEBHOOK] Sending ${eventType} event for ${email}`);

		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			console.error(
				`[WEBHOOK] Failed to send ${eventType} event:`,
				response.statusText,
			);
		} else {
			console.log(`[WEBHOOK] Successfully sent ${eventType} event`);
		}
	} catch (error) {
		console.error(`[WEBHOOK] Error sending ${eventType} event:`, error);
		// Don't throw - webhook failures shouldn't break user flow
	}
}

/**
 * Send newsletter signup event
 */
export async function sendNewsletterEvent(
	email: string,
	ipAddress?: string,
): Promise<void> {
	await sendWebhookEvent("newsletter", email, { ip_address: ipAddress });
}

/**
 * Send offer inquiry event (with full questionnaire data)
 */
export async function sendOfferInquiryEvent(
	email: string,
	questionnaireData: Record<string, unknown>,
): Promise<void> {
	await sendWebhookEvent("newinquiry", email, questionnaireData);
}
