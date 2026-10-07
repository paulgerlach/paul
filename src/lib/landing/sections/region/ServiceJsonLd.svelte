<!-- `Service` structured data of a region page. No phone number until KI-34 is resolved. -->
<script lang="ts">
	import { SITE_URL } from "$lib/seo/site";

	let {
		area,
		url,
	}: {
		/** "Berlin" (a City) or "Deutschland" (the Country) */
		area: { type: "City" | "Country"; name: string };
		url: string;
	} = $props();

	const tag = $derived(
		`<script type="application/ld+json">${JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Service",
			serviceType: "Messdienst / Heizkostenabrechnung",
			url: `${SITE_URL}${url}`,
			// The Organization the home page describes
			provider: {
				"@type": "Organization",
				"@id": `${SITE_URL}/#organization`,
				name: "Heidi Systems",
				url: SITE_URL,
			},
			areaServed: { "@type": area.type, name: area.name },
		}).replace(/</g, "\\u003c")}<` + "/script>",
	);
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static data, "<" escaped -->
	{@html tag}
</svelte:head>
