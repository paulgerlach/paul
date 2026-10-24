import { LAUNCHED } from "$lib/landing/launch";
import { LIVE_CITIES } from "$lib/landing/pages/messdienstanbieter-city/cities";
import { cityRoute } from "$lib/routes";
import { SITE_URL } from "$lib/seo/site";
import { getSitemapPosts } from "$lib/server/blog";
import { SITE_PAGES } from "$lib/sitePages";

type Entry = {
	path: string;
	changefreq: string;
	priority: number;
	lastmod?: string;
};

const pages: Entry[] = [
	// The gated pages only after the launch (LAUNCHED), the cities once live.
	...SITE_PAGES.filter((p) => !p.gated || LAUNCHED),
	...LIVE_CITIES.map((c) => ({
		path: cityRoute(c.slug),
		changefreq: "monthly",
		priority: 0.8,
	})),
];

export const GET = async ({ fetch, setHeaders }) => {
	// Blog posts with their real last change (KI-05).
	const posts: Entry[] = (await getSitemapPosts({ fetch })).map((post) => ({
		path: `/blog/${post.uid}`,
		changefreq: "monthly",
		priority: 0.6,
		lastmod: post.lastmod,
	}));
	setHeaders({
		"cache-control": "s-maxage=3600, stale-while-revalidate=86400",
	});

	const urls = [...pages, ...posts]
		.map(
			(p) => `<url>
<loc>${SITE_URL}${p.path}</loc>
${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>\n` : ""}<changefreq>${p.changefreq}</changefreq>
<priority>${p.priority}</priority>
</url>`,
		)
		.join("\n");

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
		{ headers: { "content-type": "application/xml" } },
	);
};
