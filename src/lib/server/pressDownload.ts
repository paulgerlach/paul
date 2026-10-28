/**
 * A Media Kit download on /presse: the page posts the file's name when a
 * download link is clicked, and it goes to Make.com (`pressdownload`).
 * Nothing is stored here and nothing personal is sent or logged.
 *
 * Every request gets the same answer: the event is non-essential, so an
 * unknown file or a rate-limited click is dropped quietly.
 */
import { env } from "$env/dynamic/private";
import { kit } from "$lib/landing/pages/presse/content";
import { ROUTE_PRESSE } from "$lib/routes";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { sendWebhookEvent } from "$lib/server/webhooks";

const FILES = new Set<string>(kit.downloads.map((item) => item.file));

export async function handlePressDownload(body: unknown, ip: string) {
	const file =
		body && typeof body === "object" && "file" in body ? body.file : undefined;
	if (typeof file !== "string" || !FILES.has(file)) {
		console.log("[PRESSDOWNLOAD] Dropped: unknown file");
		return;
	}
	// The e2e server (KITCHEN_SINK=1) downloads more often from one IP than a
	// person would.
	const limit = env.KITCHEN_SINK ? 200 : 20;
	if (!checkIPRateLimit(`pressdl:${ip}`, limit, 600).allowed) {
		console.log("[PRESSDOWNLOAD] Dropped: rate limit");
		return;
	}
	// The non-throwing send: a lost download event isn't worth an error.
	await sendWebhookEvent("pressdownload", null, { file, page: ROUTE_PRESSE });
}
