import { SITE_URL } from "$lib/seo/site";
import { getSitemapPosts } from "$lib/server/blog";

type Entry = {
	path: string;
	changefreq: string;
	priority: number;
	lastmod?: string;
};

const pages: Entry[] = [
	{ path: "", changefreq: "weekly", priority: 1 },
	{ path: "/funktionen", changefreq: "monthly", priority: 0.8 },
	{ path: "/preise", changefreq: "monthly", priority: 0.8 },
	{ path: "/geraete", changefreq: "monthly", priority: 0.8 },
	{ path: "/messdienstwechsel", changefreq: "monthly", priority: 0.8 },
	{ path: "/kontakt", changefreq: "monthly", priority: 0.7 },
	{ path: "/blog", changefreq: "weekly", priority: 0.7 },
	{ path: "/impressum", changefreq: "yearly", priority: 0.3 },
	{ path: "/datenschutzhinweise", changefreq: "yearly", priority: 0.3 },
];

export const GET = async ({ fetch, setHeaders }) => {
	// Blog posts with their real last change (KI-05).
	const posts: Entry[] = (await getSitemapPosts({ fetch })).map((post) => ({
		path: `/blog/${post.uid}`,
		changefreq: "monthly",
		priority: 0.6,
		lastmod: post.lastmod,
	}));
	const now = new Date().toISOString();
	setHeaders({
		"cache-control": "s-maxage=3600, stale-while-revalidate=86400",
	});

	const urls = [...pages, ...posts]
		.map(
			(p) => `<url>
<loc>${SITE_URL}${p.path}</loc>
<lastmod>${p.lastmod ?? now}</lastmod>
<changefreq>${p.changefreq}</changefreq>
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
