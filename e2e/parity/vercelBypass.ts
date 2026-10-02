import type { BrowserContext } from "@playwright/test";

/**
 * Lets a context into a Vercel preview behind Deployment Protection. The
 * bypass header is added only to requests for the preview's own origin, so
 * third-party origins (Prismic, fonts) never see it. It goes through the
 * browser's network stack, whose logs don't print request headers.
 *
 * Reads VERCEL_AUTOMATION_BYPASS_SECRET ("Protection Bypass for Automation" in
 * the Vercel project settings). Does nothing for other origins.
 */
export async function passVercelProtection(
	context: BrowserContext,
	origin: string,
) {
	const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
	const { origin: preview, hostname } = new URL(origin);
	if (!secret || !hostname.endsWith(".vercel.app")) return;
	await context.route(
		(url) => url.origin === preview,
		(route) =>
			route.continue({
				headers: {
					...route.request().headers(),
					"x-vercel-protection-bypass": secret,
				},
			}),
	);
}
