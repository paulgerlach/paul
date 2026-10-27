import { handleBillCheckDetails } from "$lib/server/billCheckDetails";
import type { RequestHandler } from "./$types";

/** "Gründe und Details ansehen" on /heizkostenabrechnung-pruefen (see `$lib/server/billCheckDetails`). */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		body = undefined;
	}
	await handleBillCheckDetails(body, getClientAddress());
	return new Response(null, { status: 204 });
};
