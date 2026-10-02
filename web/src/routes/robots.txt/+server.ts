import { SITE_URL } from "$lib/seo/site";

export const prerender = true;

export const GET = () =>
	new Response(
		`User-agent: *
Allow: /
Disallow: /api/
Disallow: /fragebogen

Sitemap: ${SITE_URL}/sitemap.xml
`,
		{ headers: { "content-type": "text/plain" } },
	);
