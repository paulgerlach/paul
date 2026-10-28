import { handlePressDownload } from "$lib/server/pressDownload";
import type { RequestHandler } from "./$types";

/** A Media Kit download on /presse (see `$lib/server/pressDownload`). */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		body = undefined;
	}
	await handlePressDownload(body, getClientAddress());
	return new Response(null, { status: 204 });
};
