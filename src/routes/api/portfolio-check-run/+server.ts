import { handlePortfolioCheckRun } from "$lib/server/portfolioCheckRun";
import type { RequestHandler } from "./$types";

/** "Unterlagen prüfen" on /portfolio-check (see `$lib/server/portfolioCheckRun`). */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		body = undefined;
	}
	await handlePortfolioCheckRun(body, getClientAddress());
	return new Response(null, { status: 204 });
};
