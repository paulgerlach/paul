<!--
  The Einsparrechner (.es-calc, `#rechner`, the design's #es-js): the input
  card with seven sliders and two toggles, and the dark result card. The
  math is `savings.ts`. The server renders the defaults' result; in the
  browser the figures count to each new result in 450 ms, and from 0 in
  1.4 s (the bars growing from 0) when the calculator first comes into view.
  The first time both toggles are on, confetti from the total. Nothing moves
  with reduced motion.
-->
<script lang="ts">
	import { onDestroy, untrack } from "svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { focusSignup } from "$lib/landing/cta";
	import { prefersReducedMotion, tweenNumber } from "$lib/landing/motion";
	import { formatNumber } from "$lib/landing/pages/upgrade-now/calculator";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import {
		CALC_ID,
		calculator as t,
		type Field,
		type ToggleId,
	} from "../content";
	import {
		euros,
		formatValue,
		hoursText,
		riskText,
		savings,
		type Inputs,
		type Savings,
	} from "../savings";

	const NB = " ";

	const values: Inputs = $state(
		Object.fromEntries(t.fields.map((f) => [f.id, f.default])) as Inputs,
	);
	const on: Record<ToggleId, boolean> = $state({ fern: false, uvi: false });
	const count = $derived(Object.values(on).filter(Boolean).length);
	const result = $derived(savings(values, count));

	/** The counting figures. */
	type Figures = Pick<Savings, "total" | "time" | "risk" | "days" | "perUnit">;
	const KEYS = ["total", "time", "risk", "days", "perUnit"] as const;
	const pick = (r: Savings): Figures => ({
		total: r.total,
		time: r.time,
		risk: r.risk,
		days: r.days,
		perUnit: r.perUnit,
	});
	const shown: Figures = $state(untrack(() => pick(result)));

	// The bars held at 0 for one frame, so they grow on first view.
	let grow = $state(false);
	// Plain: set once the calculator has come into view.
	let introduced = false;
	let stops: (() => void)[] = [];
	let stopConfetti = () => {};
	let best = false;
	let totalEl: HTMLElement | undefined = $state();

	function animate(from: Figures, to: Figures, ms: number) {
		stops.forEach((stop) => stop());
		stops = KEYS.map((k) =>
			tweenNumber(from[k], to[k], ms, (v) => (shown[k] = v)),
		);
	}

	$effect(() => {
		const to = pick(result);
		untrack(() => {
			if (introduced) animate({ ...shown }, to, 450);
			else Object.assign(shown, to);
		});
	});

	function intro() {
		introduced = true;
		if (prefersReducedMotion()) return;
		const zero = { total: 0, time: 0, risk: 0, days: 0, perUnit: 0 };
		animate(zero, pick(result), 1400);
		grow = true;
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				grow = false;
			}),
		);
	}

	function toggle(id: ToggleId) {
		on[id] = !on[id];
		if (!best && Object.values(on).every(Boolean) && totalEl) {
			best = true;
			stopConfetti = confettiFrom(totalEl);
		}
	}

	onDestroy(() => {
		stops.forEach((stop) => stop());
		stopConfetti();
	});

	const show = (f: Field) =>
		f.unit
			? `${formatValue(values[f.id])}${NB}${f.unit}`
			: formatValue(values[f.id]);
	const percent = (f: Field) =>
		((values[f.id] - f.min) / (f.max - f.min)) * 100;

	const r = t.result;
	const status = $derived(
		`${r.label}: ${euros(result.total)}, ${r.status.of} ${euros(result.time)} ${r.status.time} ${euros(result.risk)} ${r.status.risk}`,
	);
</script>

<div
	class="calc rv"
	id={CALC_ID}
	{@attach inView({ threshold: 0.15, once: true, onEnter: intro })}
>
	<div class="inputs">
		{#each t.groups as group (group.num)}
			<div class="grp">
				<h2><i aria-hidden="true">{group.num}</i>{group.title}</h2>
				{#if group.sub}<p class="sub">{group.sub}</p>{/if}
				{#each t.fields.filter((f) => f.group === group.num) as f (f.id)}
					<div class="sl">
						<span class="lb"
							><label for="es-{f.id}">{f.label}</label><b
								><output for="es-{f.id}">{show(f)}</output></b
							></span
						>
						<input
							id="es-{f.id}"
							type="range"
							min={f.min}
							max={f.max}
							step={f.step}
							bind:value={values[f.id]}
							aria-valuetext={show(f)}
							style:--p="{percent(f)}%"
						/>
					</div>
				{/each}
				{#if group.num === 3}
					<div class="tgs">
						{#each t.toggles as tg (tg.id)}
							<button
								type="button"
								class="tgl"
								aria-pressed={on[tg.id]}
								onclick={() => toggle(tg.id)}
							>
								<span class="box" aria-hidden="true"></span>
								<span><b>{tg.title}</b><small>{tg.note}</small></span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<div class="out">
		<small>{r.label}</small>
		<b class="total" bind:this={totalEl}
			><span>{formatNumber(shown.total)}</span>{NB}€</b
		>
		<div class="bars">
			<div class="bar">
				<span><i class="c1"></i>{r.time}</span>
				<b>{euros(shown.time)}</b>
				<em><i class="c1" style:width="{grow ? 0 : result.bars.time}%"></i></em>
				<small>{hoursText(result.hours, r.hours)}</small>
			</div>
			<div class="bar">
				<span><i class="c2"></i>{r.risk}</span>
				<b>{euros(shown.risk)}</b>
				<em><i class="c2" style:width="{grow ? 0 : result.bars.risk}%"></i></em>
				<small>{riskText(count, result.riskBase, r.riskLine, r.noRisk)}</small>
			</div>
		</div>
		<div class="kpi">
			<div>
				<b>{formatNumber(shown.days)}</b><small>{r.days}</small>
			</div>
			<div>
				<b>{euros(shown.perUnit)}</b><small>{r.perUnit}</small>
			</div>
		</div>
		<a class="go" href={r.cta.href} onclick={focusSignup}
			>{r.cta.text} <span class="ar" aria-hidden="true">→</span></a
		>
		<p class="note">{r.note}</p>
		<p class="sr-only" role="status">{status}</p>
	</div>
</div>

<style>
	.calc {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
		gap: 18px;
		margin-top: 48px;
		align-items: start;
		scroll-margin-top: 72px;
	}
	.inputs {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 8px 26px;
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.3);
	}
	.grp {
		padding: 22px 0;
		border-bottom: 1px solid var(--hair);
	}
	.grp:last-child {
		border-bottom: 0;
	}
	/* `.grp h2`: beats the landing reset of heading margins and spacing. */
	.grp h2 {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.grp h2 i {
		font-style: normal;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #eef4ef;
		color: #2f7a3c;
		display: grid;
		place-items: center;
		font-size: 12px;
		font-weight: 700;
		flex: none;
	}
	.sub {
		font-size: 13px;
		color: var(--muted);
		margin-top: 4px;
	}
	.sl {
		display: block;
		margin-top: 16px;
	}
	.lb {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-size: 14px;
		color: #3e4d49;
		line-height: 1.35;
	}
	.lb b {
		flex: none;
		font-weight: 600;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: linear-gradient(
			90deg,
			var(--accent-deep) var(--p),
			#e4e8e6 var(--p)
		);
		outline: 0;
		margin: 8px 0 2px;
		cursor: pointer;
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
	.tgs {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
		margin-top: 14px;
	}
	.tgl {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		text-align: left;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 14px;
		padding: 12px;
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.tgl:hover {
		border-color: #c9d2ce;
	}
	.tgl b {
		display: block;
		font-size: 13.5px;
		font-weight: 600;
		color: var(--ink);
		line-height: 1.3;
	}
	.tgl small {
		display: block;
		font-size: 12px;
		color: var(--muted);
		margin-top: 3px;
	}
	.box {
		flex: none;
		width: 18px;
		height: 18px;
		border-radius: 6px;
		border: 1.5px solid #c9d2ce;
		margin-top: 1px;
		position: relative;
		transition: all 0.2s;
	}
	.tgl[aria-pressed="true"] {
		background: #fbf3ef;
		border-color: #f2c9b8;
	}
	.tgl[aria-pressed="true"] .box {
		background: #a8431a;
		border-color: #a8431a;
	}
	.tgl[aria-pressed="true"] .box::after {
		content: "";
		position: absolute;
		left: 5px;
		top: 1.5px;
		width: 4px;
		height: 9px;
		border: solid #fff;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.out {
		position: sticky;
		top: 96px;
		background: var(--ink);
		color: #fff;
		border-radius: 22px;
		padding: 28px;
	}
	.out > small {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.65);
	}
	.total {
		display: block;
		font-size: clamp(40px, 4.4vw, 56px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1.05;
		margin-top: 6px;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}
	.bars {
		display: grid;
		gap: 16px;
		margin-top: 24px;
		padding-top: 20px;
		border-top: 1px solid rgba(255, 255, 255, 0.12);
	}
	.bar {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 6px 12px;
		align-items: center;
	}
	.bar > span {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13.5px;
		color: rgba(255, 255, 255, 0.85);
	}
	.bar > span i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex: none;
	}
	.bar > b {
		font-size: 15px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.bar em {
		grid-column: 1/-1;
		height: 6px;
		border-radius: 3px;
		background: rgba(255, 255, 255, 0.1);
		overflow: hidden;
	}
	.bar em i {
		display: block;
		height: 100%;
		border-radius: 3px;
		transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.bar small {
		grid-column: 1/-1;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.55);
	}
	.c1 {
		background: var(--accent);
	}
	.c2 {
		background: #f2b79e;
	}
	.kpi {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: 22px;
	}
	.kpi div {
		background: rgba(255, 255, 255, 0.06);
		border-radius: 14px;
		padding: 14px;
	}
	.kpi b {
		display: block;
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}
	.kpi small {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.6);
	}
	/* .bk-next.inv.es-go: `.bk-next.inv` wins over `.es-go`'s full width and
	   margin, so the design's button sits inline under the figures. */
	.go {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background: var(--accent);
		color: var(--ink);
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 18px;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.go:hover {
		background: #fff;
	}
	.go:active {
		transform: scale(0.98);
	}
	.go .ar {
		transition: transform 0.25s;
	}
	.go:hover .ar {
		transform: translateX(4px);
	}
	.note {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
		margin-top: 12px;
		line-height: 1.45;
	}

	@media (max-width: 900px) {
		.calc {
			grid-template-columns: minmax(0, 1fr);
		}
		.out {
			position: static;
		}
	}
	@media (max-width: 560px) {
		.inputs {
			padding: 4px 18px;
		}
		.tgs {
			grid-template-columns: minmax(0, 1fr);
		}
		.out {
			padding: 22px;
		}
		.lb {
			flex-direction: column;
			gap: 2px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bar em i {
			transition: none;
		}
	}
</style>
