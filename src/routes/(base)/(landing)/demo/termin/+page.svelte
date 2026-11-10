<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { reveal } from "$lib/landing/attachments/reveal";
	import { setDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import Closing from "$lib/landing/pages/demo-buchen/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/demo-buchen/sections/Faq.svelte";
	import Flow from "$lib/landing/pages/demo-buchen/sections/Flow.svelte";
	import Hero from "$lib/landing/pages/demo-buchen/sections/Hero.svelte";
	import LogoStrip from "$lib/landing/pages/demo-buchen/sections/LogoStrip.svelte";
	import Prep from "$lib/landing/pages/demo-buchen/sections/Prep.svelte";
	import Testimonials from "$lib/landing/pages/demo-buchen/sections/Testimonials.svelte";
	import Trust from "$lib/landing/pages/demo-buchen/sections/Trust.svelte";

	let { data } = $props();

	// SSR and hydration render from the server's time; the browser's clock
	// takes over on mount.
	const clock = setDeadlineClock(untrack(() => data.now));
	onMount(() => clock.start());
</script>

<main id="content" class="dm" {@attach reveal()}>
	<Hero />
	<LogoStrip />
	<Flow />
	<Prep />
	<Testimonials />
	<Faq />
	<Closing />
	<Trust />
</main>

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.dm {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* .dm-pill (with #pillfx) */
	.dm :global(.pill) {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 14px;
		font-weight: 500;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.06);
	}
	.dm :global(.pill svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.dm :global(.pill:hover svg) {
		transform: scale(1.12);
		color: var(--ok);
	}
	/* .dm-h2; `section h2.h2` beats the landing reset of heading margins. */
	.dm :global(section h2.h2) {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-top: 18px;
		text-wrap: balance;
	}
	.dm :global(h2.h2 span) {
		color: #8a9792;
	}
	.dm :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.dm :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* .bk-next (#demo-css): the dark button. Without weight (`:where`), so a
	   component's own class sets its margins and width. */
	:where(.dm) :global(.bk-next) {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		margin-top: 18px;
		border: 0;
		background: var(--ink);
		color: #fff;
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 18px;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.15s,
			opacity 0.2s;
	}
	:where(.dm) :global(.bk-next:hover) {
		background: #2a443d;
	}
	:where(.dm) :global(.bk-next:active) {
		transform: scale(0.98);
	}
	:where(.dm) :global(.bk-next .ar) {
		transition: transform 0.25s;
	}
	:where(.dm) :global(.bk-next:hover .ar) {
		transform: translateX(4px);
	}
	:where(.dm) :global(.bk-next svg) {
		width: 17px;
		height: 17px;
	}
	:where(.dm) :global(.bk-next.inv) {
		background: var(--accent);
		color: var(--ink);
		width: auto;
		display: inline-flex;
		margin-top: 0;
	}
	:where(.dm) :global(.bk-next.inv:hover) {
		background: #fff;
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.dm :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.dm :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.dm :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.dm :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.dm :global(.pill:hover svg) {
			transform: none;
		}
	}
</style>
