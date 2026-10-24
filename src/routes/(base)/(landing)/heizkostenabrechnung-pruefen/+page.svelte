<script lang="ts">
	import { onDestroy, onMount, untrack } from "svelte";
	import { reveal } from "$lib/landing/attachments/reveal";
	import { setDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { todayOf } from "$lib/landing/pages/fristenrechner/fristen";
	import { setBillCheck } from "$lib/landing/pages/heizkostenabrechnung-pruefen/check.svelte";
	import Closing from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/Closing.svelte";
	import Deadlines from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/Deadlines.svelte";
	import Errors from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/Errors.svelte";
	import Faq from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/Hero.svelte";
	import Letter from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/Letter.svelte";
	import Managers from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/Managers.svelte";
	import Numbers from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/Numbers.svelte";
	import Paywall from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/Paywall.svelte";
	import Scan from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/Scan.svelte";
	import Trust from "$lib/landing/pages/heizkostenabrechnung-pruefen/sections/Trust.svelte";

	let { data } = $props();

	// The rules' "today" is the Berlin day of the server's time on the
	// server and of the browser's clock after mount.
	const clock = setDeadlineClock(untrack(() => data.now));
	onMount(() => clock.start());
	const check = setBillCheck(() => todayOf(clock.now));
	onDestroy(() => check.dispose());
</script>

<main id="content" class="mc" {@attach reveal()}>
	<Hero />
	<Letter />
	<Scan />
	<Numbers />
	<Errors />
	<Deadlines />
	<Managers />
	<Faq />
	<Closing />
	<Paywall />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.mc {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.mc :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.mc :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.mc :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	.mc :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.mc :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* .bk-next (#demo-css): the dark button. Without weight (`:where`), so a
	   component's own class sets its margins and width. */
	:where(.mc) :global(.bk-next) {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		margin-top: 18px;
		border: 0;
		background: var(--ink);
		color: #fff;
		font: inherit;
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
	:where(.mc) :global(.bk-next:hover:not(:disabled)) {
		background: #2a443d;
	}
	:where(.mc) :global(.bk-next:active:not(:disabled)) {
		transform: scale(0.98);
	}
	:where(.mc) :global(.bk-next:disabled) {
		opacity: 0.35;
		cursor: not-allowed;
	}
	:where(.mc) :global(.bk-next .ar) {
		transition: transform 0.25s;
	}
	:where(.mc) :global(.bk-next:hover .ar) {
		transform: translateX(4px);
	}
	:where(.mc) :global(.bk-next svg) {
		width: 17px;
		height: 17px;
	}
	/* The landing reset's `:is(button, input) { font: inherit; color:
	   inherit }` (0,1,1) outweighs the rule above on <button>s; the doubled
	   class (0,2,0) beats it and still loses to a component's own rules
	   (`.ra .bk-next`). */
	:where(.mc) :global(.bk-next.bk-next) {
		font-size: 15.5px;
		font-weight: 600;
		color: #fff;
	}
	:where(.mc) :global(.bk-next.inv) {
		background: var(--accent);
		color: var(--ink);
		width: auto;
		display: inline-flex;
		margin-top: 0;
	}
	:where(.mc) :global(.bk-next.inv:hover) {
		background: #fff;
	}
	/* .pg-ghost (#pg-common-css) */
	:where(.mc) :global(.pg-ghost) {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 11px;
		padding: 13px 18px;
		font-size: 15.5px;
		font-weight: 600;
		color: var(--ink);
		cursor: pointer;
		transition: border-color 0.2s;
	}
	:where(.mc) :global(.pg-ghost.pg-ghost) {
		font-size: 15.5px;
		font-weight: 600;
		color: var(--ink);
	}
	:where(.mc) :global(.pg-ghost:hover) {
		border-color: #c3cdc8;
	}
	@media (max-width: 640px) {
		:where(.mc) :global(.pg-ghost) {
			justify-content: center;
		}
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.mc :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.mc :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.mc :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.mc :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
