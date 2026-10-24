<!--
  A legal page (/impressum, /datenschutz, /agb): the hero, the
  articles, the security block and the floating CTA. No signup form:
  "Demo buchen" and the floating CTA go to /demo (`DEMO_HREF`).
-->
<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import FloatingCta from "$lib/landing/sections/FloatingCta.svelte";
	import TrustSeals from "$lib/landing/sections/TrustSeals.svelte";
	import Articles from "./sections/Articles.svelte";
	import Hero from "./sections/Hero.svelte";
	import type { LegalPage } from "./types";

	let { page }: { page: LegalPage } = $props();
</script>

<main id="content" class="lg" {@attach reveal()}>
	<Hero {page} />
	<Articles {page} />
	<TrustSeals />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.lg {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec) */
	.lg :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	@media (max-width: 640px) {
		.lg :global(.pg-sec) {
			padding: 72px 0;
		}
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
	/* #hs-css: the H1 and the trust block's H2 between 621 and 1040 px and
	   below (the articles' H2s have no id). */
	@media (max-width: 1040px) and (min-width: 621px) {
		.lg :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.lg :global(section h2[id]) {
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
		.lg :global(section h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
