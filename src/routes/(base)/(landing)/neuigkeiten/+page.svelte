<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Closing from "$lib/landing/pages/neuigkeiten/sections/Closing.svelte";
	import Deadlines from "$lib/landing/pages/neuigkeiten/sections/Deadlines.svelte";
	import FloatingCta from "$lib/landing/pages/neuigkeiten/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/neuigkeiten/sections/Hero.svelte";
	import News from "$lib/landing/pages/neuigkeiten/sections/News.svelte";
	import Trust from "$lib/landing/pages/neuigkeiten/sections/Trust.svelte";
</script>

<main id="content" class="nw" {@attach reveal()}>
	<Hero />
	<News />
	<Deadlines />
	<Closing />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.nw {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.nw :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.nw :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.nw :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	.nw :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.nw :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.nw :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.nw :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.nw :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.nw :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
