<!--
  The Doppelpflege-Rechner (.si-calc, `#doppelpflege`): four sliders and the
  dark result card (`doppelpflege.ts`). The server renders the defaults; the
  hours and the cost count to their new value in 350 ms (not with reduced
  motion), the day grid lights one cell per working day.
-->
<script lang="ts">
	import { untrack } from "svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { tweenNumber } from "$lib/landing/motion";
	import {
		formatDecimal,
		formatNumber,
	} from "$lib/landing/pages/upgrade-now/calculator";
	import { CALC_ID, calculator as t, type CalcField } from "../content";
	import { doppelpflege, roundCost, type Inputs } from "../doppelpflege";

	const NB = " ";

	const values: Inputs = $state(
		Object.fromEntries(t.fields.map((f) => [f.id, f.default])) as Inputs,
	);
	const result = $derived(doppelpflege(values, t.cells));

	// The numbers on screen, which follow `result` with a 350 ms count.
	let shownHours = $state(untrack(() => result.hours));
	let shownCost = $state(untrack(() => result.cost));

	$effect(() => {
		const { hours, cost } = result;
		const from = untrack(() => [shownHours, shownCost]);
		const stops = [
			tweenNumber(from[0], hours, 350, (v) => (shownHours = v)),
			tweenNumber(from[1], cost, 350, (v) => (shownCost = roundCost(v))),
		];
		return () => stops.forEach((stop) => stop());
	});

	const show = (f: CalcField) =>
		f.unit
			? `${formatNumber(values[f.id])}${NB}${f.unit}`
			: formatNumber(values[f.id]);
	const percent = (f: CalcField) =>
		((values[f.id] - f.min) / (f.max - f.min)) * 100;
</script>

<section class="pg-sec alt calc-sec" id={CALC_ID} aria-labelledby="dp-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="dp-h" eyebrow={t.pill} heading={t.h2}>
				{#snippet icon()}
					<circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" />
				{/snippet}
			</SectionHead>
			<p class="lead rv">{t.lead}</p>
		</div>
		<div class="calc rv">
			<div class="inputs">
				{#each t.fields as f (f.id)}
					<div class="field">
						<span
							><label for="r-{f.id}">{f.label}</label><output for="r-{f.id}"
								>{show(f)}</output
							></span
						>
						<input
							id="r-{f.id}"
							type="range"
							min={f.min}
							max={f.max}
							step={f.step}
							bind:value={values[f.id]}
							aria-valuetext={show(f)}
							style:--p="{percent(f)}%"
						/>
						{#if f.help}<small class="help">{f.help}</small>{/if}
					</div>
				{/each}
			</div>
			<div class="result">
				<small>{t.result.label}</small>
				<div class="big">
					<span>{formatNumber(shownHours)}</span><i>{t.result.unit}</i>
				</div>
				<div class="days">
					{formatDecimal(result.days, 1)}
					{t.result.days}
				</div>
				<div class="cost">
					<span>{t.result.costLabel}</span><b>{formatNumber(shownCost)}{NB}€</b>
				</div>
				<div class="hrs" aria-hidden="true">
					{#each { length: t.cells }, i (i)}
						<i class={[i < result.lit && "on"]}></i>
					{/each}
				</div>
				<p class="note">{t.result.note}</p>
			</div>
		</div>
	</div>
</section>

<style>
	.calc-sec {
		scroll-margin-top: 72px;
	}
	.head {
		max-width: 760px;
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	.calc {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: 16px;
		margin-top: 48px;
	}
	.inputs {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 30px;
		display: grid;
		gap: 28px;
	}
	.field > span:first-child {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		margin-bottom: 12px;
	}
	.field label {
		font-size: 15px;
		font-weight: 600;
	}
	.field output {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
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
	.help {
		display: block;
		font-size: 12.5px;
		color: var(--faint);
		margin-top: 9px;
	}
	.result {
		background: var(--ink);
		color: #fff;
		border-radius: 20px;
		padding: 30px;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
	}
	.result > small {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.66);
	}
	.big {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin-top: 8px;
	}
	.big span {
		font-size: clamp(56px, 6vw, 80px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
		color: var(--accent);
	}
	.big i {
		font-style: normal;
		font-size: 22px;
		color: rgba(255, 255, 255, 0.8);
	}
	.days {
		font-size: 15px;
		color: rgba(255, 255, 255, 0.75);
		margin-top: 10px;
	}
	.cost {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		margin-top: 22px;
		padding-top: 18px;
		border-top: 1px solid rgba(255, 255, 255, 0.12);
		font-size: 14px;
		color: rgba(255, 255, 255, 0.66);
	}
	.cost b {
		font-size: 22px;
		font-weight: 600;
		color: #fff;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.hrs {
		display: grid;
		grid-template-columns: repeat(20, 1fr);
		gap: 4px;
		margin-top: 22px;
	}
	.hrs i {
		aspect-ratio: 1;
		border-radius: 3px;
		background: rgba(255, 255, 255, 0.1);
		transition: background 0.3s;
	}
	.hrs i.on {
		background: var(--accent);
	}
	.note {
		margin-top: auto;
		padding-top: 20px;
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.5);
		line-height: 1.5;
	}
	@media (max-width: 860px) {
		.calc {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.inputs,
		.result {
			padding: 22px;
		}
		.hrs {
			grid-template-columns: repeat(15, 1fr);
		}
	}
</style>
