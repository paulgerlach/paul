<!-- Hero (.pg-hero, light): pill, H1, lead, three ticks, the step line and the tool. No `#start`: that's the signup form in the closing card; the tool is `#checker`. -->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import Icon from "../components/Icon.svelte";
	import { hero } from "../content";
	import Tool from "./Tool.svelte";
</script>

<section class="hero" aria-labelledby="pc-h1">
	<div class="wrap cols">
		<div>
			<span class="pill rv"><Icon name="search" />{hero.pill}</span>
			<h1 data-hs class="rv" id="pc-h1">
				{hero.h1} <em>{hero.h1Accent}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
			<ul class="ticks rv">
				{#each hero.ticks as tick (tick)}
					<li><span class="tk"><Check /></span>{tick}</li>
				{/each}
			</ul>
			<div class="steps rv" aria-hidden="true">
				{#each hero.steps as step, i (step)}
					{#if i}<b></b>{/if}<span><i>{i + 1}</i>{step}</span>
				{/each}
			</div>
		</div>
		<Tool />
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
	}
	.cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 560px);
		gap: 64px;
		align-items: start;
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
	/* `.cols h1`: beats the landing reset of heading margins. */
	.cols h1 {
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
		max-width: 52ch;
		line-height: 1.55;
	}
	.ticks {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 22px;
		/* The design keeps the list's default bottom margin. */
		margin: 28px 0 1em;
		font-size: 14.5px;
		color: var(--muted);
		list-style: none;
		padding: 0;
	}
	.ticks li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.tk {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #e3f3e4;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.tk :global(svg) {
		width: 10px;
	}
	/* .pc-steps */
	.steps {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 30px;
		flex-wrap: wrap;
		font-size: 13px;
		color: var(--muted);
	}
	.steps span {
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}
	.steps i {
		font-style: normal;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #eef4ef;
		color: #2f7a3c;
		display: grid;
		place-items: center;
		font-size: 11.5px;
		font-weight: 700;
	}
	.steps b {
		width: 18px;
		height: 1px;
		background: var(--hair);
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
	}
	@media (max-width: 560px) {
		.steps {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
	}
</style>
