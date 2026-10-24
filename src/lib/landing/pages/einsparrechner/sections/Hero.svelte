<!-- Hero (.pg-hero, light): the centred head (pill, H1, lead) over the calculator. No `#start`: the page has no form. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { hero } from "../content";
	import Calculator from "./Calculator.svelte";
</script>

<section class="hero" aria-labelledby="es-h1">
	<div class="wrap">
		<div class="head">
			<span class="pill rv"
				><StrokeIcon
					><path
						d="M14.5 5.5A5.5 5.5 0 1 0 14.5 14.5M3.5 8.5h7M3.5 11.5h7"
					/></StrokeIcon
				>{hero.pill}</span
			>
			<h1 data-hs class="rv" id="es-h1">
				{hero.h1} <em>{hero.h1Accent}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
		</div>
		<Calculator />
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
	}
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
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
	/* `.head h1`: beats the landing reset of heading margins. */
	.head h1 {
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
		line-height: 1.55;
		margin: 18px auto 0;
		max-width: 640px;
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
