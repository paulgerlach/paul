<!--
  The hero's unit calculator (.sg-calc): "Wie viele Einheiten betreuen Sie?",
  a slider on the log scale of `units.ts`, and below it either the standard
  card or, from 1.000 units, the dark large-stock offer. The server renders
  the content's start (the design's `data-units`).
-->
<script lang="ts">
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import Icon from "./Icon.svelte";
	import Tick from "./Tick.svelte";
	import type { UnitCalc } from "./types";
	import { formatUnits, isLarge, SLIDER_MAX, toUnits, toValue } from "./units";

	let { calc }: { calc: UnitCalc } = $props();

	// svelte-ignore state_referenced_locally
	let value = $state(toValue(calc.start));
	const units = $derived(toUnits(value));
	const large = $derived(isLarge(units));
	const shown = $derived(formatUnits(units));
</script>

<div class={["calc rv", large && "big"]}>
	<div class="ch">
		<b>{calc.title}</b><small>{calc.hint}</small>
	</div>
	<div class="out">
		<b>{shown}</b><span>{calc.unit}</span>
	</div>
	<input
		type="range"
		min="0"
		max={SLIDER_MAX}
		step="1"
		bind:value
		aria-label={calc.label}
		aria-valuetext="{shown} {calc.unit}"
		style:--p="{(value / SLIDER_MAX) * 100}%"
	/>
	<div class="scale" aria-hidden="true">
		<span>{calc.scale[0]}</span><span class="m">{calc.scale[1]}</span><span
			>{calc.scale[2]}</span
		>
	</div>
	<div class="res">
		<div class="std" inert={large}>
			<span class="tag">{calc.standard.tag}</span>
			<ul>
				{#each calc.standard.ticks as tick (tick)}
					<li><Tick />{tick}</li>
				{/each}
			</ul>
		</div>
		<div class="lg" inert={!large}>
			<span class="tag dark"
				><Icon name={calc.large.icon} />{calc.large.tag}</span
			>
			<b>{calc.large.title}</b>
			<ul>
				{#each calc.large.ticks as tick (tick)}
					<li><Tick color="#8AD68F" />{tick}</li>
				{/each}
			</ul>
			<ArrowLink href={calc.large.cta.href} label={calc.large.cta.text} />
		</div>
	</div>
</div>

<style>
	.calc {
		position: relative;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.35);
		padding: 24px;
		overflow: hidden;
	}
	.ch b {
		display: block;
		font-size: 16px;
		font-weight: 600;
	}
	.ch small {
		display: block;
		font-size: 13px;
		color: var(--muted);
		margin-top: 2px;
	}
	.out {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin: 16px 0 14px;
	}
	.out b {
		font-size: clamp(48px, 5vw, 64px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.out span {
		font-size: 18px;
		color: var(--muted);
	}
	/* The design's range (#demo-css), filled in ink up to the thumb (PG.paintRange). */
	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: linear-gradient(90deg, var(--ink) var(--p), #d5dcd9 var(--p));
		outline: 0;
		margin: 8px 0 2px;
	}
	input[type="range"]:focus-visible {
		outline: 2px solid var(--accent-deep);
		outline-offset: 6px;
	}
	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid var(--ink);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
		cursor: pointer;
	}
	input[type="range"]::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid var(--ink);
		cursor: pointer;
	}
	.scale {
		position: relative;
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: var(--faint);
		margin-top: 8px;
		font-variant-numeric: tabular-nums;
	}
	.scale .m {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		color: var(--ink);
		font-weight: 600;
	}
	.scale .m::before {
		content: "";
		position: absolute;
		left: 50%;
		top: -14px;
		width: 2px;
		height: 8px;
		background: var(--ink);
		border-radius: 2px;
	}
	.res {
		position: relative;
		margin-top: 20px;
		display: grid;
	}
	.std,
	.lg {
		grid-area: 1/1;
		border-radius: 16px;
		padding: 18px;
		transition:
			opacity 0.45s,
			transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.std {
		background: var(--bg);
		border: 1px solid var(--hair);
	}
	.lg {
		background: var(--ink);
		color: #fff;
		opacity: 0;
		transform: translateY(12px) scale(0.98);
		pointer-events: none;
	}
	.big .std {
		opacity: 0;
		transform: translateY(-8px);
	}
	.big .lg {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 600;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 999px;
		padding: 4px 10px;
	}
	.tag.dark {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--ink);
	}
	.tag :global(svg) {
		width: 12px;
		height: 12px;
	}
	.lg > b {
		display: block;
		font-size: 20px;
		font-weight: 600;
		letter-spacing: -0.01em;
		margin-top: 12px;
	}
	ul {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	li {
		display: flex;
		gap: 9px;
		align-items: center;
		font-size: 14.5px;
	}
	.lg li {
		color: rgba(255, 255, 255, 0.85);
	}
	.lg :global(.bk) {
		margin-top: 14px;
		padding: 11px 14px;
	}
	@media (max-width: 640px) {
		.calc {
			padding: 18px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.std,
		.lg {
			transition: none;
		}
	}
</style>
