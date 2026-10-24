import type { Handle, HandleServerError } from "@sveltejs/kit";
import { redirectFor, withQuery } from "$lib/server/redirects";

// The old URLs redirect before routing: their routes are gone. A Response
// rather than redirect(), so the CDN may cache it like the sitemap.
export const handle: Handle = ({ event, resolve }) => {
	const { method } = event.request;
	const hit =
		method === "GET" || method === "HEAD"
			? redirectFor(event.url.pathname)
			: null;
	if (!hit) return resolve(event);
	return new Response(null, {
		status: hit.status,
		headers: {
			location: withQuery(hit.to, event.url.search),
			"cache-control": "s-maxage=3600, stale-while-revalidate=86400",
		},
	});
};

export const handleError: HandleServerError = ({ error, event, status }) => {
	if (status !== 404) {
		console.error(`[${event.request.method} ${event.url.pathname}]`, error);
	}
};
