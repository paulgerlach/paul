import { SITE_URL } from "$lib/seo/site";

/**
 * The Organization and WebSite JSON-LD of the home (/messdienstanbieter since
 * the site cutover; Next's home had them). Other pages refer to the
 * Organization by its `@id`. No phone until KI-34 is resolved.
 */
export const organizationJsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Organization",
			"@id": `${SITE_URL}/#organization`,
			name: "Heidi Systems",
			url: SITE_URL,
			logo: {
				"@type": "ImageObject",
				url: `${SITE_URL}/admin_logo.png`,
			},
			description:
				"Digitale Erfassung aller Verbrauchsdaten im Gebäude. Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.",
			sameAs: [],
		},
		{
			"@type": "WebSite",
			"@id": `${SITE_URL}/#website`,
			url: SITE_URL,
			name: "Heidi Systems",
			description:
				"Digitale Erfassung aller Verbrauchsdaten im Gebäude Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.",
			publisher: {
				"@id": `${SITE_URL}/#organization`,
			},
			inLanguage: "de-DE",
		},
	],
};

/** `<script type="application/ld+json">` markup, safe to render with `{@html}`. */
export const organizationJsonLdScript = `<script type="application/ld+json">${JSON.stringify(
	organizationJsonLd,
).replace(/</g, "\\u003c")}</script>`;
