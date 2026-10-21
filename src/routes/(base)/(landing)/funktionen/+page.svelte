<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import CtaCard from "$lib/landing/pages/funktionen/sections/CtaCard.svelte";
	import Dashboard from "$lib/landing/pages/funktionen/sections/Dashboard.svelte";
	import Faq from "$lib/landing/pages/funktionen/sections/Faq.svelte";
	import FeatureGrid from "$lib/landing/pages/funktionen/sections/FeatureGrid.svelte";
	import FiveSteps from "$lib/landing/pages/funktionen/sections/FiveSteps.svelte";
	import FloatingCta from "$lib/landing/pages/funktionen/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/funktionen/sections/Hero.svelte";
	import Quote from "$lib/landing/pages/funktionen/sections/Quote.svelte";
	import Services from "$lib/landing/pages/funktionen/sections/Services.svelte";
	import Trust from "$lib/landing/pages/funktionen/sections/Trust.svelte";
	import TrustBadges from "$lib/landing/pages/funktionen/sections/TrustBadges.svelte";

	let { data } = $props();
</script>

<main id="content" class="fk" {@attach reveal()}>
	<Hero />
	<TrustBadges />
	<Services />
	<Dashboard />
	<FeatureGrid />
	<FiveSteps />
	<Quote />
	<Faq items={data.faq} />
	<CtaCard form={data.finalForm} />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens */
	.fk {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.fk :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.fk :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. The FAQ's H2 gets them in its wrapper. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.fk :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.fk :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.fk :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.fk :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
