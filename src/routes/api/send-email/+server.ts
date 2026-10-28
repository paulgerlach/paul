import { json, redirect } from "@sveltejs/kit";
import { newsletterEmailSchema } from "$lib/forms/newsletter";
import { sendNewsletterEvent } from "$lib/server/webhooks";
import type { RequestHandler } from "./$types";

/**
 * Newsletter signup. The site footer and blog `Subscription` forms post JSON;
 * the landing footer's form also works without JS, as a plain form post that
 * is redirected back to the page it came from.
 */
export const POST: RequestHandler = async ({
	request,
	url,
	getClientAddress,
}) => {
	const isForm = !request.headers
		.get("content-type")
		?.includes("application/json");
	const email = isForm
		? (await request.formData()).get("email")
		: (await request.json()).email;

	const parsed = newsletterEmailSchema.safeParse(email);
	if (!parsed.success) {
		if (isForm) redirect(303, backTo(request, url));
		return json({ error: "Invalid email" }, { status: 400 });
	}

	try {
		// KI-15: Next never passed the IP
		await sendNewsletterEvent(parsed.data, getClientAddress());
		console.log(`[NEWSLETTER] Sent newsletter signup event for ${parsed.data}`);
	} catch (error) {
		console.error("[NEWSLETTER] Error sending webhook:", error);
		if (!isForm) return json({ error: "Server error" }, { status: 500 });
	}
	if (isForm) redirect(303, backTo(request, url));
	return json({ success: true });
};

/** The same-origin page the form was posted from, else the home page. */
function backTo(request: Request, url: URL): string {
	const referer = request.headers.get("referer");
	if (!referer) return "/";
	const from = new URL(referer, url);
	return from.origin === url.origin ? from.pathname + from.search : "/";
}
