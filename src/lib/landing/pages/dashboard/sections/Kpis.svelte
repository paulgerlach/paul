<!--
  "Verstehen Sie Ihren Bestand auf einen Blick" (`.db-kpi`): three cards,
  Verbrauch with its sparkline, Kosten and Einsparung with month bars.
-->
<script lang="ts">
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import { de } from "../chart";
	import BarScrub from "../components/BarScrub.svelte";
	import Icon from "../components/Icon.svelte";
	import Pill from "../components/Pill.svelte";
	import { kpis } from "../content";
	import {
		co2,
		costs,
		MONTHS_LONG,
		MONTHS_SHORT,
		REST_PER_MONTH,
	} from "../kpi";

	const NB = " ";
	const { usage, costs: c, savings: sv } = kpis;

	// Verbrauch: the sparkline in a 300×120 box (the design's scale: 35–70)
	const spark = usage.spark
		.map(
			(y, i) =>
				`${((i * 300) / 11).toFixed(1)} ${(120 - ((y - 35) / 35) * 108).toFixed(1)}`,
		)
		.join(" L");

	// Kosten
	let costMode = $state<"all" | "heat">("all");
	let costMonth = $state(-1);
	const costValues = $derived(costMode === "all" ? costs.all : costs.heat);
	const costMax = Math.max(...costs.all);
	const costFigure = $derived(
		costMonth < 0
			? costMode === "all"
				? costs.allTotal
				: costs.heatTotal
			: costValues[costMonth],
	);
	const costCaption = $derived(
		costMonth < 0
			? `${c.caption[costMode]} ${costs.year}`
			: `${c.caption[costMode]} ${MONTHS_LONG[costMonth]}`,
	);

	// Einsparung
	let co2Mode = $state<"cum" | "mon">("cum");
	let co2Month = $state(-1);
	const co2Values = $derived(co2Mode === "cum" ? co2.cumulative : co2.monthly);
	const co2Max = $derived(Math.max(...co2Values));
	const co2Figure = $derived(
		co2Month < 0 ? de(co2.total, 1) : de(co2Values[co2Month], 2),
	);
	const co2Caption = $derived(
		co2Month < 0
			? sv.caption
			: `${sv.monthCaption[co2Mode]} ${MONTHS_LONG[co2Month]}`,
	);
</script>

<section class="sec kpi" aria-labelledby="kpi-h">
	<div class="wrap db-c">
		<Pill text={kpis.pill} icon="sparkle" class="rv" />
		<h2 class="db-h2 rv" id="kpi-h">{kpis.h2}</h2>
		<p class="db-lead rv">{kpis.lead}</p>
	</div>
	<div class="wrap">
		<ul class="k3">
			<li class="kc rv">
				<article aria-labelledby="kc1-h">
					<h3 class="hd" id="kc1-h"><Icon name="flame" />{usage.title}</h3>
					<p>{usage.text}</p>
					<div class="vz">
						<div>
							<span class="num">{usage.value}<small>{usage.unit}</small></span>
							<span class="delta">{usage.delta}</span>
						</div>
						<div class="spark" aria-hidden="true">
							<svg viewBox="0 0 300 120" preserveAspectRatio="none">
								<defs>
									<linearGradient id="kpi-spark-g" x1="0" x2="0" y1="0" y2="1">
										<stop offset="0" stop-color="#8AD68F" stop-opacity=".35" />
										<stop offset="1" stop-color="#8AD68F" stop-opacity="0" />
									</linearGradient>
								</defs>
								<path class="a" d="M{spark} L300 120 L0 120Z" />
								<path class="l" d="M{spark}" />
							</svg>
						</div>
					</div>
				</article>
			</li>

			<li class="kc rv">
				<article aria-labelledby="kc2-h">
					<h3 class="hd" id="kc2-h"><Icon name="euro" />{c.title}</h3>
					<p>{c.text}</p>
					<div class="vz ix">
						<div class="top">
							<span class="num">{de(costFigure, 2)}<small>{c.unit}</small></span
							>
							<span class="cap">{costCaption}</span>
							<Segmented
								class="kseg"
								label={c.modesLabel}
								options={c.modes as { value: "all" | "heat"; label: string }[]}
								bind:value={costMode}
							/>
						</div>
						<BarScrub
							values={costValues}
							parts={costs.heat}
							max={costMax}
							labels={MONTHS_SHORT}
							label={c.chartLabel}
							bind:active={costMonth}
							announce={costMonth < 0
								? ""
								: `${costCaption}: ${de(costValues[costMonth], 2)}${NB}${c.unit}`}
						>
							{#snippet tip(i)}
								<b>{MONTHS_LONG[i]} {costs.year}</b>
								<span
									><i class="d"></i>{c.tip.heat}<em
										>{de(costs.heat[i], 2)}{NB}{c.unit}</em
									></span
								>
								{#if costMode === "all"}
									<span
										><i class="l"></i>{c.tip.rest}<em
											>{de(REST_PER_MONTH, 2)}{NB}{c.unit}</em
										></span
									>
									<span class="t"
										>{c.tip.total}<em>{de(costs.all[i], 2)}{NB}{c.unit}</em
										></span
									>
								{/if}
							{/snippet}
						</BarScrub>
					</div>
				</article>
			</li>

			<li class="kc rv">
				<article aria-labelledby="kc3-h">
					<h3 class="hd" id="kc3-h"><Icon name="globe" />{sv.title}</h3>
					<p>{sv.text}</p>
					<div class="vz ix">
						<div class="top">
							<span class="num"
								><span class="co2">{co2Figure}</span><small>{sv.unit}</small
								></span
							>
							<span class="cap">{co2Caption}</span>
							<Segmented
								class="kseg"
								label={sv.modesLabel}
								options={sv.modes as { value: "cum" | "mon"; label: string }[]}
								bind:value={co2Mode}
							/>
						</div>
						<BarScrub
							values={co2Values}
							max={co2Max}
							labels={MONTHS_SHORT.slice(0, 9)}
							label={sv.chartLabel}
							tone="green"
							bind:active={co2Month}
							announce={co2Month < 0 ? "" : `${co2Caption}: ${co2Figure} t`}
						>
							{#snippet tip(i)}
								<b>{MONTHS_LONG[i]} {co2.year}</b>
								<span
									>{co2Mode === "cum" ? sv.tip.cum : sv.tip.mon}<em
										>{de(co2Values[i], 2)}{NB}t</em
									></span
								>
								{#if co2Mode === "cum"}
									<span class="t"
										>{sv.tip.ofWhich}<em>{de(co2.monthly[i], 2)}{NB}t</em></span
									>
								{/if}
							{/snippet}
						</BarScrub>
					</div>
				</article>
			</li>
		</ul>
	</div>
</section>

<style>
	.kpi {
		padding: 104px 0 0;
	}
	.k3 {
		list-style: none;
		margin: 56px 0 0;
		padding: 0 0 12px;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}
	.kc {
		background: #fafbfa;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 28px 28px 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition:
			background 0.3s,
			box-shadow 0.3s;
	}
	.kc:hover {
		background: #fff;
		box-shadow: 0 20px 40px -24px rgba(30, 50, 45, 0.25);
	}
	article {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.kc .hd {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 19px;
		font-weight: 500;
		letter-spacing: 0;
		border-left: 1px solid var(--hair);
		padding-left: 20px;
		margin-left: -4px;
	}
	.hd :global(svg) {
		width: 20px;
		height: 20px;
		color: var(--muted);
	}
	.kc p {
		color: var(--muted);
		margin: 10px 0 0 -4px;
		font-size: 16px;
		padding: 0 0 4px 20px;
		border-left: 1px solid var(--hair);
	}
	.vz {
		margin-top: 28px;
		height: 190px;
		position: relative;
	}
	.vz.ix {
		height: auto;
		min-height: 220px;
		display: flex;
		flex-direction: column;
		padding-bottom: 16px;
	}
	.num {
		font-size: 34px;
		font-weight: 600;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
	}
	.num small {
		font-size: 14px;
		color: var(--muted);
		font-weight: 500;
		margin-left: 6px;
		letter-spacing: 0;
	}
	.delta {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 12.5px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 2px 9px;
		margin-left: 8px;
		vertical-align: 6px;
	}
	.spark {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 120px;
	}
	.spark svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.spark .a {
		fill: url(#kpi-spark-g);
	}
	.spark .l {
		fill: none;
		stroke: var(--accent-deep);
		stroke-width: 2.2;
		vector-effect: non-scaling-stroke;
	}
	.top {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 12px;
		position: relative;
	}
	.cap {
		font-size: 13px;
		color: var(--muted);
		flex-basis: 100%;
		order: 3;
		margin-top: -2px;
		min-height: 18px;
	}
	.top :global(.seg.kseg) {
		margin-left: auto;
		align-self: center;
		border-radius: 9px;
	}
	.top :global(.seg.kseg button) {
		font-size: 12px;
		padding: 5px 9px;
		border-radius: 7px;
	}
	@media (max-width: 900px) {
		.k3 {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
