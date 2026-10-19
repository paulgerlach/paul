<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Closing from "$lib/landing/pages/messdienstanbieter-vergleich/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/messdienstanbieter-vergleich/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/messdienstanbieter-vergleich/sections/FloatingCta.svelte";
	import LogoStrip from "$lib/landing/pages/messdienstanbieter-vergleich/sections/LogoStrip.svelte";
	import Testimonials from "$lib/landing/pages/messdienstanbieter-vergleich/sections/Testimonials.svelte";
	import Trust from "$lib/landing/pages/messdienstanbieter-vergleich/sections/Trust.svelte";

	let { data } = $props();
</script>

<main id="content" class="mv" {@attach reveal()}>
	<LogoStrip />
	<Testimonials />
	<Faq />
	<Closing form={data.finalForm} />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.mv {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.mv :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.mv :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.mv :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	.mv :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.mv :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* .bk-next (#demo-css): the dark button. Without weight (`:where`), so a
	   component's own class sets its margins and width. */
	:where(.mv) :global(.bk-next) {
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
	:where(.mv) :global(.bk-next:hover:not(:disabled)) {
		background: #2a443d;
	}
	:where(.mv) :global(.bk-next:active:not(:disabled)) {
		transform: scale(0.98);
	}
	:where(.mv) :global(.bk-next:disabled) {
		opacity: 0.35;
		cursor: not-allowed;
	}
	:where(.mv) :global(.bk-next .ar) {
		transition: transform 0.25s;
	}
	:where(.mv) :global(.bk-next:hover .ar) {
		transform: translateX(4px);
	}
	:where(.mv) :global(.bk-next svg) {
		width: 17px;
		height: 17px;
	}
	/* The landing reset's `:is(button, input) { font: inherit; color:
	   inherit }` (0,1,1) outweighs the rule above on <button>s; the doubled
	   class (0,2,0) beats it and still loses to a component's own rules
	   (`.ra .bk-next`). */
	:where(.mv) :global(.bk-next.bk-next) {
		font-size: 15.5px;
		font-weight: 600;
		color: #fff;
	}
	:where(.mv) :global(.bk-next.inv) {
		background: var(--accent);
		color: var(--ink);
		width: auto;
		display: inline-flex;
		margin-top: 0;
	}
	:where(.mv) :global(.bk-next.inv:hover) {
		background: #fff;
	}
	/* .pg-ghost (#pg-common-css) */
	:where(.mv) :global(.pg-ghost) {
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
	:where(.mv) :global(.pg-ghost.pg-ghost) {
		font-size: 15.5px;
		font-weight: 600;
		color: var(--ink);
	}
	:where(.mv) :global(.pg-ghost:hover) {
		border-color: #c3cdc8;
	}
	@media (max-width: 640px) {
		:where(.mv) :global(.pg-ghost) {
			justify-content: center;
		}
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.mv :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.mv :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.mv :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.mv :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
