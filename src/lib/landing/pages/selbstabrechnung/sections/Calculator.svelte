<!--
  "So verteilen Sie die Heizkosten.": two sliders (costs, consumption share)
  and the split per flat after § 7 HeizkostenV (`distribution.ts`). The server
  renders the defaults; the row totals and the sum count to their new value
  (not with reduced motion), the bars grow with a CSS transition.
-->
<script lang="ts">
	import { untrack } from "svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { tweenNumber } from "$lib/landing/motion";
	import {
		formatDecimal,
		formatNumber,
	} from "$lib/landing/pages/upgrade-now/calculator";
	import Icon from "../components/Icon.svelte";
	import { calculator as t } from "../content";
	import { distribute } from "../distribution";

	const NB = " ";

	let costs = $state(t.costs.default);
	let share = $state(t.share.default);

	const result = $derived(
		distribute({ costs, sharePercent: share, flats: t.flats }),
	);

	// The numbers on screen, which follow `result` with a 350 ms count.
	let shownRows = $state(untrack(() => result.rows.map((r) => r.total)));
	let shownSum = $state(untrack(() => costs));

	$effect(() => {
		const targets = result.rows.map((r) => r.total);
		const sum = costs;
		const from = untrack(() => [...shownRows]);
		const fromSum = untrack(() => shownSum);
		const stops = [
			...targets.map((to, i) =>
				tweenNumber(from[i], to, 350, (v) => (shownRows[i] = v)),
			),
			tweenNumber(fromSum, sum, 350, (v) => (shownSum = v)),
		];
		return () => stops.forEach((stop) => stop());
	});

	const euro = (n: number) => `${formatNumber(n)}${NB}€`;
	const percent = (p: number, r: { min: number; max: number }) =>
		((p - r.min) / (r.max - r.min)) * 100;
	const ticks = Array.from(
		{ length: (t.share.max - t.share.min) / t.share.step + 1 },
		(_, i) => t.share.min + i * t.share.step,
	);
</script>

<section class="sec alt" id="rechner" aria-labelledby="calc-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="calc-h" eyebrow={t.pill} heading={t.h2}>
				{#snippet icon()}
					<rect x="4.5" y="2.5" width="11" height="15" rx="2" /><path
						d="M7.5 6h5M7.5 10h.01M10 10h.01M12.5 10h.01M7.5 13h.01M10 13h.01M12.5 13h.01"
					/>
				{/snippet}
			</SectionHead>
			<p class="lead rv">{t.lead}</p>
		</div>
		<div class="calc rv">
			<div class="in">
				<div class="f">
					<span
						><label for="r-k">{t.costs.label}</label><output for="r-k"
							>{euro(costs)}</output
						></span
					>
					<input
						id="r-k"
						type="range"
						min={t.costs.min}
						max={t.costs.max}
						step={t.costs.step}
						bind:value={costs}
						aria-valuetext={euro(costs)}
						style:--p="{percent(costs, t.costs)}%"
					/>
				</div>
				<div class="f">
					<span
						><label for="r-v">{t.share.label}</label><output for="r-v"
							>{share}{NB}%</output
						></span
					>
					<input
						id="r-v"
						type="range"
						min={t.share.min}
						max={t.share.max}
						step={t.share.step}
						bind:value={share}
						aria-valuetext="{share}{NB}%"
						style:--p="{percent(share, t.share)}%"
					/>
					<span class="ticks" aria-hidden="true">
						{#each ticks as tick (tick)}<i>{tick}{NB}%</i>{/each}
					</span>
				</div>
				<div class="split">
					<div>
						<small>{t.baseLabel}</small><b>{euro(result.base)}</b><em
							>{formatDecimal(result.perM2)}{NB}€/m²</em
						>
					</div>
					<div>
						<small>{t.consumptionLabel}</small><b>{euro(result.consumption)}</b
						><em>{formatDecimal(result.perUnit)}{NB}€/Einheit</em>
					</div>
				</div>
				<p class="hint"><Icon name="info" />{t.hint}</p>
			</div>
			<div class="out">
				<div class="oh">
					<b>{t.tableTitle}</b>
					<span class="leg" aria-hidden="true"
						><i class="g"></i>{t.legend.base}<i class="c"></i>{t.legend
							.consumption}</span
					>
				</div>
				<table>
					<caption class="sr-only">{t.caption}</caption>
					<thead>
						<tr>
							<th scope="col" class="c-flat">{t.columns.flat}</th>
							<th scope="col" class="c-area r hide-s">{t.columns.area}</th>
							<th scope="col" class="c-units r hide-s">{t.columns.units}</th>
							<th scope="col">{t.columns.bar}</th>
							<th scope="col" class="c-total r">{t.columns.total}</th>
						</tr>
					</thead>
					<tbody>
						{#each result.rows as row, i (row.id)}
							<tr>
								<th scope="row">{row.id}</th>
								<td class="r hide-s">{row.area}</td>
								<td class="r hide-s">{formatNumber(row.units)}</td>
								<td aria-hidden="true">
									<span class="bar"
										><i class="g" style:width="{(row.base / result.max) * 100}%"
										></i><i
											class="c"
											style:width="{(row.consumption / result.max) * 100}%"
										></i></span
									>
								</td>
								<td class="r tot">{euro(shownRows[i])}</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<th scope="row">{t.sum}</th>
							<td class="r hide-s">{result.totalArea}</td>
							<td class="r hide-s">{formatNumber(result.totalUnits)}</td>
							<td></td>
							<td class="r tot">{euro(shownSum)}</td>
						</tr>
					</tfoot>
				</table>
				<p class="foot">{t.foot}</p>
			</div>
		</div>
	</div>
</section>

<style>
	.sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.alt {
		background: var(--bg);
	}
	.head {
		max-width: 760px;
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	.calc {
		display: grid;
		grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
		gap: 20px;
		margin-top: 48px;
		align-items: stretch;
	}
	.in {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 30px;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}
	.f {
		display: block;
	}
	.f > span:first-child {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		margin-bottom: 12px;
	}
	.f label {
		font-size: 15px;
		font-weight: 600;
	}
	.f output {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: linear-gradient(90deg, var(--ink) var(--p), #d5dcd9 var(--p));
		outline: 0;
		margin: 8px 0 2px;
	}
	input[type="range"]:focus-visible {
		outline: 2px solid var(--accent-deep);
		outline-offset: 6px;
	}
	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid var(--ink);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
		cursor: pointer;
	}
	input[type="range"]::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid var(--ink);
		cursor: pointer;
	}
	.ticks {
		display: flex;
		justify-content: space-between;
		margin-top: 8px;
		font-size: 11.5px;
		color: var(--faint);
	}
	.ticks i {
		font-style: normal;
	}
	.split {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.split div {
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 14px;
		padding: 14px 16px;
	}
	.split div:last-child {
		background: var(--ink);
		border-color: var(--ink);
		color: #fff;
	}
	.split small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
	}
	.split div:last-child small {
		color: rgba(255, 255, 255, 0.6);
	}
	.split b {
		display: block;
		font-size: 24px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 6px;
		font-variant-numeric: tabular-nums;
	}
	.split em {
		display: block;
		font-style: normal;
		font-size: 13px;
		color: var(--muted);
		margin-top: 2px;
		font-variant-numeric: tabular-nums;
	}
	.split div:last-child em {
		color: var(--accent);
	}
	.hint {
		display: flex;
		gap: 10px;
		font-size: 13px;
		color: var(--muted);
		line-height: 1.5;
		margin-top: auto;
	}
	.hint :global(svg) {
		width: 16px;
		height: 16px;
		flex: none;
		margin-top: 2px;
		color: var(--faint);
	}
	.out {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 24px 26px;
		display: flex;
		flex-direction: column;
	}
	.oh {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--hair);
	}
	.oh b {
		font-size: 15px;
		font-weight: 600;
	}
	.leg {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 12.5px;
		color: var(--muted);
	}
	.leg i {
		width: 10px;
		height: 10px;
		border-radius: 3px;
		margin-left: 8px;
	}
	.g {
		background: #c9d6cf;
	}
	.c {
		background: var(--ink);
	}
	/* The design's 5-column grid rows, as a real table (fixed layout: the head cells set the widths) */
	table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		table-layout: fixed;
		font-size: 13.5px;
		font-variant-numeric: tabular-nums;
	}
	.c-flat {
		width: 100px;
	}
	.c-area {
		width: 64px;
	}
	.c-units {
		width: 76px;
	}
	.c-total {
		width: 96px;
	}
	th,
	td {
		padding: 12px 6px;
		border-bottom: 1px solid #eff2f0;
		text-align: left;
		vertical-align: middle;
		font-weight: 400;
		transition: background 0.2s;
	}
	th + th,
	th + td,
	td + td {
		padding-left: 12px;
	}
	thead th {
		font-size: 11.5px;
		color: var(--faint);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 12px 6px 8px;
	}
	thead th + th {
		padding-left: 12px;
	}
	tbody th {
		font-weight: 600;
	}
	tbody tr:hover > * {
		background: var(--bg);
	}
	tbody tr > :first-child {
		border-radius: 8px 0 0 8px;
	}
	tbody tr > :last-child {
		border-radius: 0 8px 8px 0;
	}
	.r {
		text-align: right;
	}
	.tot {
		font-weight: 600;
	}
	.bar {
		height: 12px;
		border-radius: 999px;
		background: #eef1ef;
		display: flex;
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	tfoot th,
	tfoot td {
		border-bottom: 0;
		font-weight: 600;
		padding-top: 14px;
	}
	.foot {
		font-size: 12.5px;
		color: var(--faint);
		margin-top: auto;
		padding-top: 14px;
	}

	@media (max-width: 1040px) {
		.calc {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.sec {
			padding: 72px 0;
		}
		.in,
		.out {
			padding: 22px 18px;
		}
		.split b {
			font-size: 20px;
		}
		.c-flat {
			width: 64px;
		}
		.c-total {
			width: 84px;
		}
		.hide-s {
			display: none;
		}
		th + th,
		th + td,
		td + td,
		thead th + th {
			padding-left: 10px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bar i {
			transition: none;
		}
	}
</style>
