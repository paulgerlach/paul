<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { reveal } from "$lib/landing/attachments/reveal";
	import { setDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import Checklist from "$lib/landing/pages/muster-kuendigung/sections/Checklist.svelte";
	import Closing from "$lib/landing/pages/muster-kuendigung/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/muster-kuendigung/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/muster-kuendigung/sections/FloatingCta.svelte";
	import Generator from "$lib/landing/pages/muster-kuendigung/sections/Generator.svelte";
	import Hero from "$lib/landing/pages/muster-kuendigung/sections/Hero.svelte";
	import Takeover from "$lib/landing/pages/muster-kuendigung/sections/Takeover.svelte";
	import Trust from "$lib/landing/pages/muster-kuendigung/sections/Trust.svelte";

	let { data } = $props();

	// SSR and hydration render the letter's date from the server's time; the
	// browser's clock takes over on mount.
	const clock = setDeadlineClock(untrack(() => data.now));
	onMount(() => clock.start());
</script>

<main id="content" class="mk" {@attach reveal()}>
	<Hero />
	<Generator />
	<Checklist />
	<Takeover />
	<Faq />
	<Closing form={data.finalForm} />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.mk {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.mk :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.mk :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.mk :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	.mk :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.mk :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.mk :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.mk :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.mk :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.mk :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
