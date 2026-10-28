import { handleSelfServiceStart } from "$lib/server/selfServiceStart";
import type { RequestHandler } from "./$types";

/** The Zählercheck's first "Weiter" on /self-service (see `$lib/server/selfServiceStart`). */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		body = undefined;
	}
	await handleSelfServiceStart(body, getClientAddress());
	return new Response(null, { status: 204 });
};
