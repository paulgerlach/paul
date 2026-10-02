<script lang="ts">
	import "../app.css";
	import exo2Latin from "@fontsource-variable/exo-2/files/exo-2-latin-wght-normal.woff2?url";
	import exo2LatinExt from "@fontsource-variable/exo-2/files/exo-2-latin-ext-wght-normal.woff2?url";
	import Seo from "$lib/seo/Seo.svelte";

	let { children } = $props();

	// Registered as "Exo 2" (not fontsource's "Exo 2 Variable") because the
	// global CSS refers to that family name, as next/font registered it.
	const fontFaces = `<style>
@font-face{font-family:"Exo 2";font-style:normal;font-display:swap;font-weight:100 900;src:url(${exo2LatinExt}) format("woff2-variations");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:"Exo 2";font-style:normal;font-display:swap;font-weight:100 900;src:url(${exo2Latin}) format("woff2-variations");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
</style>`;
</script>

<svelte:head>
	<link
		rel="preload"
		as="font"
		type="font/woff2"
		href={exo2Latin}
		crossorigin="anonymous"
	/>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static string -->
	{@html fontFaces}
</svelte:head>

<Seo />

{@render children()}
