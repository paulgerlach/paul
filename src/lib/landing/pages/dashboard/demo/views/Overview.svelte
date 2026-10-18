<!--
  The preview's Dashboard view: the granularity switch, the scope chip and the
  eight tiles, all computed from the demo state (server-rendered in its
  default state; plan 02, 1b).
-->
<script lang="ts">
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import { de, type Granularity } from "../../chart";
	import Icon from "../../components/Icon.svelte";
	import BarChart from "../charts/BarChart.svelte";
	import DataTable from "../charts/DataTable.svelte";
	import ForecastChart from "../charts/ForecastChart.svelte";
	import LineChart from "../charts/LineChart.svelte";
	import { METER_TYPE_KEYS, METER_TYPES, type SeriesKey } from "../data";
	import { getDemo } from "../demo.svelte";
	import {
		canShowPreviousYear,
		chartValues,
		describeChart,
		forecast,
		pointLabel,
		series,
	} from "../model";
	import Tile from "../Tile.svelte";

	const demo = getDemo();

	const GRANULARITY: { value: Granularity; label: string }[] = [
		{ value: "d", label: "Täglich" },
		{ value: "w", label: "Wöchentlich" },
		{ value: "m", label: "Monatlich" },
	];

	const s = $derived(demo.chartState);
	const labels = $derived(series("kalt", s).labels);
	const previousAllowed = $derived(canShowPreviousYear(s));
	const point = (i: number) => pointLabel(i, labels, s);
	const values = (key: SeriesKey) => chartValues(key, s);
	const previous = (key: "kalt" | "warm") =>
		demo.previousYear[key] && previousAllowed
			? chartValues(key, s, true, 3)
			: undefined;
	const describe = (title: string, key: SeriesKey, unit: string) =>
		describeChart(title, unit, series(key, s).values, labels, s);
	const fc = $derived(forecast(s));

	const lines = [
		{ key: "kalt", title: "Kaltwasser", color: "#5B78C9", icon: "tap" },
		{ key: "warm", title: "Warmwasser", color: "#E07A6E", icon: "tapHot" },
	] as const;
</script>

<div class="bar0">
	<Segmented
		class="gran"
		label="Auflösung"
		options={GRANULARITY}
		bind:value={() => demo.granularity, (v) => demo.setGranularity(v)}
	/>
	{#if demo.scoped}
		<span class="scope">
			{demo.scoped.name}
			<button
				type="button"
				aria-label="Filter entfernen"
				onclick={() => demo.setScope(null)}>×</button
			>
		</span>
	{/if}
	<label class="tg-s">
		<input type="checkbox" role="switch" bind:checked={demo.dataView} />
		<i aria-hidden="true"></i>Datenansicht
	</label>
	<span class="demo-badge">Beispieldaten</span>
</div>

<div class="grid">
	{#each lines as line (line.key)}
		<Tile
			title={line.title}
			icon={line.icon}
			onexpand={(t) => demo.openTile(line.key, t)}
		>
			{#snippet legend()}
				<i class="sw" style:background={line.color}></i>m³
				<button
					type="button"
					class="py"
					aria-pressed={demo.previousYear[line.key] && previousAllowed}
					disabled={!previousAllowed}
					onclick={() =>
						(demo.previousYear[line.key] = !demo.previousYear[line.key])}
				>
					<i class="dash" style:border-color={line.color}></i>Vorjahr
				</button>
			{/snippet}
			{#if demo.dataView}
				<DataTable
					caption={line.title}
					{labels}
					values={series(line.key, s).values}
					previous={previousAllowed
						? series(line.key, s, true).values
						: undefined}
					year={s.period.year}
					unit="m³"
				/>
			{:else}
				<LineChart
					values={values(line.key)}
					previous={previous(line.key)}
					{labels}
					color={line.color}
					unit="m³"
					label={describe(line.title, line.key, "m³")}
					pointLabel={point}
					draw={demo.drawId}
				/>
			{/if}
		</Tile>
	{/each}

	<Tile title="Status" icon="check">
		{#snippet badge()}
			<span class="badge-ok" aria-label="Alles in Ordnung"
				><Icon name="check" /></span
			>
		{/snippet}
		<div class="st">
			{#each METER_TYPE_KEYS as type (type)}
				<button
					type="button"
					class="s"
					onclick={(event) => demo.openAlert(type, event.currentTarget)}
				>
					<span class="i1"><Icon name={METER_TYPES[type].icon} /></span>
					<span class="i2"><Icon name="check" /></span>
					<span class="tx">
						<b>{de(demo.counts[type])} {METER_TYPES[type].label}</b>
						<small>In Ordnung · heute übertragen</small>
					</span>
				</button>
			{/each}
		</div>
	</Tile>

	<Tile
		title="Heizvolumen"
		icon="radiator"
		onexpand={(t) => demo.openTile("heiz", t)}
	>
		{#snippet legend()}<i class="sw" style:background="#AFBDE3"
			></i>kWh{/snippet}
		{#if demo.dataView}
			<DataTable
				caption="Heizvolumen"
				{labels}
				values={series("heiz", s).values}
				previous={previousAllowed ? series("heiz", s, true).values : undefined}
				year={s.period.year}
				unit="kWh"
			/>
		{:else}
			<BarChart
				values={values("heiz")}
				{labels}
				color="#AFBDE3"
				unit="kWh"
				label={describe("Heizvolumen", "heiz", "kWh")}
				pointLabel={point}
				monthly={s.granularity === "m"}
				draw={demo.drawId}
			/>
		{/if}
	</Tile>

	<Tile title="Einsparung" icon="globe">
		<div class="co2">
			<b>{de(demo.co2.value, 1)}</b>
			<span>t CO₂</span>
			<small>{demo.co2.sub}</small>
		</div>
	</Tile>

	<Tile title="Heizkörper" icon="hkv" onexpand={(t) => demo.openTile("hk", t)}>
		{#snippet legend()}<i class="sw" style:background="#AFBDE3"
			></i>Verbrauchseinheiten{/snippet}
		{#if demo.dataView}
			<DataTable
				caption="Heizkörper"
				{labels}
				values={series("hk", s).values}
				previous={previousAllowed ? series("hk", s, true).values : undefined}
				year={s.period.year}
				unit="Einheiten"
			/>
		{:else}
			<BarChart
				values={values("hk")}
				{labels}
				color="#AFBDE3"
				unit="Einheiten"
				label={describe("Heizkörper", "hk", "Verbrauchseinheiten")}
				pointLabel={point}
				monthly={s.granularity === "m"}
				draw={demo.drawId}
			/>
		{/if}
	</Tile>

	<Tile
		title="Verbrauchsprognose"
		icon="chart"
		onexpand={(t) => demo.openTile("prog", t)}
	>
		{#snippet legend()}
			<i class="sw line" style:background="#5B78C9"></i>Ist
			<i class="sw dot"></i>Prognose
			<i class="sw" style:background="#E4E8F2"></i>Unsicherheit
		{/snippet}
		{#if demo.dataView}
			<DataTable
				caption="Verbrauchsprognose"
				{labels}
				values={series("heiz", s).values}
				previous={previousAllowed ? series("heiz", s, true).values : undefined}
				year={s.period.year}
				unit="kWh"
			/>
		{:else}
			<ForecastChart
				{...fc}
				label={fc.full
					? `Verbrauchsprognose 2025: Ist-Werte Jan bis Dez`
					: `Verbrauchsprognose 2026: Ist-Werte Jan bis Okt, Prognose bis Dez ${de(fc.low.at(-1) ?? 0)} bis ${de(fc.high.at(-1) ?? 0)} MWh`}
				draw={demo.drawId}
			/>
		{/if}
	</Tile>

	<Tile title={demo.perObject.title} icon="chart" wide>
		{#snippet legend()}
			<i class="sw" style:background="#AFBDE3"></i>Kaltwasser
			<i class="sw" style:background="#F3B8B0"></i>Warmwasser
			<span class="u">m³/WE</span>
		{/snippet}
		<ul class="we">
			{#each demo.perObject.rows as row (row.name)}
				{@const bars = `Kaltwasser ${de(row.cold, 1)} · Warmwasser ${de(row.warm, 1)} m³/WE`}
				<li>
					{#if row.object}
						{@const id = row.object}
						<button
							type="button"
							class="r"
							title={bars}
							onclick={() => demo.setScope(id)}
						>
							{@render rowBody(row.name, row.cold, row.warm)}
						</button>
					{:else}
						<div class="r" title={bars}>
							{@render rowBody(row.name, row.cold, row.warm)}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</Tile>
</div>

{#snippet rowBody(name: string, cold: number, warm: number)}
	<span class="n">{name}</span>
	<span class="tr" aria-hidden="true">
		<i class="k" style:width="{(cold / 90) * 100}%"></i>
		<i class="w" style:width="{(warm / 90) * 100}%"></i>
	</span>
	<b>{de(cold + warm, 1)}</b>
{/snippet}

<style>
	.bar0 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin: 2px 0 14px;
	}
	.bar0 :global(.seg.gran) {
		display: flex;
		gap: 4px;
	}
	.bar0 :global(.seg.gran button) {
		font-size: 12.5px;
		font-weight: 500;
		color: var(--ink);
		padding: 7px 11px;
		border-radius: 6px;
	}
	.bar0 :global(.seg.gran button:hover) {
		background: #e9ebe8;
	}
	.bar0 :global(.seg.gran button.on) {
		background: var(--accent);
	}
	.scope {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: var(--ink);
		color: #fff;
		font-size: 12px;
		font-weight: 500;
		border-radius: 999px;
		padding: 4px 6px 4px 12px;
		margin-left: auto;
		margin-right: 8px;
	}
	.scope button {
		border: 0;
		background: rgba(255, 255, 255, 0.15);
		color: #fff;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		cursor: pointer;
		line-height: 1;
		font-size: 13px;
		padding: 0;
	}
	.demo-badge {
		margin-left: auto;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	.scope ~ .demo-badge {
		margin-left: 0;
	}
	/* The top bar hides its switch below 820 px; it moves here (plan 03, 3A.8). */
	.tg-s {
		display: none;
		align-items: center;
		gap: 7px;
		font-size: 12px;
		cursor: pointer;
		position: relative;
		white-space: nowrap;
	}
	.tg-s input {
		position: absolute;
		opacity: 0;
		width: 30px;
		height: 18px;
		margin: 0;
	}
	.tg-s i {
		width: 30px;
		height: 18px;
		border-radius: 999px;
		background: #e3e6e3;
		position: relative;
		box-shadow: inset 0 0 0 1px #d5dad7;
	}
	.tg-s i::after {
		content: "";
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: transform 0.25s;
	}
	.tg-s input:checked + i {
		background: var(--accent);
	}
	.tg-s input:checked + i::after {
		transform: translateX(12px);
	}
	.tg-s input:focus-visible + i {
		outline: 2px solid var(--accent-deep);
		outline-offset: 2px;
	}
	@media (max-width: 820px) {
		.tg-s {
			display: inline-flex;
		}
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
		background: #e9eae7;
		border-radius: 16px;
		padding: 12px;
	}
	.sw {
		width: 9px;
		height: 9px;
		border-radius: 2.5px;
		display: inline-block;
	}
	.sw + .sw,
	.sw.dot {
		margin-left: 10px;
	}
	.sw.line {
		height: 3px;
	}
	.sw.dot {
		width: 12px;
		height: 0;
		border-top: 2px dotted #5b78c9;
		border-radius: 0;
	}
	.u {
		position: absolute;
		right: 0;
		color: var(--muted);
	}
	.py {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 999px;
		padding: 1px 8px;
		font-size: 10.5px;
		color: var(--muted);
		cursor: pointer;
		margin-left: 8px;
	}
	.py .dash {
		width: 12px;
		height: 0;
		border-top: 1.6px dashed;
		display: inline-block;
	}
	.py[aria-pressed="true"] {
		background: #eef3f0;
		color: var(--ink);
		border-color: #cfe0d4;
	}
	.py:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.badge-ok {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #3e9a57;
		color: #fff;
		display: grid;
		place-items: center;
	}
	.badge-ok :global(svg) {
		width: 12px;
		height: 12px;
	}
	.st {
		display: grid;
		gap: 6px;
	}
	.s {
		display: flex;
		align-items: center;
		gap: 7px;
		border: 0;
		background: none;
		text-align: left;
		width: 100%;
		color: inherit;
		border-radius: 9px;
		padding: 2px;
		cursor: pointer;
		transition: background 0.2s;
	}
	.s:hover {
		background: #f0f2ef;
	}
	.i1,
	.i2 {
		width: 34px;
		height: 34px;
		border-radius: 7px;
		display: grid;
		place-items: center;
		flex: none;
	}
	.i1 {
		background: #e6e8e5;
	}
	.i1 :global(svg) {
		width: 17px;
		height: 17px;
	}
	.i2 {
		background: #ddf0de;
		color: #3e9a57;
	}
	.i2 :global(svg) {
		width: 16px;
		height: 16px;
	}
	.tx {
		min-width: 0;
		flex: 1;
		overflow: hidden;
	}
	.tx b {
		display: block;
		font-weight: 400;
		font-size: 12.5px;
		color: #4a5753;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.tx small {
		display: block;
		font-size: 9.5px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #2f7a3c;
	}
	.co2 {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #56627e;
		text-align: center;
	}
	.co2 b {
		font-size: 44px;
		font-weight: 300;
		letter-spacing: -0.02em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.co2 span {
		font-size: 18px;
		font-weight: 300;
		margin-top: 4px;
	}
	.co2 small {
		font-size: 11px;
		color: var(--muted);
		margin-top: 8px;
	}
	.we {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
		display: grid;
		gap: 9px;
	}
	.r {
		display: grid;
		grid-template-columns: 96px minmax(0, 1fr) 34px;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		width: 100%;
		border: 0;
		background: none;
		padding: 0;
		text-align: left;
		color: inherit;
	}
	button.r {
		cursor: pointer;
	}
	.n {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #3e4f4a;
	}
	button.r:hover .n {
		color: var(--ink);
		text-decoration: underline;
	}
	.tr {
		height: 12px;
		border-radius: 6px;
		background: #f1f2f0;
		display: flex;
		overflow: hidden;
	}
	button.r:hover .tr {
		box-shadow: 0 0 0 2px #e1e6f3;
	}
	.k {
		background: #afbde3;
	}
	.w {
		background: #f3b8b0;
	}
	.r b {
		font-weight: 500;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	@media (max-width: 1120px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
			padding: 8px;
			gap: 8px;
		}
		.bar0 {
			flex-wrap: wrap;
		}
	}
</style>
