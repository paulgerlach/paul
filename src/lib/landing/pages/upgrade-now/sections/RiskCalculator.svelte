<!--
  "Was Warten Ihren Bestand kosten kann": units, heating costs and the share
  without remote reading give the possible cut per billing period. The
  switch shows the retrofitted case (with confetti). Without JS the defaults
  and their server-rendered result show.
-->
<script lang="ts">
	import { onDestroy, untrack } from "svelte";
	import { burst } from "$lib/landing/confetti";
	import { tweenNumber } from "$lib/landing/motion";
	import ArrowLink from "../components/ArrowLink.svelte";
	import SectionHead from "../components/SectionHead.svelte";
	import {
		COST,
		DEFAULT_SHARE,
		DEFAULT_UNIT_INDEX,
		formatNumber,
		risk,
		SHARES,
		UNIT_STOPS,
	} from "../calculator";
	import { calculator as t } from "../content";
	import { getDeadlineClock } from "../clock.svelte";

	const clock = getDeadlineClock();

	let unitIndex = $state(DEFAULT_UNIT_INDEX);
	let costPerUnit = $state(COST.default);
	let share = $state<number>(DEFAULT_SHARE);
	let retrofitted = $state(false);

	const units = $derived(UNIT_STOPS[unitIndex]);
	const result = $derived(risk({ units, costPerUnit, share, retrofitted }));
	const unitsP = $derived((unitIndex / (UNIT_STOPS.length - 1)) * 100);
	const costP = $derived(
		((costPerUnit - COST.min) / (COST.max - COST.min)) * 100,
	);

	// The amount tweens to each new result; SSR shows the result itself.
	let shown = $state(untrack(() => result.cut));
	$effect(() => {
		const to = result.cut;
		const ms = retrofitted ? 1400 : 500;
		// Each change cancels the running tween and starts from the shown value.
		return untrack(() => tweenNumber(shown, to, ms, (v) => (shown = v)));
	});

	let card: HTMLElement;
	let amount: HTMLElement;
	let canvas: HTMLCanvasElement;
	let stopConfetti = () => {};
	let confettiTimer: ReturnType<typeof setTimeout> | undefined;

	function onSwitch() {
		clearTimeout(confettiTimer);
		if (!retrofitted) return;
		confettiTimer = setTimeout(() => {
			stopConfetti();
			const host = card.getBoundingClientRect();
			const o = amount.getBoundingClientRect();
			stopConfetti = burst(
				canvas,
				{ width: host.width, height: host.height },
				{
					x: o.left - host.left + Math.min(o.width, 120) / 2,
					y: o.top - host.top + o.height / 2,
					width: 0,
				},
				{
					count: 120,
					colors: [
						"#8AD68F",
						"#FFFFFF",
						"#6282D0",
						"#F2C14E",
						"#CFE9D1",
						"#D9622B",
					],
					speed: [2.6, 4.2],
					angle: 1.2,
					gravity: 0.06,
					maxFall: 1.2,
					fadeAfter: 3400,
					fadeMs: 1000,
					maxTime: 4600,
					wobble: [420, 0.5],
					spin: 0.14,
				},
			);
		}, 250);
	}

	onDestroy(() => {
		clearTimeout(confettiTimer);
		stopConfetti();
	});
</script>

<section class="calc" id="risiko" aria-labelledby="calc-h">
	<div class="wrap">
		<SectionHead id="calc-h" eyebrow={t.eyebrow} heading={t.h2}>
			{#snippet icon()}
				<rect x="4.5" y="2.5" width="11" height="15" rx="2" /><path
					d="M7.5 6h5M7.5 10h.01M10 10h.01M12.5 10h.01M7.5 13h.01M10 13h.01M12.5 13h.01"
				/>
			{/snippet}
		</SectionHead>
		<div class="rv grid">
			<div class="inputs">
				<label class="f">
					<span><b>{t.units}</b><output>{formatNumber(units)}</output></span>
					<input
						type="range"
						min="0"
						max={UNIT_STOPS.length - 1}
						step="1"
						bind:value={unitIndex}
						aria-label={t.units}
						aria-valuetext={formatNumber(units)}
						style:--p="{unitsP}%"
					/>
				</label>
				<label class="f">
					<span
						><b>{t.cost}</b><output>{formatNumber(costPerUnit)} €</output></span
					>
					<input
						type="range"
						min={COST.min}
						max={COST.max}
						step={COST.step}
						bind:value={costPerUnit}
						aria-label={t.costAria}
						aria-valuetext="{formatNumber(costPerUnit)} €"
						style:--p="{costP}%"
					/>
					<em>{t.costHint}</em>
				</label>
				<div class="f">
					<span><b id="share-l">{t.share}</b></span>
					<div class="seg" role="radiogroup" aria-label={t.shareAria}>
						{#each SHARES as option (option.value)}
							<button
								type="button"
								role="radio"
								aria-checked={share === option.value}
								class={[share === option.value && "on"]}
								onclick={() => (share = option.value)}>{option.label}</button
							>
						{/each}
					</div>
				</div>
				<label class="sw">
					<input
						type="checkbox"
						bind:checked={retrofitted}
						onchange={onSwitch}
					/>
					<i></i>
					<span>
						<b data-placeholder={clock.expired ? "" : undefined}
							>{clock.expired ? t.switchLabelExpired : t.switchLabel}</b
						>
						<small>{t.switchHint}</small>
					</span>
				</label>
			</div>
			<div class={["out", retrofitted && "safe"]} bind:this={card}>
				<span class="out-l">{retrofitted ? t.safe.label : t.risk.label}</span>
				<div class="out-n">
					<b bind:this={amount} data-testid="risk-amount"
						>{formatNumber(shown)}</b
					><i>€</i>
				</div>
				<div class="stack" aria-hidden="true">
					<i style:width="{retrofitted ? 100 : Math.max(2, share * 100)}%"></i>
				</div>
				<div class="out-r">
					<span>{t.base}<b>{formatNumber(result.base)} €</b></span>
					<span>{t.perUnit}<b>{formatNumber(result.perUnit)} €</b></span>
				</div>
				<p class="out-p">{retrofitted ? t.safe.text : t.risk.text}</p>
				<ArrowLink label={t.cta} class="out-cta" />
				<canvas class="cf" bind:this={canvas} aria-hidden="true"></canvas>
			</div>
		</div>
		<p class="note rv">{t.note}</p>
	</div>
</section>

<style>
	.calc {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 20px;
		margin-top: 48px;
		align-items: stretch;
	}
	.inputs {
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 32px;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}
	.f {
		display: block;
	}
	.f > span {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		margin-bottom: 12px;
	}
	.f b {
		font-size: 15px;
		font-weight: 600;
	}
	output {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.f em {
		display: block;
		font-style: normal;
		font-size: 13px;
		color: var(--faint);
		margin-top: 8px;
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
	.seg {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 4px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 4px;
	}
	.seg button {
		border: 0;
		background: none;
		font-size: 14.5px;
		font-weight: 500;
		padding: 10px 6px;
		border-radius: 9px;
		cursor: pointer;
		color: var(--muted);
		transition:
			background 0.2s,
			color 0.2s;
	}
	.seg button:hover {
		color: var(--ink);
	}
	.seg button.on {
		background: var(--ink);
		color: #fff;
	}
	.sw {
		display: flex;
		align-items: center;
		gap: 14px;
		cursor: pointer;
		border-top: 1px solid var(--hair);
		padding-top: 24px;
		margin-top: auto;
		position: relative;
	}
	.sw input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
	.sw i {
		flex: none;
		width: 48px;
		height: 28px;
		border-radius: 999px;
		background: #cdd5d1;
		position: relative;
		transition: background 0.25s;
	}
	.sw i::after {
		content: "";
		position: absolute;
		left: 3px;
		top: 3px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.sw input:checked + i {
		background: var(--ok);
	}
	.sw input:checked + i::after {
		transform: translateX(20px);
	}
	.sw input:focus-visible + i {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}
	.sw b {
		display: block;
		font-size: 15px;
		font-weight: 600;
	}
	.sw small {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
		margin-top: 2px;
	}
	.out {
		background: var(--ink);
		color: #fff;
		border-radius: 22px;
		padding: 32px;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
		transition: background 0.5s;
	}
	.out-l {
		font-size: 14.5px;
		color: rgba(255, 255, 255, 0.65);
		position: relative;
	}
	.out-n {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-top: 10px;
		position: relative;
	}
	.out-n b {
		font-size: clamp(52px, 6.4vw, 84px);
		font-weight: 500;
		letter-spacing: -0.045em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
		transition: color 0.4s;
	}
	.out-n i {
		font-style: normal;
		font-size: clamp(26px, 3vw, 38px);
		color: rgba(255, 255, 255, 0.5);
	}
	.safe .out-n b {
		color: var(--accent);
	}
	.stack {
		margin-top: 26px;
		height: 12px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.1);
		overflow: hidden;
		position: relative;
	}
	.stack i {
		position: absolute;
		inset: 0 auto 0 0;
		background: #f08a74;
		border-radius: 999px;
		transition:
			width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.4s;
	}
	.safe .stack i {
		background: var(--accent);
	}
	.out-r {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-top: 22px;
		position: relative;
	}
	.out-r span {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.55);
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.out-r b {
		font-size: 19px;
		color: #fff;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.out-p {
		margin-top: 22px;
		font-size: 15px;
		color: rgba(255, 255, 255, 0.75);
		line-height: 1.5;
		position: relative;
		flex: 1;
	}
	.out :global(.out-cta) {
		align-self: flex-start;
		position: relative;
		margin-top: 22px;
	}
	.cf {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 3;
	}
	.note {
		margin-top: 16px;
		font-size: 13px;
		color: var(--faint);
	}
	@media (max-width: 1040px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.inputs,
		.out {
			padding: 24px 20px;
		}
	}
</style>
