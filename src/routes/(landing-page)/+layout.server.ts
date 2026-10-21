export const load = async ({ setHeaders }) => {
	// Same CDN caching as (base). There's no preview branch: these pages have
	// no Prismic content, so they don't exist under /preview/….
	setHeaders({ "cache-control": "s-maxage=60, stale-while-revalidate=600" });
};
