/**
 * Webhook utilities for Make.com integrations
 * Sends events to Denis's Make.com workflows
 *
 * UNIFIED webhook: newsletter, newinquiry, contactform, switchinquiry,
 * jobapplication, helpfeedback, partnerinquiry, softwarepartnerinquiry,
 * successioninquiry, partnershipinquiry, connectioninquiry, selfserviceoffer
 */
import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";

type EventType =
	| "newsletter"
	| "newinquiry"
	| "contactform"
	// Signup on a landing page (/messdienstwechsel, /messdienstanbieter and
	// its city pages). Payload: placement, page, and `city` (slug) on city pages.
	| "switchinquiry"
	// Application on /karriere. Payload: role, role_title, name, link, message,
	// page. Make.com forwards it to the hiring inbox; nothing is stored here.
	| "jobapplication"
	// "War das hilfreich?" vote on /hilfe. Payload: question (id), vote
	// ("yes" | "no"), page. No email, nothing personal; Make.com writes it to
	// the content owner's sheet.
	| "helpfeedback"
	// Partner form on /installationspartner. Payload: company, name, phone,
	// region, crew, trades (array), experience, message, page. Make.com
	// forwards it to whoever answers partner inquiries; nothing is stored here.
	| "partnerinquiry"
	// Contact form on /kontakt. Payload: topic, mailbox ("vertrieb" | "info" |
	// "presse", from the topic), first_name, last_name, phone, company, units,
	// message, page. Make.com forwards it to that mailbox's team; nothing is
	// stored here.
	| "contactinquiry"
	// Partner form on /softwarepartner. Payload: company, name, phone,
	// product, customers, kinds (array), message, page. Make.com forwards it
	// to whoever answers software partners; nothing is stored here.
	| "softwarepartnerinquiry"
	// Contact form on /nachfolge (owners of metering businesses looking for a
	// successor). Payload: company, name, phone, properties, timeframe,
	// message, page. Make.com forwards it, confidentially, to whoever answers
	// succession inquiries; nothing is stored here.
	| "successioninquiry"
	// Contact form on /partnerschaften ("Partnerschaft anfragen"). Payload:
	// company, name, phone, kind (of partnership), message, page. Make.com
	// forwards it to whoever triages partnership inquiries; nothing is stored
	// here.
	| "partnershipinquiry"
	// The form "Anbindung anfragen" in /partnerschaften's software vendor
	// card. Payload: company, name, software, message, page. Make.com
	// forwards it to whoever answers software vendors; nothing is stored here.
	| "connectioninquiry"
	// The Zählercheck on /self-service: the offer once made (stage
	// "created") and when requested by email ("requested"). Payload: stage,
	// offer_number, object_id, valid_until, first_name, last_name, company,
	// phone, property, billing, units, once_net, yearly_net, files (count,
	// the files stay in the browser), text (the design's Slack summary),
	// page. Make.com forwards it to sales, who send the offer PDF; nothing
	// is stored here.
	| "selfserviceoffer";

interface WebhookPayload {
	event_type: EventType;
	email?: string;
	timestamp?: string;
	ip_address?: string;
	[key: string]: unknown; // Additional data for complex events
}

/**
 * Send event to Make.com webhook
 * @param eventType - Type of event
 * @param email - User email (`null` for events without a person, which
 *   leave the field out)
 * @param additionalData - Any additional data for the event
 */
export async function sendWebhookEvent(
	eventType: EventType,
	email: string | null,
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
			...(email !== null && { email }),
			timestamp: new Date().toISOString(),
			...additionalData,
		};

		console.log(
			email === null
				? `[WEBHOOK] Sending ${eventType} event`
				: `[WEBHOOK] Sending ${eventType} event for ${email}`,
		);

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
 * Like `sendWebhookEvent`, but for events that exist nowhere else (job
 * applications): it throws when the event can't be delivered, so the caller
 * can tell the visitor. A missing URL only throws in production; in dev it
 * skips, so the page works without Make.com.
 *
 * It logs nothing about the person; the caller logs what it needs.
 */
export async function sendWebhookEventOrThrow(
	eventType: EventType,
	email: string,
	additionalData?: Record<string, unknown>,
): Promise<void> {
	const webhookUrl = env.MAKE_WEBHOOK_UNIFIED;
	if (!webhookUrl) {
		if (!dev) throw new Error("MAKE_WEBHOOK_UNIFIED is not set");
		console.warn(
			`[WEBHOOK] MAKE_WEBHOOK_UNIFIED is not set. Skipping ${eventType} webhook.`,
		);
		return;
	}

	const payload: WebhookPayload = {
		event_type: eventType,
		email,
		timestamp: new Date().toISOString(),
		...additionalData,
	};
	const response = await fetch(webhookUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	if (!response.ok)
		throw new Error(
			`${eventType} webhook answered ${response.status} ${response.statusText}`,
		);
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
