<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Check from "$lib/landing/pages/legionellenpruefung/sections/Check.svelte";
	import Closing from "$lib/landing/pages/legionellenpruefung/sections/Closing.svelte";
	import Duties from "$lib/landing/pages/legionellenpruefung/sections/Duties.svelte";
	import Faq from "$lib/landing/pages/legionellenpruefung/sections/Faq.svelte";
	import Heidi from "$lib/landing/pages/legionellenpruefung/sections/Heidi.svelte";
	import Hero from "$lib/landing/pages/legionellenpruefung/sections/Hero.svelte";
	import LabPicture from "$lib/landing/pages/legionellenpruefung/sections/LabPicture.svelte";
	import Sampling from "$lib/landing/pages/legionellenpruefung/sections/Sampling.svelte";
	import Steps from "$lib/landing/pages/legionellenpruefung/sections/Steps.svelte";
	import Urgency from "$lib/landing/pages/legionellenpruefung/sections/Urgency.svelte";
	import FloatingCta from "$lib/landing/sections/FloatingCta.svelte";
	import TrustSeals from "$lib/landing/sections/TrustSeals.svelte";
</script>

<main id="content" class="lg" {@attach reveal()}>
	<Hero />
	<Urgency />
	<Check />
	<Sampling />
	<Duties />
	<Steps />
	<LabPicture />
	<Heidi />
	<Faq />
	<Closing />
	<TrustSeals />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.lg {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.lg :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.lg :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.lg :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	/* #pillfx on the section pills (SectionHead) */
	.lg :global(.pg-sec .pill svg) {
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.lg :global(.pg-sec .pill:hover svg) {
		transform: scale(1.12);
		color: var(--ok);
	}
	.lg :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.lg :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.lg :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.lg :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.lg :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.lg :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.lg :global(.pg-sec .pill:hover svg) {
			transform: none;
		}
	}
</style>
