import { json } from "@sveltejs/kit";
import { runContactPipeline } from "$lib/server/contact";
import type { RequestHandler } from "./$types";

// Kept until cutover in case anything external posts here; /kontakt uses a
// form action from phase 7 on.
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		const body = await request.json();
		const isObject = typeof body === "object" && body !== null;
		const result = isObject
			? await runContactPipeline(body, getClientAddress())
			: "invalid";

		if (result === "invalid") {
			return json(
				{ error: "Ungültige Eingabe. Bitte überprüfen Sie Ihre Angaben." },
				{ status: 400 },
			);
		}
		// `blocked` answers like `sent`, so bots can't tell what triggered it
		return json({ success: true });
	} catch (error) {
		console.error("[CONTACT] Error sending webhook:", error);
		return json(
			{ error: "Serverfehler. Bitte erneut versuchen." },
			{ status: 500 },
		);
	}
};
