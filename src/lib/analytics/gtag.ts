// Google Analytics 4 (gtag.js). The measurement id comes from
// PUBLIC_GA_MEASUREMENT_ID; without it (dev, e2e) nothing loads.
// Page views are sent by hand from the root layout's afterNavigate, once the
// new page has rendered: SvelteKit changes the URL before it renders, so GA's
// own history tracking would record the previous page's title. In GA, the
// stream's "Page changes based on browser history events" (Enhanced
// measurement › Page views › advanced) must be off, or page changes count twice.

declare global {
	interface Window {
		dataLayer: unknown[];
		gtag?: (...args: unknown[]) => void;
	}
}

const ID = /^G-[A-Z0-9]+$/;

/** Paths GA must never see: Prismic drafts and the sales-only result pages
 *  (their URL holds the access token). */
const UNTRACKED = [/^\/preview(\/|$)/, /^\/self-service-result(\/|$)/];

export function isTracked(pathname: string): boolean {
	return !UNTRACKED.some((path) => path.test(pathname));
}

/** Whether a navigation from `from` to `to` is a new page view: not a reload
 *  of the same URL (e.g. `invalidate`) and not a jump to an anchor. */
export function isNewPage(from: URL | null | undefined, to: URL): boolean {
	return !from || from.pathname !== to.pathname || from.search !== to.search;
}

function loadGtag(id: string): void {
	window.dataLayer = window.dataLayer || [];
	window.gtag = function gtag() {
		// gtag.js expects the arguments object itself, not an array.
		// eslint-disable-next-line prefer-rest-params
		window.dataLayer.push(arguments);
	};
	window.gtag?.("js", new Date());
	window.gtag?.("config", id, { send_page_view: false });
	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
	document.head.append(script);
}

/** Loads gtag.js on the first tracked page and sends a page_view for `url`. */
export function trackPageView(id: string | undefined, url: URL): void {
	if (!id || !ID.test(id) || !isTracked(url.pathname)) return;
	if (!window.gtag) loadGtag(id);
	window.gtag?.("event", "page_view", {
		page_location: url.href,
		page_title: document.title,
	});
}
