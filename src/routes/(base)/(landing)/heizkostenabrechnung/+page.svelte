<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Automation from "$lib/landing/pages/heizkostenabrechnung/sections/Automation.svelte";
	import Closing from "$lib/landing/pages/heizkostenabrechnung/sections/Closing.svelte";
	import Dashboard from "$lib/landing/pages/heizkostenabrechnung/sections/Dashboard.svelte";
	import DocuScan from "$lib/landing/pages/heizkostenabrechnung/sections/DocuScan.svelte";
	import Faq from "$lib/landing/pages/heizkostenabrechnung/sections/Faq.svelte";
	import Hero from "$lib/landing/pages/heizkostenabrechnung/sections/Hero.svelte";
	import More from "$lib/landing/pages/heizkostenabrechnung/sections/More.svelte";
	import Quote from "$lib/landing/pages/heizkostenabrechnung/sections/Quote.svelte";
	import Sample from "$lib/landing/pages/heizkostenabrechnung/sections/Sample.svelte";
	import Steps from "$lib/landing/pages/heizkostenabrechnung/sections/Steps.svelte";
	import Timeline from "$lib/landing/pages/heizkostenabrechnung/sections/Timeline.svelte";
	import FloatingCta from "$lib/landing/sections/FloatingCta.svelte";
	import TrustSeals from "$lib/landing/sections/TrustSeals.svelte";
</script>

<main id="content" class="hk" {@attach reveal()}>
	<Hero />
	<Timeline />
	<DocuScan />
	<Automation />
	<Dashboard />
	<Quote />
	<More />
	<Sample />
	<Steps />
	<Faq />
	<Closing />
	<TrustSeals />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.hk {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.hk :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.hk :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.hk :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	/* .dm-pill (with #pillfx); `.c` centres it (.dm-pill.c) */
	.hk :global(.pill) {
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
	.hk :global(.pill.c) {
		display: flex;
		width: max-content;
		margin: 0 auto;
	}
	.hk :global(.pill svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.hk :global(.pill:hover svg) {
		transform: scale(1.12);
		color: var(--ok);
	}
	/* .dm-h2; `section h2.h2` beats the landing reset of heading margins. */
	.hk :global(section h2.h2) {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-top: 18px;
		text-wrap: balance;
	}
	.hk :global(h2.h2.c) {
		text-align: center;
	}
	.hk :global(h2.h2 span) {
		color: #8a9792;
	}
	/* .hk-sub, .hk-note: the line under a heading, the small print */
	.hk :global(.hk-sub) {
		text-align: center;
		color: var(--muted);
		font-size: 17px;
		line-height: 1.55;
		max-width: 62ch;
		margin: 16px auto 0;
	}
	.hk :global(.hk-note) {
		font-size: 13px;
		color: var(--faint);
		margin-top: 16px;
	}
	.hk :global(.hk-note.c) {
		text-align: center;
	}
	/* .hk-lk: the text links with an arrow */
	.hk :global(.hk-lk) {
		display: inline-flex;
		gap: 8px;
		margin-top: 18px;
		font-weight: 500;
		color: var(--ink);
	}
	.hk :global(.hk-lk .ar) {
		transition: transform 0.2s;
	}
	.hk :global(.hk-lk:hover .ar) {
		transform: translateX(3px);
	}
	/* .hk-ph: the phone mock of the dashboard row and the uVI card */
	.hk :global(.hk-ph) {
		position: relative;
		width: 300px;
		height: 380px;
		background: #fff;
		border: 8px solid #f6f6f4;
		border-bottom: 0;
		border-radius: 44px 44px 0 0;
		padding: 34px 18px 0;
		box-shadow: 0 0 0 1px #e2e2de;
		overflow: hidden;
	}
	.hk :global(.hk-ph.sm) {
		width: 280px;
		height: 300px;
	}
	.hk :global(.hk-ph .nt) {
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
		width: 76px;
		height: 14px;
		border-radius: 7px;
		background: #ededea;
	}
	.hk :global(.hk-pn) {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.hk :global(.hk-pn .ic) {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: #f2f3f2;
		display: grid;
		place-items: center;
	}
	.hk :global(.hk-pn .ic svg) {
		width: 14px;
		height: 14px;
	}
	.hk :global(.hk-pn b) {
		display: block;
		font-size: 13px;
		font-weight: 500;
	}
	.hk :global(.hk-pn small) {
		display: block;
		font-size: 11px;
		color: var(--muted);
	}
	.hk :global(.hk-pl) {
		display: block;
		font-size: 12px;
		color: var(--muted);
		margin-top: 16px;
	}
	.hk :global(.hk-pv) {
		display: block;
		font-size: 26px;
		font-weight: 400;
		letter-spacing: -0.02em;
		margin-top: 4px;
		font-variant-numeric: tabular-nums;
	}
	.hk :global(.hk-pv + .hk-pl) {
		margin-top: 6px;
	}
	@media (max-width: 560px) {
		.hk :global(.hk-ph) {
			width: 260px;
		}
	}
	.hk :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.hk :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.hk :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.hk :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.hk :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.hk :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.hk :global(.pill:hover svg) {
			transform: none;
		}
	}
</style>
