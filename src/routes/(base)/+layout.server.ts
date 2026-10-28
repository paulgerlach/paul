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
};
