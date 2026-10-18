<!--
  A preview bar chart with tracks (Heizvolumen, Heizkörper): HTML bars in
  slots, the month labels on top, as the design's track variant. `draw` > 0
  grows the bars again (plan 03, 3A.3).
-->
<script lang="ts">
	import { formatNumber, niceScale } from "../../chart";
	import ChartTip from "./ChartTip.svelte";

	let {
		values,
		labels,
		color,
		unit,
		label,
		pointLabel,
		monthly,
		draw = 0,
	}: {
		values: number[];
		labels: string[];
		color: string;
		unit: string;
		label: string;
		pointLabel: (i: number) => string;
		/** Monthly bars are wider and stagger more (the design's widths). */
		monthly: boolean;
		draw?: number;
	} = $props();

	const max = $derived(niceScale(Math.max(...values) * 1.25).max);
	let hovered = $state<number | null>(null);
</script>

<div class="ch" role="img" aria-label={label}>
	<div class="months" aria-hidden="true" style:--n={labels.length}>
		{#each labels as month, i (i)}<span>{month}</span>{/each}
	</div>
	{#key draw}
		<div
			class={["bars", draw > 0 && "anim", monthly ? "m" : "x"]}
			aria-hidden="true"
		>
			{#each values as value, i (i)}
				<span
					class="slot"
					role="presentation"
					onpointerenter={() => (hovered = i)}
					onpointerleave={() => (hovered = null)}
				>
					<span class="track">
						<span
							class="bar"
							style:height="{(value / max) * 100}%"
							style:background={color}
							style:--i={i}
						></span>
					</span>
				</span>
			{/each}
		</div>
	{/key}
	{#if hovered !== null}
		<div class="tip-area">
			<ChartTip
				x={((hovered + 0.5) / values.length) * 100}
				y={100 - (values[hovered] / max) * 100}
				{color}
				marker={false}
			>
				<b>{formatNumber(values[hovered])} {unit}</b>
				<span>· {pointLabel(hovered)}</span>
			</ChartTip>
		</div>
	{/if}
</div>

<style>
	.ch {
		position: relative;
		height: 100%;
		min-height: inherit;
	}
	.months {
		position: absolute;
		top: 0;
		left: 6px;
		right: 6px;
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		text-align: center;
		font-size: 9px;
		color: #6f7c77;
		line-height: 14px;
	}
	.bars,
	.tip-area {
		position: absolute;
		top: 20px;
		left: 6px;
		right: 6px;
		bottom: 4px;
	}
	.tip-area {
		pointer-events: none;
	}
	.bars {
		display: flex;
	}
	.slot {
		flex: 1;
		display: flex;
		justify-content: center;
		cursor: pointer;
	}
	.track {
		position: relative;
		height: 100%;
		background: #e4e8f2;
		border-radius: 6px;
		overflow: hidden;
	}
	.m .track {
		width: 64%;
	}
	.x .track {
		width: 80%;
		border-radius: 3px;
	}
	.bar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: inherit;
		transform-origin: bottom;
		transition: opacity 0.2s;
	}
	.bars:hover .bar {
		opacity: 0.55;
	}
	.bars .slot:hover .bar {
		opacity: 1;
	}
	.anim .bar {
		animation: grow 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.anim.m .bar {
		animation-delay: calc(var(--i) * 40ms);
	}
	.anim.x .bar {
		animation-delay: calc(var(--i) * 6ms);
	}
	@keyframes grow {
		from {
			transform: scaleY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.anim .bar {
			animation: none;
		}
	}
</style>
