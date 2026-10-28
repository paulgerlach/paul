<!--
  A preview chart's frame: the y labels in the left gutter, the x labels under
  the plot, and the plot area (children) between them. Everything is placed in
  percent, so the server draws it without measuring (plan README, Charts).
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import { formatNumber, valueY } from "../../chart";

	let {
		ticks,
		max,
		labels,
		children,
	}: {
		ticks: number[];
		max: number;
		labels: string[];
		children: Snippet;
	} = $props();
</script>

<div class="axes">
	<div class="y" aria-hidden="true">
		{#each ticks as tick (tick)}
			<span style:--y={valueY(tick, max) / 100}>{formatNumber(tick)}</span>
		{/each}
	</div>
	<div class="plot">{@render children()}</div>
	<div class="x" aria-hidden="true" style:--n={labels.length}>
		{#each labels as label, i (i)}<span>{label}</span>{/each}
	</div>
</div>

<style>
	.axes {
		position: absolute;
		inset: 0;
		font-size: 9px;
		color: #6f7c77;
		font-variant-numeric: tabular-nums;
	}
	.y span {
		position: absolute;
		left: 0;
		width: 30px;
		text-align: right;
		top: calc(10px + var(--y) * (100% - 30px));
		transform: translateY(-50%);
		line-height: 1;
	}
	.plot {
		position: absolute;
		top: 10px;
		right: 8px;
		bottom: 20px;
		left: 36px;
	}
	.x {
		position: absolute;
		left: 36px;
		right: 8px;
		bottom: 0;
		height: 16px;
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		text-align: center;
		line-height: 16px;
	}
</style>
