import { getNavPosts } from "$lib/server/blog";

export const load = async ({ fetch, cookies, setHeaders }) => {
	// Same CDN caching as (base). There's no preview branch: these pages have
	// no Prismic content, so they don't exist under /preview/….
	setHeaders({ "cache-control": "s-maxage=60, stale-while-revalidate=600" });

	// Only the Blog dropdown in the nav reads Prismic. If it fails, the page
	// still renders and the Blog group is hidden.
	const navPosts = await getNavPosts({ fetch, cookies }).catch((error) => {
		console.error("[LANDING] Loading nav posts failed:", error);
		return [];
	});
	return { navPosts };
};
