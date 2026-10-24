import { json } from "@sveltejs/kit";
import { ROUTE_SELF_SERVICE } from "$lib/routes";
import { handleSelfServiceOffer } from "$lib/server/selfServiceOffer";
import type { RequestHandler } from "./$types";

/** The Zählercheck's offer on /self-service (see `$lib/server/selfServiceOffer`). */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: "Ungültige Anfrage." }, { status: 400 });
	}
	const result = await handleSelfServiceOffer(
		body,
		getClientAddress(),
		ROUTE_SELF_SERVICE,
	);
	if (result === "invalid")
		return json({ error: "Ungültige Angaben." }, { status: 400 });
	if (result === "failed")
		return json({ error: "Senden fehlgeschlagen." }, { status: 502 });
	return json({ success: true });
};
