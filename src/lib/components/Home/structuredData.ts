import { SITE_URL } from "$lib/seo/site";

/** JSON-LD for the home page, as in Next. */
export const structuredData = {
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
			contactPoint: {
				"@type": "ContactPoint",
				// Placeholder number carried over from Next (KI-34).
				telephone: "+49-30-555-12345",
				contactType: "customer service",
				availableLanguage: ["de", "en"],
			},
			sameAs: [],
		},
		{
			"@type": "LocalBusiness",
			"@id": `${SITE_URL}/#localbusiness`,
			name: "Heidi Systems",
			image: `${SITE_URL}/admin_logo.png`,
			description:
				"Modernste Funkzähler-Technologie für digitale Erfassung von Warm-, Kaltwasser- und Heizungsverbrauch. Kostenlose Installation und automatisierte Betriebskostenabrechnung.",
			address: {
				"@type": "PostalAddress",
				addressCountry: "DE",
				addressLocality: "Deutschland",
			},
			priceRange: "$$",
			url: SITE_URL,
			telephone: "+49-30-555-12345",
			openingHoursSpecification: {
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: "09:00",
				closes: "18:00",
			},
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
		{
			"@type": "Service",
			"@id": `${SITE_URL}/#service`,
			serviceType: "Energiemanagement und Verbrauchserfassung",
			provider: {
				"@id": `${SITE_URL}/#organization`,
			},
			areaServed: "DE",
			hasOfferCatalog: {
				"@type": "OfferCatalog",
				name: "Heidi Systems Services",
				itemListElement: [
					{
						"@type": "Offer",
						itemOffered: {
							"@type": "Service",
							name: "Kostenfreie Installation von Funkzählern",
							description:
								"Umrüstung auf fernablesbare Funkzähler für Warmwasser, Kaltwasser und Heizung - komplett kostenfrei",
						},
					},
					{
						"@type": "Offer",
						itemOffered: {
							"@type": "Service",
							name: "Automatisierte Betriebskostenabrechnung",
							description:
								"Digitale Erfassung und automatische Verarbeitung aller Verbrauchsdaten für präzise Nebenkostenabrechnungen",
						},
					},
					{
						"@type": "Offer",
						itemOffered: {
							"@type": "Service",
							name: "Echtzeit-Dashboard und Verbrauchsanalyse",
							description:
								"Übersichtliches Dashboard zur Überwachung aller Energiedaten in Echtzeit",
						},
					},
				],
			},
		},
	],
};

/** `<script type="application/ld+json">` markup, safe to render with `{@html}`. */
export const structuredDataScript = `<script type="application/ld+json">${JSON.stringify(
	structuredData,
).replace(/</g, "\\u003c")}</script>`;
