import { handleKuendigungAction } from "$lib/server/kuendigungAction";
import type { RequestHandler } from "./$types";

/** A download or copy on /messdienst-wechseln/muster-kuendigung (see `$lib/server/kuendigungAction`). */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		body = undefined;
	}
	await handleKuendigungAction(body, getClientAddress());
	return new Response(null, { status: 204 });
};
