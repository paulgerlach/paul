<!--
  Hero (.pg-hero.bl-hero, light): the pill, the H1, the lead and the featured
  story. No `#start`: the page has no form.
-->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { hero } from "../content";
	import Featured from "./Featured.svelte";
</script>

<section class="hero" aria-labelledby="nw-h1">
	<div class="wrap">
		<span class="pill rv"
			><StrokeIcon
				><path
					d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
				/></StrokeIcon
			>{hero.pill}</span
		>
		<h1 data-hs class="rv" id="nw-h1">
			{hero.h1} <em>{hero.h1Accent}</em>
		</h1>
		<p class="lead rv">{hero.lead}</p>
		<Featured badge={hero.featured.badge} story={hero.featured.story} />
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
	}
	/* .dm-pill */
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
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
	}
	/* .pg-h1; `.hero h1` beats the landing reset of heading margins. */
	.hero h1 {
		font-size: clamp(38px, 4.8vw, 64px);
		line-height: 1.03;
		letter-spacing: -0.04em;
		font-weight: 500;
		margin-top: 22px;
		text-wrap: balance;
	}
	h1 em {
		font-style: normal;
		color: var(--ok);
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 18px;
		max-width: 60ch;
		line-height: 1.55;
	}
	@media (max-width: 640px) {
		.hero {
			padding: 44px 0 60px;
		}
	}
</style>
