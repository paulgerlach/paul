<!--
  The preview's enlarged chart (`.hd-modal`): a tile's chart at full size with
  its summary, over the preview. Closes on the button, Escape or a click on
  the backdrop; focus returns to the tile (plan 03, 3A.5).
-->
<script lang="ts">
	import { de, formatNumber } from "../chart";
	import Icon from "../components/Icon.svelte";
	import BarChart from "./charts/BarChart.svelte";
	import ForecastChart from "./charts/ForecastChart.svelte";
	import LineChart from "./charts/LineChart.svelte";
	import type { SeriesKey } from "./data";
	import { getDemo, type TileKey } from "./demo.svelte";
	import {
		chartValues,
		describeChart,
		forecast,
		pointLabel,
		series,
		tileSummary,
	} from "./model";

	const TILES: Record<
		TileKey,
		{
			title: string;
			unit: string;
			color: string;
			kind: "line" | "track" | "prog";
		}
	> = {
		kalt: { title: "Kaltwasser", unit: "m³", color: "#5B78C9", kind: "line" },
		warm: { title: "Warmwasser", unit: "m³", color: "#E07A6E", kind: "line" },
		heiz: {
			title: "Heizvolumen",
			unit: "kWh",
			color: "#AFBDE3",
			kind: "track",
		},
		hk: {
			title: "Heizkörper",
			unit: "Einheiten",
			color: "#AFBDE3",
			kind: "track",
		},
		prog: {
			title: "Verbrauchsprognose",
			unit: "MWh",
			color: "#5B78C9",
			kind: "prog",
		},
	};

	const demo = getDemo();
	const key = $derived(demo.dialogTile);
	const s = $derived(demo.chartState);
</script>

{#if key}
	{@const tile = TILES[key]}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="modal"
		onclick={(event) => {
			if (event.target === event.currentTarget) demo.closeLayer();
		}}
	>
		<div
			class="box"
			role="dialog"
			aria-modal="false"
			aria-labelledby="hd-dialog-h"
		>
			<button
				type="button"
				class="x"
				aria-label="Schließen"
				onclick={() => demo.closeLayer()}><Icon name="close" /></button
			>
			<div class="mh">
				<h4 id="hd-dialog-h" tabindex="-1" {@attach (el) => el.focus()}>
					{tile.title}
				</h4>
				<span class="mut"
					>{demo.scoped?.name ?? "Alle Objekte"} · {demo.period.label}</span
				>
			</div>
			{#if key !== "prog"}
				{@const k = key as SeriesKey}
				{@const sum = tileSummary(k, s)}
				<div class="mst">
					<div>
						<small>Summe</small><b>{formatNumber(sum.sum)} {tile.unit}</b>
					</div>
					<div>
						<small>Ø pro Monat</small><b>{formatNumber(sum.mean)} {tile.unit}</b
						>
					</div>
					{#if sum.delta !== null}
						<div>
							<small>Zum Vorjahr</small><b class={sum.delta < 0 ? "dn" : "up"}
								>{sum.delta < 0 ? "−" : "+"}{de(
									Math.abs(sum.delta),
									1,
								)}&nbsp;%</b
							>
						</div>
					{/if}
				</div>
			{/if}
			<div class="big">
				{#if tile.kind === "prog"}
					{@const fc = forecast(s)}
					<ForecastChart {...fc} label="Verbrauchsprognose" draw={1} />
				{:else}
					{@const k = key as SeriesKey}
					{@const labels = series(k, s).labels}
					{@const label = describeChart(
						tile.title,
						tile.unit,
						series(k, s).values,
						labels,
						s,
					)}
					{#if tile.kind === "line"}
						<LineChart
							values={chartValues(k, s)}
							previous={demo.previousYear[k as "kalt" | "warm"] &&
							s.period.year === 2026
								? chartValues(k, s, true, 3)
								: undefined}
							{labels}
							color={tile.color}
							unit={tile.unit}
							{label}
							pointLabel={(i) => pointLabel(i, labels, s)}
							draw={1}
						/>
					{:else}
						<BarChart
							values={chartValues(k, s)}
							{labels}
							color={tile.color}
							unit={tile.unit}
							{label}
							pointLabel={(i) => pointLabel(i, labels, s)}
							monthly={s.granularity === "m"}
							draw={1}
						/>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal {
		position: absolute;
		inset: 0;
		background: rgba(30, 50, 45, 0.28);
		backdrop-filter: blur(2px);
		display: grid;
		place-items: center;
		padding: 24px;
		z-index: 40;
		border-radius: 16px;
		animation: fade 0.2s;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
	.box {
		position: relative;
		width: min(820px, 100%);
		background: #fff;
		border-radius: 16px;
		padding: 24px 26px 20px;
		box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.45);
	}
	.x {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 30px;
		height: 30px;
		border: 0;
		border-radius: 8px;
		background: #f2f4f2;
		display: grid;
		place-items: center;
		cursor: pointer;
	}
	.x :global(svg) {
		width: 14px;
		height: 14px;
	}
	.mh {
		display: flex;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
	}
	.box h4 {
		font-size: 19px;
		font-weight: 500;
		margin: 4px 40px 8px 0;
		outline: none;
	}
	.mst {
		display: flex;
		gap: 28px;
		margin: 12px 0 6px;
		flex-wrap: wrap;
	}
	.mst small {
		display: block;
		font-size: 11.5px;
		color: var(--muted);
	}
	.mst b {
		font-size: 20px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.dn {
		color: var(--ok);
	}
	.up {
		color: var(--orange);
	}
	.big {
		position: relative;
		height: 340px;
		margin-top: 8px;
	}
	@media (max-width: 640px) {
		.modal {
			padding: 10px;
			align-items: start;
		}
		.box {
			padding: 18px 14px;
		}
		.big {
			height: 260px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.modal {
			animation: none;
		}
	}
</style>
