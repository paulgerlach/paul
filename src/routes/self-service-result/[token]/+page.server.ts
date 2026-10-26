import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { SECRET } from "$lib/forms/selfServiceOffer";
import { getDb } from "$lib/server/db";
import { selfServiceResults } from "$lib/server/db/schema";
import { BUCKET } from "$lib/server/selfServiceOffer";
import { signedUrls } from "$lib/server/storage";
import type { PageServerLoad } from "./$types";

/** How long the page's file links work (s). */
const FILE_LINKS = 60 * 60;

/**
 * A Zählercheck's result for sales: only the link opens it (the token is 131
 * random bits), so it's outside `(base)` and its CDN cache, never stored by
 * a cache, never indexed, and sends no referrer (the file links carry their
 * own tokens).
 */
export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		"cache-control": "private, no-store",
		"x-robots-tag": "noindex, nofollow",
		"referrer-policy": "no-referrer",
	});
	if (!SECRET.test(params.token)) error(404);
	const [row] = await getDb()
		.select()
		.from(selfServiceResults)
		.where(eq(selfServiceResults.token, params.token));
	if (!row) error(404);

	const { files, sheet, stage } = row.data;
	const urls = await signedUrls(
		BUCKET,
		files.map((f) => f.path),
		FILE_LINKS,
	).catch((e) => {
		console.error("[SELF-SERVICE-RESULT] Signing files failed:", e);
		return new Map<string, string | null>();
	});
	return {
		seo: {
			title: `Zählercheck ${row.offer_number} | Heidi Systems`,
			noindex: true,
		},
		result: {
			offerNumber: row.offer_number,
			stage,
			createdAt: row.created_at,
			requestedAt: row.requested_at,
			sheet,
			files: files.map((f) => ({
				slot: f.slot,
				name: f.name,
				type: f.type,
				size: f.size,
				url: urls.get(f.path) ?? null,
			})),
		},
	};
};
