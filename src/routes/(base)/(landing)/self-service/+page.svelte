<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Check from "$lib/landing/pages/self-service/sections/Check.svelte";
	import Closing from "$lib/landing/pages/self-service/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/self-service/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/self-service/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/self-service/sections/Hero.svelte";
	import Trust from "$lib/landing/pages/self-service/sections/Trust.svelte";
	import Ways from "$lib/landing/pages/self-service/sections/Ways.svelte";
</script>

<main id="content" class="ss" {@attach reveal()}>
	<Hero />
	<Ways />
	<Check />
	<Faq />
	<Closing />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.ss {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.ss :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.ss :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.ss :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	/* .dm-pill (with #pillfx) */
	.ss :global(.pill) {
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
	.ss :global(.pill svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.ss :global(.pill:hover svg) {
		transform: scale(1.12);
		color: var(--ok);
	}
	/* .dm-h2; `section h2.h2` beats the landing reset of heading margins. */
	.ss :global(section h2.h2) {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-top: 18px;
		text-wrap: balance;
	}
	.ss :global(h2.h2 span) {
		color: #8a9792;
	}
	.ss :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ss :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.ss :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.ss :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.ss :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.ss :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ss :global(.pill:hover svg) {
			transform: none;
		}
	}
</style>
