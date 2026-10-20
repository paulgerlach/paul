<script lang="ts">
	import geistMono from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url";
	import { reveal } from "$lib/landing/attachments/reveal";
	import Docs from "$lib/landing/pages/api-dokumentation/sections/Docs.svelte";
	import FloatingCta from "$lib/landing/pages/api-dokumentation/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/api-dokumentation/sections/Hero.svelte";
	import Trust from "$lib/landing/pages/api-dokumentation/sections/Trust.svelte";

	// Geist Mono for the code, only on this page (plan 01 §1.4). Preloaded:
	// the hero's terminal uses it.
	const fontFace = `<style>
@font-face{font-family:"Geist Mono";font-style:normal;font-display:swap;font-weight:100 900;src:url(${geistMono}) format("woff2-variations");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
</style>`;
</script>

<svelte:head>
	<link
		rel="preload"
		as="font"
		type="font/woff2"
		href={geistMono}
		crossorigin="anonymous"
	/>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static string -->
	{@html fontFace}
</svelte:head>

<main id="content" class="ad" {@attach reveal()}>
	<Hero />
	<Docs />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) and the code font */
	.ad {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
		--mono:
			"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}
	/* `.lp *` sets Geist on every element: the code and what's inside it
	   need the mono font at a higher specificity. */
	.ad :global(:is(code, pre)),
	.ad :global(:is(code, pre) *) {
		font-family: var(--mono);
	}
	.ad :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ad :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the trust block's H2 between 621 and 1040 px and
	   below (the articles' H2s have no id). */
	@media (max-width: 1040px) and (min-width: 621px) {
		.ad :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.ad :global(section h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.ad :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.ad :global(section h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
