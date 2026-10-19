<!--
  Hero (.pg-hero.ink, dark): the pill, H1, lead, the two CTAs, three ticks
  and the preview card (.mv-peek, hidden from screen readers like the
  design). The preview is rendered finished; its ticks pop in one by one and
  "8 / 8" fades in through CSS animations with a `both` fill from the first
  paint (the design starts them when the card shows, which in the hero is
  at load). No `#start`: that's the signup form in the closing card.
-->
<script lang="ts">
	import { DEMO_HREF, focusSignup } from "$lib/landing/cta";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import Icon from "../components/Icon.svelte";
	import { hero } from "../content";

	const { peek } = hero;
</script>

<section class="hero" aria-labelledby="mv-h1">
	<div class="wrap cols">
		<div>
			<span class="pill rv"><Icon name="swap" />{hero.pill}</span>
			<h1 data-hs class="rv" id="mv-h1">
				{hero.h1} <em>{hero.h1Accent}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
			<div class="ctas rv">
				<a class="bk-next inv start" href={hero.start.href}
					>{hero.start.text} <span class="ar" aria-hidden="true">↓</span></a
				>
				<a
					class="pg-ghost ghost"
					href={hero.demo.href}
					onclick={hero.demo.href === DEMO_HREF ? focusSignup : undefined}
					>{hero.demo.text} <span class="ar" aria-hidden="true">→</span></a
				>
			</div>
			<ul class="ticks rv">
				{#each hero.ticks as tick (tick)}
					<li><span class="tk"><Check /></span>{tick}</li>
				{/each}
			</ul>
		</div>
		<div class="peek rv" aria-hidden="true">
			<div class="ph">
				<span></span>
				<span>{peek.you}</span>
				<span class="h"
					>{peek.heidi}
					<svg viewBox="0 0 14 14"
						><rect
							x="1"
							y="2"
							width="3"
							height="10"
							rx="1.5"
							fill="#1E322D"
						/><rect
							x="5.5"
							y="2"
							width="3"
							height="10"
							rx="1.5"
							fill="#1E322D"
						/><rect
							x="10"
							y="2"
							width="3"
							height="10"
							rx="1.5"
							fill="#1E322D"
						/></svg
					></span
				>
			</div>
			{#each peek.rows as row, i (row)}
				<div class="pr" style:--i={i}>
					<span>{row}</span>
					<i class="q">?</i>
					<i class="y"><Icon name="tick" /></i>
				</div>
			{/each}
			<div class="pf" style:--i={peek.rows.length}>
				<span>{peek.result}</span>
				<b class="q">{peek.unknown}</b>
				<b class="y">{peek.full}</b>
			</div>
		</div>
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
	/* .pg-pill-d */
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
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	/* #pillfx */
	.pill:hover :global(svg) {
		transform: scale(1.12);
	}
	/* `.cols h1`: beats the landing reset of heading margins. .pg-h1.mv-h1 */
	.cols h1 {
		font-size: clamp(38px, 4.6vw, 62px);
		line-height: 1.03;
		letter-spacing: -0.04em;
		font-weight: 500;
		margin-top: 22px;
		text-wrap: balance;
	}
	h1 em {
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
	/* .pg-ctas .bk-next */
	.ctas .start {
		padding: 14px 20px;
	}
	/* .pg-hero.ink .pg-ghost */
	.ctas .ghost {
		background: transparent;
		color: #fff;
		border-color: rgba(255, 255, 255, 0.24);
	}
	.ctas .ghost:hover {
		border-color: rgba(255, 255, 255, 0.5);
	}
	.ghost .ar {
		transition: transform 0.25s;
	}
	.ticks {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 22px;
		/* The design keeps the list's default bottom margin. */
		margin: 28px 0 1em;
		font-size: 14.5px;
		color: rgba(255, 255, 255, 0.72);
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
		background: rgba(138, 214, 143, 0.18);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.tk :global(svg) {
		width: 10px;
	}
	.tk :global(path) {
		stroke: var(--accent);
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* The preview (.mv-peek) */
	.peek {
		background: #fff;
		color: var(--ink);
		border-radius: 22px;
		padding: 10px 22px 18px;
		box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.5);
	}
	.ph,
	.pr,
	.pf {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 92px 92px;
		align-items: center;
		gap: 8px;
	}
	.ph {
		padding: 12px 0;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--muted);
		border-bottom: 1px solid var(--hair);
	}
	.ph span {
		text-align: center;
	}
	.ph .h {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		color: var(--ink);
	}
	.ph .h svg {
		width: 14px;
		height: 12px;
	}
	.pr {
		padding: 13px 0;
		border-bottom: 1px solid #eff2f0;
		font-size: 15px;
		font-weight: 500;
	}
	.pr i {
		justify-self: center;
		width: 30px;
		height: 30px;
		border-radius: 9px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-style: normal;
		font-weight: 700;
		font-size: 14px;
	}
	.pr i.q {
		background: #f1f3f2;
		color: #a3ada9;
	}
	.pr i.y {
		background: var(--accent);
		color: var(--ink);
		/* The design's transition (transform .35s with the overshoot,
		   opacity .3s) at 300 ms + 260 ms per row. */
		animation:
			mv-pop 0.35s cubic-bezier(0.3, 1.6, 0.5, 1) both,
			mv-show 0.3s both;
		animation-delay: calc(300ms + var(--i) * 260ms);
	}
	.pr i.y :global(svg) {
		width: 15px;
		height: 15px;
	}
	@keyframes mv-pop {
		from {
			transform: scale(0);
		}
	}
	@keyframes mv-show {
		from {
			opacity: 0;
		}
	}
	.pf {
		padding: 14px 0 0;
		font-size: 14px;
		color: var(--muted);
	}
	.pf b {
		text-align: center;
		font-size: 20px;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}
	.pf b.q {
		color: #a3ada9;
	}
	.pf b.y {
		color: var(--ink);
		animation: mv-show 0.4s both;
		animation-delay: calc(300ms + var(--i) * 260ms);
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
		.ctas a {
			justify-content: center;
		}
		.ph,
		.pr,
		.pf {
			grid-template-columns: minmax(0, 1fr) 70px 70px;
		}
		.peek {
			padding: 6px 16px 16px;
		}
		.pr {
			font-size: 14px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
		.pr i.y,
		.pf b.y {
			animation: none;
		}
	}
</style>
