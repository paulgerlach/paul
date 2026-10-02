import { json } from "@sveltejs/kit";
import { sendNewsletterEvent } from "$lib/server/webhooks";
import type { RequestHandler } from "./$types";

/** Newsletter signup (footer and blog `Subscription` forms). */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const { email } = await request.json();

	try {
		// KI-15: Next never passed the IP
		await sendNewsletterEvent(email, getClientAddress());
		console.log(`[NEWSLETTER] Sent newsletter signup event for ${email}`);

		return json({ success: true });
	} catch (error) {
		console.error("[NEWSLETTER] Error sending webhook:", error);
		return json({ error: "Server error" }, { status: 500 });
	}
};
