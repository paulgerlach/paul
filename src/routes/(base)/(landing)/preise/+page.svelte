<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Allocation from "$lib/landing/pages/preise/sections/Allocation.svelte";
	import Closing from "$lib/landing/pages/preise/sections/Closing.svelte";
	import Contracts from "$lib/landing/pages/preise/sections/Contracts.svelte";
	import Extras from "$lib/landing/pages/preise/sections/Extras.svelte";
	import Faq from "$lib/landing/pages/preise/sections/Faq.svelte";
	import Hero from "$lib/landing/pages/preise/sections/Hero.svelte";
	import Request from "$lib/landing/pages/preise/sections/Request.svelte";
	import FloatingCta from "$lib/landing/sections/FloatingCta.svelte";
	import TrustSeals from "$lib/landing/sections/TrustSeals.svelte";
</script>

<main id="content" class="pr" {@attach reveal()}>
	<Hero />
	<Contracts />
	<Allocation />
	<Request />
	<Extras />
	<Faq />
	<Closing />
	<TrustSeals />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.pr {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.pr :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.pr :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.pr :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	/* .dm-pill (with #pillfx) */
	.pr :global(.pill) {
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
	.pr :global(.pill svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.pr :global(.pill:hover svg) {
		transform: scale(1.12);
		color: var(--ok);
	}
	/* .dm-h2; `section h2.h2` beats the landing reset of heading margins. */
	.pr :global(section h2.h2) {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-top: 18px;
		text-wrap: balance;
	}
	.pr :global(h2.h2 span) {
		color: #8a9792;
	}
	.pr :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.pr :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.pr :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.pr :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.pr :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.pr :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pr :global(.pill:hover svg) {
			transform: none;
		}
	}
</style>
