<!-- `Service` structured data of a region page. -->
<script lang="ts">
	import { PHONE } from "$lib/company";
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
			// The Organization / describes
			provider: {
				"@type": "Organization",
				"@id": `${SITE_URL}/#organization`,
				name: "Heidi Systems",
				url: SITE_URL,
				telephone: PHONE,
			},
			areaServed: { "@type": area.type, name: area.name },
		}).replace(/</g, "\\u003c")}<` + "/script>",
	);
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static data, "<" escaped -->
	{@html tag}
</svelte:head>
