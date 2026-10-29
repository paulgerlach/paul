import { handleEnergieausweisOrder } from "$lib/server/energieausweisOrder";
import type { RequestHandler } from "./$types";

/** "Jetzt bestellen" on /energieausweis (see `$lib/server/energieausweisOrder`). */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		body = undefined;
	}
	await handleEnergieausweisOrder(body, getClientAddress());
	return new Response(null, { status: 204 });
};
