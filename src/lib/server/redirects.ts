import {
	ROUTE_DATENSCHUTZ,
	ROUTE_DATENSCHUTZHINWEISE,
	ROUTE_FUNKZAEHLER,
	ROUTE_GERAETE,
	ROUTE_MESSDIENSTWECHSEL,
	ROUTE_PREISE,
} from "$lib/routes";

export type Redirect = { to: string; status: 301 | 307 };

/** Old URLs of the site and where they live now (site cutover, new URLs). */
export const REDIRECTS: Record<string, Redirect> = {
	[ROUTE_PREISE]: { to: `${ROUTE_MESSDIENSTWECHSEL}#start`, status: 301 },
	[ROUTE_GERAETE]: { to: ROUTE_FUNKZAEHLER, status: 301 },
	[ROUTE_DATENSCHUTZHINWEISE]: { to: ROUTE_DATENSCHUTZ, status: 301 },
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
