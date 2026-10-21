<script lang="ts">
	import { onDestroy, onMount, untrack } from "svelte";
	import { reveal } from "$lib/landing/attachments/reveal";
	import { setDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { todayOf } from "$lib/landing/pages/fristenrechner/fristen";
	import { setPortfolioCheck } from "$lib/landing/pages/portfolio-checker/check.svelte";
	import Closing from "$lib/landing/pages/portfolio-checker/sections/Closing.svelte";
	import Decision from "$lib/landing/pages/portfolio-checker/sections/Decision.svelte";
	import Documents from "$lib/landing/pages/portfolio-checker/sections/Documents.svelte";
	import Faq from "$lib/landing/pages/portfolio-checker/sections/Faq.svelte";
	import Fields from "$lib/landing/pages/portfolio-checker/sections/Fields.svelte";
	import FloatingCta from "$lib/landing/pages/portfolio-checker/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/portfolio-checker/sections/Hero.svelte";
	import How from "$lib/landing/pages/portfolio-checker/sections/How.svelte";
	import NextSteps from "$lib/landing/pages/portfolio-checker/sections/NextSteps.svelte";
	import Quote from "$lib/landing/pages/portfolio-checker/sections/Quote.svelte";
	import Result from "$lib/landing/pages/portfolio-checker/sections/Result.svelte";
	import Trust from "$lib/landing/pages/portfolio-checker/sections/Trust.svelte";

	let { data } = $props();

	// The example evaluation is dated from the server's time on the server
	// and from the browser's clock after mount (its Berlin calendar day).
	const clock = setDeadlineClock(untrack(() => data.now));
	onMount(() => clock.start());
	const check = setPortfolioCheck(() => todayOf(clock.now));
	onDestroy(() => check.dispose());
</script>

<main id="content" class="pc" {@attach reveal()}>
	<Hero />
	<Result />
	<Documents />
	<How />
	<Fields />
	<NextSteps />
	<Decision />
	<Quote />
	<Faq />
	<Closing form={data.finalForm} />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.pc {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.pc :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.pc :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.pc :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	.pc :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.pc :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.pc :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.pc :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.pc :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.pc :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
