<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Closing from "$lib/landing/pages/einsparrechner/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/einsparrechner/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/einsparrechner/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/einsparrechner/sections/Hero.svelte";
	import Method from "$lib/landing/pages/einsparrechner/sections/Method.svelte";
	import Trust from "$lib/landing/pages/einsparrechner/sections/Trust.svelte";
</script>

<main id="content" class="es" {@attach reveal()}>
	<Hero />
	<Method />
	<Faq />
	<Closing />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.es {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.es :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.es :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.es :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	.es :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.es :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.es :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.es :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.es :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.es :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
