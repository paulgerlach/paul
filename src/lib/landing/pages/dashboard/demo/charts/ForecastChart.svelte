<!--
  The "Verbrauchsprognose" tile: actuals, and in 2026 the forecast from
  October with its uncertainty band and the "HEUTE" marker.
-->
<script lang="ts">
	import {
		formatNumber,
		niceScale,
		slotX,
		smoothPath,
		type Point,
		valueY,
	} from "../../chart";
	import { FORECAST, MONTHS } from "../data";
	import Axes from "./Axes.svelte";
	import ChartTip from "./ChartTip.svelte";

	const COLOR = "#5B78C9";

	let {
		actual,
		forecast,
		low,
		high,
		full,
		label,
		draw = 0,
	}: {
		actual: number[];
		forecast: number[];
		low: number[];
		high: number[];
		/** A finished year: actuals only. */
		full: boolean;
		label: string;
		draw?: number;
	} = $props();

	const scale = $derived(niceScale(Math.max(...actual, ...high) * 1.05));
	const at = (values: number[], offset: number): Point[] =>
		values.map((v, i) => [slotX(i + offset, 12), valueY(v, scale.max)]);
	const band = $derived.by(() => {
		if (full) return "";
		const top = at(high, FORECAST.today);
		const bottom = at(low, FORECAST.today).reverse();
		return `M${[...top, ...bottom].map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
	});
	const today = slotX(FORECAST.today, 12);

	let hovered = $state<number | null>(null);
	let plot = $state<HTMLElement>();

	function onpointermove(event: PointerEvent) {
		if (!plot) return;
		const rect = plot.getBoundingClientRect();
		const share = (event.clientX - rect.left) / rect.width;
		hovered = Math.max(0, Math.min(11, Math.floor(share * 12)));
	}

	const tip = $derived.by(() => {
		if (hovered === null) return null;
		const i = hovered;
		if (full || i < FORECAST.today + 1) {
			const v = actual[i];
			return { y: valueY(v, scale.max), value: v, text: `Ist, ${MONTHS[i]}` };
		}
		const k = i - FORECAST.today;
		return {
			y: valueY(forecast[k], scale.max),
			value: forecast[k],
			text: `Prognose ${formatNumber(low[k])}–${formatNumber(high[k])}, ${MONTHS[i]}`,
		};
	});
</script>

<div
	class="ch"
	role="img"
	aria-label={label}
	{onpointermove}
	onpointerleave={() => (hovered = null)}
>
	<Axes ticks={scale.ticks} max={scale.max} labels={MONTHS}>
		<div class="fill" bind:this={plot}>
			<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
				{#each scale.ticks as tick (tick)}
					<line
						class="gl"
						x1="0"
						x2="100"
						y1={valueY(tick, scale.max)}
						y2={valueY(tick, scale.max)}
					/>
				{/each}
				{#if !full}
					<path d={band} fill="#E4E8F2" />
					<line class="today" x1={today} x2={today} y1="0" y2="100" />
				{/if}
			</svg>
			{#key draw}
				<svg
					class={["layer", draw > 0 && "anim"]}
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path class="line" d={smoothPath(at(actual, 0))} />
					{#if !full}
						<path class="fc" d={smoothPath(at(forecast, FORECAST.today))} />
					{/if}
				</svg>
			{/key}
			{#if !full}
				<span class="heute" style:left="{today}%" aria-hidden="true">HEUTE</span
				>
			{/if}
			{#if tip && hovered !== null}
				<ChartTip x={slotX(hovered, 12)} y={tip.y} color={COLOR}>
					<b>{formatNumber(tip.value)} MWh</b> <span>· {tip.text}</span>
				</ChartTip>
			{/if}
		</div>
	</Axes>
</div>

<style>
	.ch {
		position: relative;
		height: 100%;
		min-height: inherit;
	}
	.fill {
		position: absolute;
		inset: 0;
	}
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.gl {
		stroke: #eef0ee;
		vector-effect: non-scaling-stroke;
	}
	.today {
		stroke: #9aa5a1;
		stroke-dasharray: 3 3;
		vector-effect: non-scaling-stroke;
	}
	.line,
	.fc {
		fill: none;
		stroke: #5b78c9;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}
	.line {
		stroke-width: 2.2;
	}
	.fc {
		stroke-width: 2;
		stroke-dasharray: 2 4;
	}
	.heute {
		position: absolute;
		top: -10px;
		transform: translateX(-50%);
		background: #fff;
		border: 1px solid #d5dad7;
		border-radius: 7px;
		padding: 0 6px;
		font-size: 8px;
		font-weight: 600;
		line-height: 12px;
		color: #6f7c77;
	}
	.layer.anim {
		animation: draw 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes draw {
		from {
			clip-path: inset(-10% 100% -10% 0);
		}
		to {
			clip-path: inset(-10% 0 -10% 0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.layer.anim {
			animation: none;
		}
	}
</style>
