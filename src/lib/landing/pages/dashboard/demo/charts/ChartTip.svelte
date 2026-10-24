<!--
  The preview charts' tooltip and hover marker, positioned in percent of the
  plot. Pointer-only and hidden from assistive tech: the chart's label and the
  data view carry the values (plan 03, 3A.3).
-->
<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		x,
		y,
		color,
		marker = true,
		children,
	}: {
		/** Percent of the plot's width and height. */
		x: number;
		y: number;
		color: string;
		marker?: boolean;
		children: Snippet;
	} = $props();
</script>

<div class="hover" aria-hidden="true">
	{#if marker}
		<i class="vx" style:left="{x}%" style:border-color={color}></i>
		<i class="dot" style:left="{x}%" style:top="{y}%" style:border-color={color}
		></i>
	{/if}
	<div
		class="tip"
		style:--x={x}
		style:top="calc({y}% - 34px)"
		class:right={x > 70}
		class:left={x < 30}
	>
		{@render children()}
	</div>
</div>

<style>
	.hover {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.vx {
		position: absolute;
		top: 0;
		bottom: 0;
		border-left: 1px dashed;
	}
	.dot {
		position: absolute;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid;
		transform: translate(-50%, -50%);
	}
	.tip {
		position: absolute;
		left: calc(var(--x) * 1%);
		transform: translateX(-50%);
		z-index: 6;
		background: var(--ink);
		color: #fff;
		border-radius: 8px;
		padding: 6px 9px;
		font-size: 11px;
		line-height: 1.4;
		white-space: nowrap;
		box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.45);
	}
	.tip.right {
		transform: translateX(-100%);
	}
	.tip.left {
		transform: none;
	}
	.tip :global(span) {
		color: #b7c4bf;
	}
</style>
