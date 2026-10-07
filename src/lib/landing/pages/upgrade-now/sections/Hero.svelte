<!--
  Dark hero: pill, H1 with the time left, lede, countdown, CTAs, year band and
  three facts. After the deadline the H1 and lede switch to the expired texts
  and the countdown and year band are gone.
-->
<script lang="ts">
	import { START_HREF } from "$lib/landing/cta";
	import ArrowLink from "../components/ArrowLink.svelte";
	import { hero } from "../content";
	import { monthsText } from "../deadline";
	import { getDeadlineClock } from "../clock.svelte";
	import Countdown from "./Countdown.svelte";
	import YearBand from "./YearBand.svelte";

	const clock = getDeadlineClock();
	const timeLeft = $derived(monthsText(clock.today));
</script>

<section class="hero" aria-labelledby="um-h1">
	<div class="wrap hero-in">
		<span class="pill rv"><i class="live"></i>{hero.pill}</span>
		{#if clock.expired}
			<h1 class="rv" id="um-h1" data-placeholder="">{hero.expired.h1}</h1>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted content data -->
			<p class="lead rv" data-placeholder="">{@html hero.expired.lede}</p>
			<p class="over">{hero.expired.note}</p>
		{:else}
			<h1 class="rv" id="um-h1">
				{hero.h1Before} <em>{timeLeft}</em>
				{hero.h1After}
			</h1>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted content data -->
			<p class="lead rv">{@html hero.lede}</p>
			<Countdown />
		{/if}

		<div class="ctas rv">
			<ArrowLink href={START_HREF} label={hero.cta} />
			<a class="ghost" href="#risiko">
				{hero.ctaRisk} <span class="ar" aria-hidden="true">↓</span>
			</a>
		</div>

		{#if !clock.expired}<YearBand />{/if}

		<ul class="facts rv">
			{#each hero.facts as fact (fact)}
				<li>
					<svg viewBox="0 0 12 10" width="10" aria-hidden="true">
						<path
							d="M1 5l3.5 3.5L11 1"
							stroke-width="2"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>{fact}
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.hero {
		background: var(--ink);
		color: #fff;
		padding: 84px 0 72px;
		position: relative;
		overflow: hidden;
		text-align: center;
	}
	.hero-in {
		position: relative;
		display: flex;
		flex-direction: column;
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
	.live {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent);
		position: relative;
		flex: none;
	}
	.live::after {
		content: "";
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		border: 2px solid var(--accent);
		opacity: 0;
		animation: ping 2.2s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
	}
	@keyframes ping {
		0% {
			transform: scale(0.5);
			opacity: 0.7;
		}
		100% {
			transform: scale(1.9);
			opacity: 0;
		}
	}
	h1 {
		font-size: clamp(38px, 5.6vw, 76px);
		line-height: 1.02;
		letter-spacing: -0.045em;
		font-weight: 500;
		margin-top: 24px;
		max-width: 17ch;
		text-wrap: balance;
	}
	h1 em {
		font-style: normal;
		color: var(--accent);
		white-space: nowrap;
	}
	.lead {
		color: rgba(255, 255, 255, 0.72);
		font-size: clamp(16px, 1.6vw, 20px);
		margin-top: 20px;
		max-width: 58ch;
		line-height: 1.5;
	}
	.lead :global(b) {
		color: #fff;
		font-weight: 600;
	}
	.over {
		margin-top: 20px;
		max-width: 56ch;
		color: #f6c9be;
		font-size: 16px;
	}
	.ctas {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 40px;
	}
	.ctas :global(.bk) {
		padding: 15px 22px;
	}
	.ghost {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: 1px solid rgba(255, 255, 255, 0.22);
		border-radius: 11px;
		padding: 14px 20px;
		font-size: 15.5px;
		font-weight: 600;
		color: #fff;
		transition:
			background 0.2s,
			border-color 0.2s;
	}
	.ghost:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.4);
	}
	.ghost .ar {
		transition: transform 0.25s;
	}
	.ghost:hover .ar {
		transform: translateY(3px);
	}
	.facts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px 28px;
		margin-top: 36px;
		font-size: 14.5px;
		color: rgba(255, 255, 255, 0.72);
		list-style: none;
		padding: 0;
	}
	.facts li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.facts svg {
		width: 14px;
		height: 12px;
	}
	.facts path {
		stroke: var(--accent);
	}
	@media (max-width: 640px) {
		.hero {
			padding: 52px 0 56px;
		}
		.ctas {
			flex-direction: column;
			align-items: stretch;
			width: 100%;
		}
		.ctas :global(.bk),
		.ghost {
			justify-content: center;
		}
		.pill {
			font-size: 12.5px;
			text-align: left;
		}
		.facts {
			flex-direction: column;
			align-items: center;
			gap: 8px;
		}
	}
</style>
