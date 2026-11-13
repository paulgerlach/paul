import { isWebinarOpen } from "$lib/landing/webinar";

export const load = async ({ params, setHeaders }) => {
	// Decision #3: let the CDN cache pages for 60s, so Prismic isn't queried on
	// every request. Preview URLs (/preview/…, only the blog has them) show
	// drafts and must never be cached. Pages in this group must not set
	// cache-control themselves.
	setHeaders({
		"cache-control": params.preview
			? "private, no-store"
			: "s-maxage=60, stale-while-revalidate=600",
	});
	// The webinar banner drops out once the webinar is over (cached pages
	// within the 60 s above).
	return { webinar: isWebinarOpen(Date.now()) };
};
