<!--
  A preview line chart (Kaltwasser, Warmwasser): the area, the optional
  previous-year line and the line, in a 0–100 box stretched to the plot.
  `draw` > 0 plays the draw-in again (plan 03, 3A.3).
-->
<script lang="ts">
	import {
		areaPath,
		formatNumber,
		niceScale,
		smoothPath,
		toPoints,
		valueY,
	} from "../../chart";
	import Axes from "./Axes.svelte";
	import ChartTip from "./ChartTip.svelte";

	let {
		values,
		previous,
		labels,
		color,
		unit,
		label,
		pointLabel,
		draw = 0,
	}: {
		values: number[];
		previous?: number[];
		/** Month labels under the plot. */
		labels: string[];
		color: string;
		unit: string;
		/** The chart's text alternative. */
		label: string;
		pointLabel: (i: number) => string;
		draw?: number;
	} = $props();

	const uid = $props.id();
	const scale = $derived(
		niceScale(Math.max(...values, ...(previous ?? [])) * 1.08),
	);
	const points = $derived(toPoints(values, scale.max));
	const previousPoints = $derived(
		previous ? toPoints(previous, scale.max) : null,
	);

	let hovered = $state<number | null>(null);
	let plot = $state<HTMLElement>();

	function onpointermove(event: PointerEvent) {
		if (!plot) return;
		const rect = plot.getBoundingClientRect();
		const share = (event.clientX - rect.left) / rect.width;
		hovered = Math.max(
			0,
			Math.min(values.length - 1, Math.floor(share * values.length)),
		);
	}
</script>

<div
	class="ch"
	role="img"
	aria-label={label}
	{onpointermove}
	onpointerleave={() => (hovered = null)}
>
	<Axes ticks={scale.ticks} max={scale.max} {labels}>
		<div class="fill" bind:this={plot}>
			<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
				<defs>
					<linearGradient id="{uid}-g" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0" stop-color={color} stop-opacity=".18" />
						<stop offset="1" stop-color={color} stop-opacity=".02" />
					</linearGradient>
				</defs>
				{#each scale.ticks as tick (tick)}
					<line
						class="gl"
						x1="0"
						x2="100"
						y1={valueY(tick, scale.max)}
						y2={valueY(tick, scale.max)}
					/>
				{/each}
			</svg>
			{#key draw}
				<svg
					class={["layer", draw > 0 && "anim"]}
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path d={areaPath(points)} fill="url(#{uid}-g)" />
					{#if previousPoints}
						<path class="prev" d={smoothPath(previousPoints)} stroke={color} />
					{/if}
					<path class="line" d={smoothPath(points)} stroke={color} />
				</svg>
			{/key}
			{#if hovered !== null}
				{@const [x, y] = points[hovered]}
				<ChartTip {x} {y} {color}>
					<b>{formatNumber(values[hovered])} {unit}</b>
					<span>· {pointLabel(hovered)}</span>
					{#if previous}
						<span>· Vorjahr {formatNumber(previous[hovered])}</span>
					{/if}
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
	.line,
	.prev {
		fill: none;
		vector-effect: non-scaling-stroke;
		stroke-linecap: round;
	}
	.line {
		stroke-width: 2.2;
	}
	.prev {
		stroke-width: 1.6;
		stroke-dasharray: 4 4;
		opacity: 0.7;
	}
	.layer.anim {
		animation: draw 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
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
