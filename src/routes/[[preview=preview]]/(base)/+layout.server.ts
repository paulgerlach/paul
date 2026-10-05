import { getNavPosts } from "$lib/server/blog";

export const load = async ({ fetch, cookies, params, setHeaders }) => {
	// Decision #3: let the CDN cache pages for 60s, so Prismic isn't queried on
	// every request. Preview URLs (/preview/…) show drafts and must never be
	// cached. Pages in this group must not set cache-control themselves.
	setHeaders({
		"cache-control": params.preview
			? "private, no-store"
			: "s-maxage=60, stale-while-revalidate=600",
	});

	// Only the Blog dropdown in the nav needs these. If loading fails, the page
	// still renders and the Blog group is hidden.
	const navPosts = await getNavPosts({ fetch, cookies }).catch((error) => {
		console.error("[BASE] Loading nav posts failed:", error);
		return [];
	});
	return { navPosts };
};
