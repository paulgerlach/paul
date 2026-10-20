<!--
  "Welche Liegenschaft fällt aus der Reihe?" (`.aw-2` + `.ac`): the text with
  its list beside the card comparing the seven properties for one metric,
  sorted by value, against the portfolio's average.
-->
<script lang="ts">
	import { de } from "$lib/landing/pages/dashboard/chart";
	import Split from "../components/Split.svelte";
	import {
		compare,
		METRIC_KEYS,
		metrics,
		period,
		properties,
		type MetricKey,
	} from "../content";
	import {
		average,
		deviation,
		ranks,
		scaleMax,
		share,
		signedPercent,
	} from "../metrics";

	const key: MetricKey = "heiz";
	const metric = $derived(metrics[key]);
	const max = $derived(scaleMax(metric.values, 1.08));
	const avg = $derived(average(metric.values));
	const rank = $derived(ranks(metric.values));
	const rows = $derived(
		properties.map((p, i) => {
			const dev = deviation(metric.values[i], avg);
			return {
				...p,
				value: de(metric.values[i], metric.digits),
				width: share(metric.values[i], max),
				dev: signedPercent(dev),
				high: dev > 0,
				shift: rank[i] - i,
			};
		}),
	);
</script>

<Split
	id="ac-h"
	pill={compare.pill}
	h2={compare.h2}
	text={compare.text}
	list={compare.list}
>
	{#snippet visual()}
		<div class="ac rv">
			<div class="ac-h">
				<div class="ac-tabs" role="group" aria-label={compare.switchLabel}>
					{#each METRIC_KEYS as k (k)}
						<button
							type="button"
							class={[k === key && "on"]}
							aria-pressed={k === key}>{metrics[k].label}</button
						>
					{/each}
				</div>
				<span class="ac-u">{metric.unit} · {period}</span>
			</div>
			<div class="ac-l" style:--f={avg / max}>
				{#each rows as row (row.name)}
					<div class={["ac-r", row.high && "hi"]} style:--d={row.shift}>
						<span class="ac-n"
							><b>{row.name}</b><small>{compare.units(row.units)}</small></span
						>
						<span class="ac-b"><i style:width="{row.width}%"></i></span>
						<b class="ac-v">{row.value}</b>
						<em class="ac-t">{row.dev}</em>
					</div>
				{/each}
				<i class="ac-avg" aria-hidden="true"
					><span>Ø {de(avg, metric.digits)}</span></i
				>
			</div>
			<div class="ac-f">
				<span class="ac-lg"><i class="o"></i>{compare.above}</span>
				<span class="ac-lg"><i></i>{compare.below}</span>
				<span class="ac-demo">{compare.demo}</span>
			</div>
		</div>
	{/snippet}
</Split>

<style>
	.ac {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 20px;
		box-shadow: 0 30px 70px -50px rgba(30, 50, 45, 0.45);
	}
	.ac-h {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	.ac-tabs {
		display: inline-flex;
		background: var(--bg);
		border-radius: 10px;
		padding: 3px;
	}
	/* Two classes, to beat the landing reset of buttons */
	.ac-tabs button {
		border: 0;
		background: none;
		font: inherit;
		font-size: 13px;
		font-weight: 500;
		padding: 7px 12px;
		border-radius: 8px;
		color: var(--muted);
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.ac-tabs button.on {
		background: #fff;
		color: var(--ink);
		box-shadow: 0 1px 3px rgba(30, 50, 45, 0.12);
	}
	.ac-u {
		font-size: 12px;
		color: var(--muted);
	}
	.ac-l {
		position: relative;
		margin-top: 18px;
		display: grid;
		/* The bar's column (the design measures the bar instead) */
		--bar-x: 162px;
		--bar-w: calc(100% - 292px);
	}
	.ac-r {
		display: grid;
		grid-template-columns: 150px minmax(0, 1fr) 52px 54px;
		gap: 12px;
		align-items: center;
		padding: 8px 0;
		border-bottom: 1px solid #f1f4f2;
		/* To its rank: the rows keep their order in the HTML */
		transform: translateY(calc(var(--d) * 100%));
		transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ac-n {
		min-width: 0;
	}
	.ac-n b {
		display: block;
		font-size: 13.5px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.ac-n small {
		white-space: nowrap;
		font-size: 11.5px;
		color: var(--muted);
	}
	.ac-b {
		height: 12px;
		background: var(--bg);
		border-radius: 4px;
		position: relative;
	}
	.ac-b i {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		border-radius: 4px;
		background: #b9d7c0;
		transition:
			width 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.3s;
	}
	.ac-r.hi .ac-b i {
		background: var(--g4);
	}
	.ac-v {
		text-align: right;
		font-size: 13.5px;
		font-variant-numeric: tabular-nums;
	}
	.ac-t {
		font-style: normal;
		font-size: 11px;
		font-weight: 700;
		text-align: center;
		border-radius: 999px;
		padding: 3px 0;
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.ac-r.hi .ac-t {
		background: #fbe6da;
		color: #b4461e;
	}
	.ac-avg {
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(var(--bar-x) + var(--bar-w) * var(--f));
		border-left: 1.5px dashed #7a8783;
		transition: left 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
		pointer-events: none;
	}
	.ac-avg span {
		position: absolute;
		bottom: -20px;
		left: -14px;
		font-style: normal;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--muted);
		white-space: nowrap;
	}
	.ac-f {
		display: flex;
		gap: 16px;
		align-items: center;
		margin-top: 26px;
		font-size: 12px;
		color: var(--muted);
	}
	.ac-lg {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.ac-lg i {
		width: 10px;
		height: 10px;
		border-radius: 3px;
		background: #b9d7c0;
	}
	.ac-lg i.o {
		background: var(--g4);
	}
	.ac-demo {
		margin-left: auto;
		font-size: 11px;
		font-weight: 600;
		background: #e6f5e7;
		color: #2f7a3c;
		border-radius: 999px;
		padding: 2px 9px;
	}
	@media (max-width: 640px) {
		.ac-l {
			--bar-x: 122px;
			--bar-w: calc(100% - 178px);
		}
		.ac-r {
			grid-template-columns: 110px minmax(0, 1fr) 44px;
		}
		.ac-t {
			display: none;
		}
	}
</style>
