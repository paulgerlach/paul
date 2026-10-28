import { json } from "@sveltejs/kit";
import { ROUTE_SELF_SERVICE } from "$lib/routes";
import { handleSelfServiceOffer } from "$lib/server/selfServiceOffer";
import type { RequestHandler } from "./$types";

/** The Zählercheck's offer on /self-service (see `$lib/server/selfServiceOffer`). */
export const POST: RequestHandler = async ({
	request,
	getClientAddress,
	url,
}) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: "Ungültige Anfrage." }, { status: 400 });
	}
	const result = await handleSelfServiceOffer(
		body,
		getClientAddress(),
		url.origin,
		ROUTE_SELF_SERVICE,
	);
	if (result.status === "invalid")
		return json({ error: "Ungültige Angaben." }, { status: 400 });
	if (result.status === "failed")
		return json(
			{ error: "Senden fehlgeschlagen.", ...result.body, success: false },
			{ status: 502 },
		);
	if (result.status === "sent") return json(result.body);
	return json({ success: true });
};
