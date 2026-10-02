import { getNavPosts } from "$lib/server/blog";

export const load = async ({ fetch, cookies, setHeaders }) => {
	// Decision #3: let the CDN cache pages for 60s, so the Prismic fetch for the
	// nav doesn't run on every request. Pages in this group must not set
	// cache-control themselves.
	setHeaders({ "cache-control": "s-maxage=60, stale-while-revalidate=600" });

	return { navPosts: await getNavPosts({ fetch, cookies }) };
};
