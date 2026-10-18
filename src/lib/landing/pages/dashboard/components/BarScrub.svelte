<!--
  The KPI cards' month bars (the design's `ixBars`): HTML bars with an
  optional darker part, the month row, and the tooltip of the picked month.
  `active` is the picked month (-1: none); pointer and arrow keys pick one
  (plan 03, 3B.2).
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import { enterView } from "$lib/landing/attachments/enterView";

	let {
		values,
		parts,
		max,
		labels,
		label,
		tone = "grey",
		active = $bindable(-1),
		announce,
		tip,
	}: {
		values: number[];
		/** The darker lower part of each bar (the heating share). */
		parts?: number[];
		max: number;
		labels: string[];
		/** The chart's accessible name. */
		label: string;
		tone?: "grey" | "green";
		active?: number;
		/** What a screen reader hears for the picked month. */
		announce: string;
		tip: Snippet<[index: number]>;
	} = $props();

	/** Bars at full height (server); 0 until the card scrolls in. */
	let grown = $state(true);
	let staggered = $state(false);
	let chart = $state<HTMLElement>();

	const at = (clientX: number) => {
		if (!chart) return -1;
		const r = chart.getBoundingClientRect();
		const i = Math.floor(((clientX - r.left) / r.width) * values.length);
		return Math.max(0, Math.min(values.length - 1, i));
	};

	function onkeydown(event: KeyboardEvent) {
		const n = values.length;
		const moves: Record<string, () => number> = {
			ArrowRight: () => (active < 0 ? 0 : Math.min(n - 1, active + 1)),
			ArrowLeft: () => (active < 0 ? n - 1 : Math.max(0, active - 1)),
			Home: () => 0,
			End: () => n - 1,
			Escape: () => -1,
		};
		const move = moves[event.key];
		if (!move) return;
		event.preventDefault();
		active = move();
	}

	function onDocumentDown(event: PointerEvent) {
		if (active > -1 && chart && !chart.contains(event.target as Node))
			active = -1;
	}
</script>

<svelte:document onpointerdown={onDocumentDown} />

<div
	class={["scrub", tone, staggered && "stagger"]}
	{@attach enterView({
		prepare: () => (grown = false),
		play: () => {
			staggered = true;
			grown = true;
			const t = setTimeout(() => (staggered = false), 900);
			return () => clearTimeout(t);
		},
	})}
>
	<!-- A focusable group: arrows pick a month, announced by the live line below. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<div
		class="chart"
		role="group"
		aria-label={label}
		tabindex="0"
		bind:this={chart}
		{onkeydown}
		onpointermove={(e) => (active = at(e.clientX))}
		onpointerdown={(e) => (active = at(e.clientX))}
		onpointerleave={(e) => {
			if (e.pointerType === "mouse") active = -1;
		}}
		onblur={() => (active = -1)}
	>
		<div class="bars" aria-hidden="true">
			{#each values as value, i (i)}
				<i
					class={[i === active && "on", active > -1 && i !== active && "dim"]}
					style:height="{grown ? Math.max(3, (value / max) * 100) : 0}%"
					style:--i={i}
					><s
						style:height="{parts
							? Math.min(100, (parts[i] / value) * 100)
							: 0}%"
					></s></i
				>
			{/each}
		</div>
		{#if active > -1}
			<div
				class="tip"
				style:left="{((active + 0.5) / values.length) * 100}%"
				style:bottom="calc({(values[active] / max) * 100}% + 8px)"
				aria-hidden="true"
			>
				{@render tip(active)}
			</div>
		{/if}
	</div>
	<div class="x" aria-hidden="true">
		{#each labels as month, i (i)}
			<span class={[i === active && "on"]}>{month}</span>
		{/each}
	</div>
	<p class="sr-only" aria-live="polite">{announce}</p>
</div>

<style>
	.scrub {
		margin-top: auto;
	}
	.chart {
		position: relative;
		height: 118px;
		padding-top: 18px;
		cursor: crosshair;
		touch-action: pan-y;
		outline: none;
		border-radius: 6px;
	}
	.chart:focus-visible {
		box-shadow: 0 0 0 2px var(--accent);
	}
	.bars {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 18px;
		display: flex;
		align-items: flex-end;
		gap: 6px;
	}
	.green .bars {
		gap: 10px;
	}
	.bars i {
		flex: 1;
		position: relative;
		background: #dce3df;
		border-radius: 5px 5px 0 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		overflow: hidden;
		transition:
			height 0.55s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.2s,
			opacity 0.2s;
	}
	.stagger .bars i {
		transition-duration: 0.9s;
		transition-delay: calc(var(--i) * 45ms);
	}
	.bars s {
		display: block;
		width: 100%;
		background: #b8c7bf;
		text-decoration: none;
		transition: height 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	:global(.kc:hover) .grey .bars i:not(.on) {
		background: #d3dcd7;
	}
	.bars i.dim {
		opacity: 0.55;
	}
	.bars i.on {
		background: #3c5a51;
		opacity: 1;
	}
	.bars i.on s {
		background: var(--ink);
	}
	.green .bars i {
		background: #cfe9d1;
	}
	.green .bars i.on {
		background: var(--accent-deep);
	}
	:global(.kc:hover) .green .bars i:not(.on) {
		background: #c2e3c5;
	}
	.x {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(0, 1fr);
		gap: 6px;
		margin-top: 7px;
		font-size: 10.5px;
		color: #9aa6a1;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}
	.green .x {
		gap: 10px;
	}
	.x span {
		transition: color 0.2s;
	}
	.x span.on {
		color: var(--ink);
		font-weight: 600;
	}
	.tip {
		position: absolute;
		transform: translateX(-50%);
		background: var(--ink);
		color: #fff;
		border-radius: 9px;
		padding: 8px 10px;
		font-size: 11.5px;
		line-height: 1.35;
		white-space: nowrap;
		pointer-events: none;
		z-index: 3;
		box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.45);
		min-width: 120px;
	}
	.tip :global(b) {
		display: block;
		font-weight: 600;
		margin-bottom: 3px;
	}
	.tip :global(span) {
		display: flex;
		align-items: center;
		gap: 6px;
		color: rgba(255, 255, 255, 0.75);
	}
	.tip :global(span em) {
		font-style: normal;
		margin-left: auto;
		padding-left: 12px;
		color: #fff;
		font-variant-numeric: tabular-nums;
	}
	.tip :global(span.t) {
		border-top: 1px solid rgba(255, 255, 255, 0.15);
		margin-top: 4px;
		padding-top: 4px;
		color: #fff;
	}
	.tip :global(span.t em) {
		color: var(--accent);
		font-weight: 600;
	}
	.tip :global(i) {
		width: 8px;
		height: 8px;
		border-radius: 2px;
		flex: none;
	}
	.tip :global(i.d) {
		background: #b8c7bf;
	}
	.tip :global(i.l) {
		background: #dce3df;
	}
</style>
