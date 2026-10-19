<!--
  Hero (.pg-hero, light, top-aligned): pill, H1, lead, three ticks, the
  "2 von 3" note and the check card. It's `#checker` (the design's `#start`,
  where "Eigene Abrechnung prüfen" lands); `#start` is the closing form.
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import Icon from "../components/Icon.svelte";
	import { CHECKER_ID, hero } from "../content";
	import Checker from "./Checker.svelte";
</script>

<section class="hero" id={CHECKER_ID} aria-labelledby="mc-h1">
	<div class="wrap cols">
		<div>
			<span class="pill rv"><Icon name="person" />{hero.pill}</span>
			<h1 data-hs lang="de" class="rv" id="mc-h1">
				{hero.h1} <em>{hero.h1Accent}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
			<ul class="ticks rv">
				{#each hero.ticks as tick (tick)}
					<li><span class="tk"><Check /></span>{tick}</li>
				{/each}
			</ul>
			<p class="stat rv">
				{hero.stat.before}<b>{hero.stat.figure}</b>{hero.stat.after}
				<a href={hero.stat.link.href}>{hero.stat.link.text}</a>
			</p>
		</div>
		<Checker />
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
		scroll-margin-top: 72px;
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
	/* .pg-h1.mc-h1; the size stays below #hs-css's (the page's). */
	h1 {
		font-size: clamp(36px, 3.9vw, 56px);
		line-height: 1.03;
		letter-spacing: -0.04em;
		font-weight: 500;
		text-wrap: balance;
	}
	/* Beats the landing reset of heading margins. */
	.cols h1 {
		margin-top: 22px;
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
	/* .mc-hstat */
	.stat {
		margin-top: 30px;
		padding: 16px 18px;
		border: 1px solid var(--hair);
		border-radius: 14px;
		background: #fff;
		font-size: 14.5px;
		color: var(--muted);
		max-width: 52ch;
		line-height: 1.5;
	}
	.stat b {
		color: var(--ink);
	}
	.stat a {
		color: var(--ink);
		font-weight: 600;
		white-space: nowrap;
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
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
	}
</style>
