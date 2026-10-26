/**
 * Supabase Storage over its REST API (no client library): signed upload URLs
 * for the browser, signed download URLs for the server's pages, and deletes.
 * `SUPABASE_URL` is the project's API URL, `SUPABASE_SECRET_KEY` its secret
 * key (`sb_secret_…`, or the legacy `service_role` key); both are server-only.
 * The buckets themselves are created by Drizzle migrations.
 */
import { env } from "$env/dynamic/private";

function config() {
	const url = env.SUPABASE_URL;
	const key = env.SUPABASE_SECRET_KEY;
	if (!url || !key)
		throw new Error("SUPABASE_URL or SUPABASE_SECRET_KEY is not set");
	return { base: `${url.replace(/\/$/, "")}/storage/v1`, key };
}

async function call(path: string, init: RequestInit = {}) {
	const { base, key } = config();
	const res = await fetch(`${base}${path}`, {
		...init,
		headers: {
			apikey: key,
			authorization: `Bearer ${key}`,
			// Storage refuses a JSON content type without a body.
			...(init.body ? { "content-type": "application/json" } : {}),
			...init.headers,
		},
	});
	if (!res.ok)
		throw new Error(`Storage ${init.method ?? "GET"} ${path}: ${res.status}`);
	return res.json();
}

const encodePath = (path: string) =>
	path.split("/").map(encodeURIComponent).join("/");

/**
 * A URL the browser PUTs one file to (with its `content-type`), valid for two
 * hours and for this path only; it never overwrites an object.
 */
export async function signedUploadUrl(bucket: string, path: string) {
	const { url } = (await call(
		`/object/upload/sign/${bucket}/${encodePath(path)}`,
		{ method: "POST" },
	)) as { url: string };
	return `${config().base}${url}`;
}

/**
 * Download URLs for `paths`, valid for `expiresIn` seconds; a missing object
 * gets `null`.
 */
export async function signedUrls(
	bucket: string,
	paths: string[],
	expiresIn: number,
): Promise<Map<string, string | null>> {
	if (!paths.length) return new Map();
	const rows = (await call(`/object/sign/${bucket}`, {
		method: "POST",
		body: JSON.stringify({ expiresIn, paths }),
	})) as { path: string; signedURL: string | null }[];
	const { base } = config();
	return new Map(
		rows.map((r) => [r.path, r.signedURL ? `${base}${r.signedURL}` : null]),
	);
}

/** Deletes objects; missing ones are ignored. */
export async function removeObjects(bucket: string, paths: string[]) {
	if (!paths.length) return;
	await call(`/object/${bucket}`, {
		method: "DELETE",
		body: JSON.stringify({ prefixes: paths }),
	});
}
