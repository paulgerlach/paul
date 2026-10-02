import { SITE_URL } from "$lib/seo/site";

type Entry = { path: string; changefreq: string; priority: number };

const pages: Entry[] = [
	{ path: "", changefreq: "weekly", priority: 1 },
	{ path: "/funktionen", changefreq: "monthly", priority: 0.8 },
	{ path: "/preise", changefreq: "monthly", priority: 0.8 },
	{ path: "/geraete", changefreq: "monthly", priority: 0.8 },
	{ path: "/kontakt", changefreq: "monthly", priority: 0.7 },
	{ path: "/blog", changefreq: "weekly", priority: 0.7 },
	{ path: "/impressum", changefreq: "yearly", priority: 0.3 },
	{ path: "/datenschutzhinweise", changefreq: "yearly", priority: 0.3 },
];

// TODO(phase 5): add /blog/:uid entries from Prismic with last_publication_date (KI-05)
export const GET = () => {
	const lastmod = new Date().toISOString();
	const urls = pages
		.map(
			(p) => `<url>
<loc>${SITE_URL}${p.path}</loc>
<lastmod>${lastmod}</lastmod>
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
