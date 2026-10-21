<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import BeforeAfter from "$lib/landing/pages/schnittstellen/sections/BeforeAfter.svelte";
	import Benefits from "$lib/landing/pages/schnittstellen/sections/Benefits.svelte";
	import Calculator from "$lib/landing/pages/schnittstellen/sections/Calculator.svelte";
	import Closing from "$lib/landing/pages/schnittstellen/sections/Closing.svelte";
	import DataPath from "$lib/landing/pages/schnittstellen/sections/DataPath.svelte";
	import Faq from "$lib/landing/pages/schnittstellen/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/schnittstellen/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/schnittstellen/sections/Hero.svelte";
	import LogoStrip from "$lib/landing/pages/schnittstellen/sections/LogoStrip.svelte";
	import Steps from "$lib/landing/pages/schnittstellen/sections/Steps.svelte";
	import Testimonials from "$lib/landing/pages/schnittstellen/sections/Testimonials.svelte";
	import Trust from "$lib/landing/pages/schnittstellen/sections/Trust.svelte";

	let { data } = $props();
</script>

<main id="content" class="si" {@attach reveal()}>
	<Hero />
	<LogoStrip />
	<BeforeAfter />
	<Calculator />
	<DataPath />
	<Benefits />
	<Steps />
	<Testimonials />
	<Faq items={data.faq} />
	<Closing form={data.finalForm} />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.si {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.si :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.si :global(.pg-sec.alt) {
		background: var(--bg);
	}
	/* The design's 18 px above the section H2s (SectionHead's and Testimonials'), lost to the landing heading reset at equal specificity. */
	.si :global(.pg-sec .head h2),
	.si :global(section.tm h2) {
		margin-top: 18px;
	}
	/* This design keeps the two quotes side by side down to 641 px (the shared
	   Testimonials stack at 1040 px). */
	@media (max-width: 1040px) and (min-width: 641px) {
		.si :global(.tm .tm-row) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.si :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	.si :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.si :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.si :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.si :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.si :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.si :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
