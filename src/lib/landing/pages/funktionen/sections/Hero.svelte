<!--
  The hero (.pg-hero): pill, H1, lead and two CTAs on the left, the example
  consumption card on the right. The card's segmented control switches the
  series: the bars grow (CSS) and the number tweens up from 0, as in the
  design. On load nothing animates: the hero is in view, and the server
  already renders Heizung (plan 03 §3.1).
-->
<script lang="ts">
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import { tweenNumber } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import { chart, hero, type SeriesKey } from "../content";

	let key = $state<SeriesKey>("hz");
	const series = $derived(chart.series.find((s) => s.key === key)!);
	const max = $derived(Math.max(...series.values));
	const target = $derived(series.values[chart.current]);

	let shown = $state(chart.series[0].values[chart.current]);
	let first = true;
	$effect(() => {
		const to = target;
		if (first) {
			first = false;
			return;
		}
		return tweenNumber(0, to, 900, (v) => (shown = v));
	});

	const format = (value: number, decimals: number) =>
		value.toLocaleString("de-DE", {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		});

	const options = chart.series.map((s) => ({ value: s.key, label: s.label }));
	const monthValues = $derived(
		series.values
			.slice(0, chart.current + 1)
			.map((v) => format(v, series.decimals))
			.join(", "),
	);
</script>

<section class="hero" aria-labelledby="fk-h1">
	<div class="wrap grid">
		<div>
			<span class="pill rv"><Icon name={hero.eyebrowIcon} />{hero.eyebrow}</span
			>
			<h1 data-hs class="rv" id="fk-h1">
				{hero.h1.text}<em>{hero.h1.accent}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
			<div class="ctas rv">
				<a class="btn-dark" href={hero.primary.href}
					>{hero.primary.text} <span class="ar" aria-hidden="true">→</span></a
				>
				<a class="btn-ghost" href={hero.secondary.href}
					>{hero.secondary.text} <span class="ar" aria-hidden="true">→</span></a
				>
			</div>
		</div>

		<figure class="dash rv" aria-labelledby="fk-dash-h">
			<div class="dh">
				<span>
					<b id="fk-dash-h">{chart.title}</b>
					<small>{chart.sub}</small>
				</span>
				<span class="tag">{chart.tag}</span>
			</div>
			<Segmented {options} bind:value={key} label={chart.label} />
			<p class="kpi">
				<b>{format(shown, series.decimals)}</b>
				<span>{series.unit}</span>
				<em>{series.delta}</em>
			</p>
			<p class="sr-only">
				Monatswerte {chart.range} in {series.unit}: {monthValues}
			</p>
			<div class="ch" aria-hidden="true">
				{#each series.values as value, i (i)}
					<i
						class={[i === chart.current && "cur"]}
						style:--h="{(value / max) * 100}%"
					></i>
				{/each}
			</div>
			<div class="ax" aria-hidden="true">
				{#each chart.axis as month (month)}<span>{month}</span>{/each}
			</div>
		</figure>
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 560px);
		gap: 64px;
		align-items: center;
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
	}
	/* `.grid h1`: beats the landing reset of heading margins. */
	.grid h1 {
		font-size: clamp(38px, 4.8vw, 64px);
		line-height: 1.03;
		letter-spacing: -0.04em;
		font-weight: 500;
		margin-top: 22px;
		text-wrap: balance;
	}
	.grid h1 em {
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
	.ctas {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-top: 32px;
	}
	.btn-dark,
	.btn-ghost {
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
	.btn-dark {
		background: var(--ink);
		color: #fff;
		padding: 14px 20px;
	}
	.btn-dark:hover {
		background: #2a443d;
	}
	.btn-dark:active {
		transform: scale(0.98);
	}
	.btn-ghost {
		border: 1px solid var(--hair);
		background: #fff;
		color: var(--ink);
		padding: 13px 18px;
	}
	.btn-ghost:hover {
		border-color: #c3cdc8;
	}
	.ar {
		transition: transform 0.25s;
	}
	.btn-dark:hover .ar,
	.btn-ghost:hover .ar {
		transform: translateX(4px);
	}

	.dash {
		margin: 0;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 22px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.35);
	}
	.dh {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
		margin-bottom: 16px;
	}
	.dh b {
		display: block;
		font-size: 15.5px;
		font-weight: 600;
	}
	.dh small {
		display: block;
		font-size: 13px;
		color: var(--muted);
		margin-top: 2px;
	}
	.tag {
		display: inline-flex;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	.kpi {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin-top: 22px;
		flex-wrap: wrap;
	}
	.kpi b {
		font-size: 44px;
		font-weight: 500;
		letter-spacing: -0.04em;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}
	.kpi span {
		font-size: 15px;
		color: var(--muted);
	}
	.kpi em {
		font-style: normal;
		font-size: 12.5px;
		font-weight: 600;
		color: #245f33;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		margin-left: auto;
	}
	.ch {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 150px;
		margin-top: 20px;
		border-bottom: 1px solid var(--hair);
	}
	.ch i {
		flex: 1;
		height: var(--h, 0%);
		background: #1e322d;
		border-radius: 5px 5px 0 0;
		transition:
			height 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.4s;
	}
	.ch i.cur {
		background: var(--accent);
	}
	.ax {
		display: flex;
		justify-content: space-between;
		font-size: 11.5px;
		color: var(--faint);
		margin-top: 8px;
	}

	@media (max-width: 1040px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 44px;
		}
	}
	@media (max-width: 720px) {
		.kpi em {
			margin-left: 0;
		}
	}
	@media (max-width: 640px) {
		.hero {
			padding: 44px 0 60px;
		}
		.ctas {
			flex-direction: column;
		}
		.btn-dark,
		.btn-ghost {
			justify-content: center;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ch i {
			transition: none;
		}
	}
</style>
