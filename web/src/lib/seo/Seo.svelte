<script lang="ts">
	import { page } from "$app/state";
	import {
		DEFAULT_DESCRIPTION,
		DEFAULT_OG_DESCRIPTION,
		DEFAULT_OG_TITLE,
		DEFAULT_TITLE,
		KEYWORDS,
		ROOT_DESCRIPTION,
		ROOT_TITLE,
		SITE_URL,
		type SeoData,
	} from "./site";

	// Error pages fall back to the root layout values, like Next's not-found.
	const isError = $derived(page.error !== null);
	const seo: SeoData = $derived(page.data.seo ?? {});

	const title = $derived(seo.title ?? (isError ? ROOT_TITLE : DEFAULT_TITLE));
	const description = $derived(
		seo.description ?? (isError ? ROOT_DESCRIPTION : DEFAULT_DESCRIPTION),
	);
	const ogTitle = $derived(seo.ogTitle ?? DEFAULT_OG_TITLE);
	const ogDescription = $derived(seo.ogDescription ?? DEFAULT_OG_DESCRIPTION);
	// Prismic preview sessions (/preview/…) show drafts.
	const noindex = $derived(
		seo.noindex ?? (isError || page.params.preview !== undefined),
	);
	// Next pointed every page's canonical at the home page (KI-28).
	const canonical = $derived(
		page.url.pathname === "/" ? SITE_URL : SITE_URL + page.url.pathname,
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={KEYWORDS.join(",")} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{:else}
		<meta name="robots" content="index, follow" />
		<meta
			name="googlebot"
			content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
		/>
		<link rel="canonical" href={canonical} />
		<link rel="alternate" hreflang="de-DE" href={canonical} />
	{/if}
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content="Heidi Systems" />
	<meta property="og:locale" content="de_DE" />
	<meta property="og:type" content="website" />
	{#if seo.ogImage}
		<meta property="og:image" content={seo.ogImage} />
	{/if}
	<meta
		name="twitter:card"
		content={seo.ogImage ? "summary_large_image" : "summary"}
	/>
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={ogDescription} />
	{#if seo.ogImage}
		<meta name="twitter:image" content={seo.ogImage} />
	{/if}
</svelte:head>
