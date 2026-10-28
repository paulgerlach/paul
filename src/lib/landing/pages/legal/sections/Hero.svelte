<!-- Hero (.pg-hero.lg-hero, light, one column): pill, H1 and lead. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import type { LegalPage } from "../types";

	let { page }: { page: LegalPage } = $props();
</script>

<section class="hero" aria-labelledby="lg-h1">
	<div class="wrap">
		<span class="pill rv"
			><StrokeIcon
				><path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
					d="M12 2.5V6h3.5M8 10h5M8 13h5"
				/></StrokeIcon
			>{page.pill}</span
		>
		<h1 data-hs class="rv" id="lg-h1">{page.h1}</h1>
		<p class="lead rv">{page.lead}</p>
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
	}
	.pill {
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
	.pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	/* #pillfx */
	.pill:hover :global(svg) {
		transform: scale(1.12);
		color: var(--ok);
	}
	/* `.wrap h1`: beats the landing reset of heading margins. */
	.wrap h1 {
		font-size: clamp(38px, 4.8vw, 64px);
		line-height: 1.03;
		letter-spacing: -0.04em;
		font-weight: 500;
		margin-top: 22px;
		text-wrap: balance;
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 18px;
		max-width: 52ch;
		line-height: 1.55;
	}
	@media (max-width: 640px) {
		.hero {
			padding: 44px 0 60px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
	}
</style>
