<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { reveal } from "$lib/landing/attachments/reveal";
	import { setDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import Closing from "$lib/landing/pages/fristenrechner/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/fristenrechner/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/fristenrechner/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/fristenrechner/sections/Hero.svelte";
	import Milestones from "$lib/landing/pages/fristenrechner/sections/Milestones.svelte";
	import Portfolio from "$lib/landing/pages/fristenrechner/sections/Portfolio.svelte";
	import Trust from "$lib/landing/pages/fristenrechner/sections/Trust.svelte";

	let { data } = $props();

	// SSR and hydration render from the server's time; the browser's clock
	// takes over on mount (the calculator's results, the milestones' badges).
	const clock = setDeadlineClock(untrack(() => data.now));
	onMount(() => clock.start());
</script>

<main id="content" class="fr" {@attach reveal()}>
	<Hero />
	<Milestones />
	<Portfolio />
	<Faq />
	<Closing />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.fr {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.fr :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.fr :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.fr :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	.fr :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.fr :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.fr :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.fr :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.fr :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.fr :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
