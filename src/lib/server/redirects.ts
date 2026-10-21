import {
	ROUTE_FUNKTIONEN,
	ROUTE_GERAETE,
	ROUTE_KONTAKT,
	ROUTE_MESSDIENSTANBIETER,
	ROUTE_MESSDIENSTWECHSEL,
	ROUTE_PREISE,
} from "$lib/routes";

export type Redirect = { to: string; status: 301 | 307 };

/**
 * Old URLs of the site and where they live now (site cutover). `/` is a
 * temporary redirect, so browsers don't cache it forever and it can become a
 * page again.
 */
export const REDIRECTS: Record<string, Redirect> = {
	"/": { to: ROUTE_MESSDIENSTANBIETER, status: 307 },
	[ROUTE_PREISE]: { to: `${ROUTE_MESSDIENSTWECHSEL}#start`, status: 301 },
	[ROUTE_GERAETE]: { to: ROUTE_FUNKTIONEN, status: 301 },
	[ROUTE_KONTAKT]: { to: `${ROUTE_MESSDIENSTWECHSEL}#start`, status: 301 },
};

/** The redirect for a path, ignoring one trailing slash; null if none. */
export function redirectFor(pathname: string): Redirect | null {
	const path =
		pathname.length > 1 && pathname.endsWith("/")
			? pathname.slice(0, -1)
			: pathname;
	return Object.hasOwn(REDIRECTS, path) ? REDIRECTS[path] : null;
}

/** `to` with the visitor's query string (`?…` or ""), before any `#fragment`. */
export function withQuery(to: string, search: string): string {
	if (!search) return to;
	const hash = to.indexOf("#");
	return hash === -1
		? `${to}${search}`
		: `${to.slice(0, hash)}${search}${to.slice(hash)}`;
}
