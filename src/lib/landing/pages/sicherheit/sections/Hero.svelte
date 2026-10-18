<!--
  The dark hero (.pg-hero.ink): pill, H1, lead, two CTAs and three ticks on
  the left, the map of Germany on the right. The page's form is in the
  closing card, so the hero has no `start` anchor (plan README, Signup).
-->
<script lang="ts">
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import Icon from "../components/Icon.svelte";
	import Tick from "../components/Tick.svelte";
	import { hero } from "../content";
	import DataMap from "./DataMap.svelte";
</script>

<section class="hero" aria-labelledby="sc-h1">
	<div class="wrap cols">
		<div>
			<span class="pill rv"><Icon name="lock" />{hero.pill}</span>
			<h1 data-hs class="rv" id="sc-h1">
				{hero.h1}<em>{hero.h1Accent}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
			<div class="ctas rv">
				<a
					class="b-demo"
					href={hero.demo.href}
					onclick={hero.demo.href === START_HREF ? focusSignup : undefined}
					>{hero.demo.text} <span class="ar" aria-hidden="true">→</span></a
				>
				<a class="b-data" href={hero.data.href}
					>{hero.data.text} <span class="ar" aria-hidden="true">↓</span></a
				>
			</div>
			<ul class="ticks rv">
				{#each hero.ticks as tick (tick)}
					<li><Tick />{tick}</li>
				{/each}
			</ul>
		</div>
		<DataMap />
	</div>
</section>

<style>
	.hero {
		background: var(--ink);
		color: #fff;
		padding: 72px 0 88px;
	}
	.cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 560px);
		gap: 64px;
		align-items: center;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.06);
		border-radius: 999px;
		padding: 7px 14px;
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.86);
	}
	.pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--accent);
		transform-origin: 50% 60%;
	}
	/* #pillfx */
	.pill:hover :global(svg) {
		animation: wiggle 0.75s cubic-bezier(0.3, 0, 0.3, 1);
	}
	@keyframes wiggle {
		0% {
			transform: rotate(0) scale(1);
		}
		20% {
			transform: rotate(-16deg) scale(1.18);
		}
		45% {
			transform: rotate(12deg) scale(1.18);
		}
		70% {
			transform: rotate(-6deg) scale(1.08);
		}
		100% {
			transform: rotate(0) scale(1);
		}
	}
	/* `.cols h1`: beats the landing reset of heading margins. */
	.cols h1 {
		font-size: clamp(38px, 4.8vw, 64px);
		line-height: 1.03;
		letter-spacing: -0.04em;
		font-weight: 500;
		margin-top: 22px;
		text-wrap: balance;
	}
	.cols h1 em {
		font-style: normal;
		color: var(--accent);
	}
	.lead {
		color: rgba(255, 255, 255, 0.72);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 18px;
		max-width: 52ch;
		line-height: 1.55;
	}
	.ctas {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-top: 32px;
	}
	.b-demo,
	.b-data {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border-radius: 11px;
		font-size: 15.5px;
		font-weight: 600;
		transition:
			background 0.2s,
			border-color 0.2s,
			transform 0.15s;
	}
	.b-demo {
		background: var(--accent);
		color: var(--ink);
		padding: 14px 20px;
	}
	.b-demo:hover {
		background: #fff;
	}
	.b-demo:active {
		transform: scale(0.98);
	}
	.b-data {
		border: 1px solid rgba(255, 255, 255, 0.24);
		color: #fff;
		padding: 13px 18px;
	}
	.b-data:hover {
		border-color: rgba(255, 255, 255, 0.5);
	}
	.ar {
		transition: transform 0.25s;
	}
	.b-demo:hover .ar {
		transform: translateX(4px);
	}
	.ticks {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 22px;
		/* The design keeps the list's default bottom margin. */
		margin: 28px 0 1em;
		padding: 0;
		list-style: none;
		font-size: 14.5px;
		color: rgba(255, 255, 255, 0.72);
	}
	.ticks li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	@media (max-width: 1040px) {
		.cols {
			grid-template-columns: minmax(0, 1fr);
			gap: 44px;
		}
	}
	@media (max-width: 640px) {
		.hero {
			padding: 44px 0 60px;
		}
		.ctas {
			flex-direction: column;
		}
		.b-demo,
		.b-data {
			justify-content: center;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			animation: none;
		}
	}
</style>
