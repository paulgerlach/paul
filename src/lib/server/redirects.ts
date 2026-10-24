export type Redirect = { to: string; status: 301 | 307 };

/**
 * Old URLs of the site and where they live now. Empty since every old URL is
 * a page again (/preise, /geraete and /datenschutzhinweise, 2026-10-23); a
 * URL that moves gets its entry here.
 */
export const REDIRECTS: Record<string, Redirect> = {};

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
