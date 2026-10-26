<script lang="ts">
	import { onMount, untrack } from "svelte";
	import geistMono from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url";
	import { reveal } from "$lib/landing/attachments/reveal";
	import { setDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import Comparison from "$lib/landing/pages/vorgehen/sections/Comparison.svelte";
	import ContactCard from "$lib/landing/pages/vorgehen/sections/ContactCard.svelte";
	import Faq from "$lib/landing/pages/vorgehen/sections/Faq.svelte";
	import Features from "$lib/landing/pages/vorgehen/sections/Features.svelte";
	import FloatingCta from "$lib/landing/pages/vorgehen/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/vorgehen/sections/Hero.svelte";
	import Journey from "$lib/landing/pages/vorgehen/sections/Journey.svelte";
	import Quotes from "$lib/landing/pages/vorgehen/sections/Quotes.svelte";
	import RemoteDuty from "$lib/landing/pages/vorgehen/sections/RemoteDuty.svelte";
	import Stats from "$lib/landing/pages/vorgehen/sections/Stats.svelte";
	import Split from "$lib/landing/pages/vorgehen/sections/Split.svelte";
	import Steps from "$lib/landing/pages/vorgehen/sections/Steps.svelte";
	import Trust from "$lib/landing/pages/vorgehen/sections/Trust.svelte";
	import WideImage from "$lib/landing/pages/vorgehen/sections/WideImage.svelte";

	let { data } = $props();

	// The day count renders from the server's time; the browser's clock takes
	// over on mount.
	const clock = setDeadlineClock(untrack(() => data.now));
	onMount(() => clock.start());

	// Geist Mono for the figures, only on this page (plan 01 §1.5). No
	// preload: its first use is below the fold.
	const fontFace = `<style>
@font-face{font-family:"Geist Mono";font-style:normal;font-display:swap;font-weight:100 900;src:url(${geistMono}) format("woff2-variations");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
</style>`;
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static string -->
	{@html fontFace}
</svelte:head>

<main id="content" class="vg" {@attach reveal()}>
	<Hero />
	<WideImage />
	<Stats />
	<RemoteDuty />
	<Steps />
	<Journey />
	<Split />
	<Features />
	<Comparison />
	<Quotes />
	<Faq />
	<ContactCard />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm.ar` wrapper) */
	.vg {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
		--soft: #f3f4f2;
		--soft2: #eceeeb;
		--mono: "Geist Mono", ui-monospace, Menlo, monospace;
	}
	.vg :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.vg :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
</style>
