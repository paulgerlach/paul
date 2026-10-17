<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Audience from "$lib/landing/pages/mieterportal/sections/Audience.svelte";
	import CtaCard from "$lib/landing/pages/mieterportal/sections/CtaCard.svelte";
	import Faq from "$lib/landing/pages/mieterportal/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/mieterportal/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/mieterportal/sections/Hero.svelte";
	import Numbers from "$lib/landing/pages/mieterportal/sections/Numbers.svelte";
	import Picture from "$lib/landing/pages/mieterportal/sections/Picture.svelte";
	import Quotes from "$lib/landing/pages/mieterportal/sections/Quotes.svelte";
	import Rotator from "$lib/landing/pages/mieterportal/sections/Rotator.svelte";
	import Rows from "$lib/landing/pages/mieterportal/sections/Rows.svelte";
	import Statement from "$lib/landing/pages/mieterportal/sections/Statement.svelte";
	import Trust from "$lib/landing/pages/mieterportal/sections/Trust.svelte";

	let { data } = $props();
</script>

<main id="content" class="mp" {@attach reveal()}>
	<!-- The dark part of the page; the security block stays light (plan README, Dark page). -->
	<div class="uv">
		<Hero />
		<Statement />
		<Rows />
		<Rotator />
		<Numbers />
		<Audience />
		<Quotes />
		<Picture />
		<Faq />
		<CtaCard form={data.finalForm} />
	</div>
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens */
	.mp {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.uv {
		background: var(--ink);
		color: #fff;
		--card: #253d37;
		--card2: #2c4841;
		--mute: rgba(255, 255, 255, 0.68);
		--lime: var(--accent);
	}
	.mp :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.mp :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	.uv :global(:focus-visible) {
		outline-color: var(--accent);
	}

	/* The design's .uv-btn (hero, rows, the Verwalter card) */
	.uv :global(.uv-btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		padding: 13px 18px;
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		text-decoration: none;
		white-space: nowrap;
		transition:
			background 0.2s,
			transform 0.15s,
			color 0.2s;
	}
	.uv :global(.uv-btn.w) {
		background: #fff;
		color: var(--ink);
	}
	.uv :global(.uv-btn.w:hover) {
		background: var(--lime);
	}
	.uv :global(.uv-btn.d) {
		background: var(--card2);
		color: #fff;
	}
	.uv :global(.uv-btn.d:hover) {
		background: #365850;
	}
	.uv :global(.uv-btn:active) {
		transform: scale(0.98);
	}
	@media (max-width: 620px) {
		.uv :global(.uv-btn) {
			padding: 12px 15px;
			font-size: 13px;
		}
	}

	/* #hs-css: the section H2s with an id (Zahlen, quotes, the security block),
	   between 621 and 1040 px and below. The FAQ's H2 gets them in its wrapper. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.mp :global(section:not(.end):not(.rows):not(.who) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.mp :global(section:not(.end):not(.rows):not(.who) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
