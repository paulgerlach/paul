<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import type { OfferFilter } from "$lib/landing/pages/energieausweis/content";
	import Check from "$lib/landing/pages/energieausweis/sections/Check.svelte";
	import Closing from "$lib/landing/pages/energieausweis/sections/Closing.svelte";
	import Compare from "$lib/landing/pages/energieausweis/sections/Compare.svelte";
	import Faq from "$lib/landing/pages/energieausweis/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/energieausweis/sections/FloatingCta.svelte";
	import Heidi from "$lib/landing/pages/energieausweis/sections/Heidi.svelte";
	import Hero from "$lib/landing/pages/energieausweis/sections/Hero.svelte";
	import Offers from "$lib/landing/pages/energieausweis/sections/Offers.svelte";
	import Trust from "$lib/landing/pages/energieausweis/sections/Trust.svelte";

	let { data } = $props();

	// The offer filter: set by its own control and by the check's result.
	let filter = $state<OfferFilter>("all");
</script>

<main id="content" class="ea" {@attach reveal()}>
	<Hero />
	<Check onpick={(value) => (filter = value)} />
	<Offers bind:filter />
	<Compare />
	<Heidi />
	<Faq />
	<Closing form={data.finalForm} />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.ea {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.ea :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.ea :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.ea :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	.ea :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ea :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.ea :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.ea :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.ea :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.ea :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
