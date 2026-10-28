/**
 * The offer of /self-service's Zählercheck: `/api/self-service` receives the
 * wizard's state when the offer is made (`created`) and when the visitor asks
 * for it by email (`requested`). The first stores it (`self_service_results`:
 * the questions as asked with the answers, the raw state, the files) and
 * answers with the row's `ref` (its id and a key, which only that browser
 * holds); the second updates the row through it. Each send answers with
 * signed upload URLs for the files that have none yet; the browser PUTs them
 * to the bucket `self-service`, and files no longer chosen are deleted. Then
 * Make.com (`selfserviceoffer`) gets the result page's link
 * (/self-service-result/<token>) for sales, who send the offer PDF.
 *
 * Never log the name, email, phone, company or address. The log lines carry
 * the stage only.
 */
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { env } from "$env/dynamic/private";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
	selfServiceOfferSchema,
	type OfferFile,
	type OfferResponse,
	type SelfServiceRecord,
	type StoredFile,
} from "$lib/forms/selfServiceOffer";
import { validate } from "$lib/landing/pages/self-service/wizard/model";
import {
	sheet,
	sheetSlots,
} from "$lib/landing/pages/self-service/wizard/sheet";
import { ROUTE_SELF_SERVICE_RESULT } from "$lib/routes";
import { isGibberish, spamTrapReason } from "$lib/server/contact";
import { getDb } from "$lib/server/db";
import { selfServiceResults } from "$lib/server/db/schema";
import { checkIPRateLimit } from "$lib/server/rateLimit";
import { removeObjects, signedUploadUrl } from "$lib/server/storage";
import { sendWebhookEventOrThrow } from "$lib/server/webhooks";

export const BUCKET = "self-service";

/**
 * "sent", or "blocked" (answered like a success), "invalid", "failed". A
 * stored offer whose notification failed still answers with its `body`, so
 * the files upload and the retry updates the same row.
 */
export type OfferResult =
	| { status: "sent"; body: OfferResponse }
	| { status: "failed"; body?: OfferResponse }
	| { status: "blocked" | "invalid" };

const ALPHABET =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** 22 random characters of [A-Za-z0-9] (`SECRET`), without modulo bias. */
export function randomSecret(length = 22) {
	let out = "";
	while (out.length < length) {
		for (const b of crypto.getRandomValues(new Uint8Array(length * 2)))
			if (b < 248 && out.length < length) out += ALPHABET[b % 62];
	}
	return out;
}

const hash = (key: string) => createHash("sha256").update(key).digest("hex");

function sameHash(a: string, b: string) {
	const x = Buffer.from(a);
	const y = Buffer.from(b);
	return x.length === y.length && timingSafeEqual(x, y);
}

/** A stored file's path: under the row's id, a random name, the extension. */
function filePath(id: string, name: string) {
	const ext = /\.([A-Za-z0-9]{1,5})$/.exec(name)?.[1]?.toLowerCase();
	return `${id}/${randomUUID()}${ext ? `.${ext}` : ""}`;
}

const blocked = (reason: string): OfferResult => {
	console.log(`[SELF-SERVICE][SPAM] Blocked: ${reason}`);
	return { status: "blocked" };
};

export async function handleSelfServiceOffer(
	body: unknown,
	ip: string,
	origin: string,
	page: string,
): Promise<OfferResult> {
	const raw = (body ?? {}) as Record<string, unknown>;
	const trap = spamTrapReason({ _hp: raw.website, _t: raw._t });
	if (trap) return blocked(trap);

	const parsed = selfServiceOfferSchema.safeParse(body);
	if (!parsed.success) {
		console.log(
			"[SELF-SERVICE] Validation failed:",
			z.flattenError(parsed.error).fieldErrors,
		);
		return { status: "invalid" };
	}
	const { stage, state: s, ref, files } = parsed.data;
	// The wizard only makes an offer with a contact and an address.
	if (
		!s.ang ||
		validate("kontakt", s, () => 0) ||
		validate("adr", s, () => 0)
	) {
		console.log(`[SELF-SERVICE] Incomplete offer (${stage})`);
		return { status: "invalid" };
	}
	if (isGibberish(s.k.vn) || isGibberish(s.k.nn))
		return blocked(`gibberish detected (${stage})`);

	// Two sends per offer; the e2e server (KITCHEN_SINK=1) sends more.
	const limit = env.KITCHEN_SINK ? 100 : 10;
	if (!checkIPRateLimit(`self-service:${ip}`, limit, 600).allowed)
		return blocked(`rate limit exceeded for IP: ${ip}`);

	const asked = sheet(s);
	// Only files of drop zones the visitor still sees.
	const slots = sheetSlots(asked);
	const chosen = files
		.map((f, i) => ({ f, i }))
		.filter(({ f }) => slots.has(f.slot));

	const db = getDb();
	let res: OfferResponse;
	let token: string;
	try {
		let row = ref
			? (
					await db
						.select()
						.from(selfServiceResults)
						.where(eq(selfServiceResults.id, ref.id))
				)[0]
			: undefined;
		if (row && ref && !sameHash(row.edit_key_hash, hash(ref.key)))
			row = undefined;
		if (ref && !row) {
			console.log(`[SELF-SERVICE] Unknown ref (${stage})`);
			return { status: "invalid" };
		}

		const id = row?.id ?? randomUUID();
		const before = row?.data.files ?? [];
		const known = new Map(before.map((f) => [f.path, f]));
		const kept: StoredFile[] = [];
		const fresh: { i: number; file: StoredFile }[] = [];
		for (const { f, i } of chosen) {
			const old = f.path ? known.get(f.path) : undefined;
			if (old) kept.push(old);
			else
				fresh.push({
					i,
					file: { ...withoutPath(f), path: filePath(id, f.name) },
				});
		}
		const keptPaths = new Set(kept.map((f) => f.path));
		const gone = before
			.filter((f) => !keptPaths.has(f.path))
			.map((f) => f.path);

		const uploads = await Promise.all(
			fresh.map(async ({ i, file }) => ({
				i,
				path: file.path,
				url: await signedUploadUrl(BUCKET, file.path),
			})),
		);
		const data: SelfServiceRecord = {
			version: 1,
			stage,
			sheet: asked,
			state: s,
			files: [...kept, ...fresh.map((x) => x.file)],
		};
		const now = new Date().toISOString();
		let key: string | undefined;
		if (row) {
			token = row.token;
			await db
				.update(selfServiceResults)
				.set({
					offer_number: s.ang.nr,
					data,
					updated_at: now,
					...(stage === "requested" ? { requested_at: now } : {}),
				})
				.where(eq(selfServiceResults.id, id));
		} else {
			token = randomSecret();
			key = randomSecret();
			await db.insert(selfServiceResults).values({
				id,
				token,
				edit_key_hash: hash(key),
				offer_number: s.ang.nr,
				data,
				requested_at: stage === "requested" ? now : null,
			});
		}
		if (gone.length)
			await removeObjects(BUCKET, gone).catch((error) =>
				console.error("[SELF-SERVICE] Deleting files failed:", error),
			);
		res = { success: true, ref: key ? { id, key } : undefined, uploads };
	} catch (error) {
		console.error(`[SELF-SERVICE] Saving failed (${stage}):`, error);
		return { status: "failed" };
	}

	try {
		await sendWebhookEventOrThrow("selfserviceoffer", s.k.mail.trim(), {
			stage,
			offer_number: s.ang.nr,
			first_name: s.k.vn.trim(),
			last_name: s.k.nn.trim(),
			result_url: `${origin}${ROUTE_SELF_SERVICE_RESULT}/${token}`,
			page,
		});
	} catch (error) {
		console.error(`[SELF-SERVICE] Sending failed (${stage}):`, error);
		return { status: "failed", body: res };
	}
	console.log(`[SELF-SERVICE] Sent (${stage})`);
	return { status: "sent", body: res };
}

function withoutPath(f: OfferFile): Omit<StoredFile, "path"> {
	return { slot: f.slot, name: f.name, type: f.type, size: f.size };
}
