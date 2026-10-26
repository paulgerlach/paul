<!--
  Step 3's picture: a small Heidi dashboard on example data (the design's
  .vd). Each time the step becomes active it plays once: the KPIs count up,
  the chart draws, the meter rows tick, "Abrechnung erstellen" is pressed and
  runs, the toast appears (the design's #vd-js, 4.25 s). Server-rendered and
  with reduced motion in its end state; leaving the step cancels the pass.
-->
<script lang="ts">
	import { prefersReducedMotion, tweenNumber } from "$lib/landing/motion";
	import { steps } from "../content";

	let { active }: { active: boolean } = $props();

	const demo = steps.demo;
	const DONE = ["s-in", "s-chart", "s-done", "s-toast"];
	/** "1.284" → 1284; the dot groups thousands. */
	const target = (to: string) => Number(to.replaceAll(".", ""));
	const format = (n: number, to: string) =>
		to.includes(".")
			? Math.round(n).toLocaleString("de-DE")
			: String(Math.round(n));

	let stage = $state<string[]>(DONE);
	let ticked = $state(demo.meters.rows.length);
	let figures = $state(demo.kpis.map((k) => k.to));

	function play() {
		const timers: ReturnType<typeof setTimeout>[] = [];
		const cancels: (() => void)[] = [];
		const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
		stage = [];
		ticked = 0;
		figures = demo.kpis.map(() => "0");
		at(60, () => {
			stage = ["s-in"];
			demo.kpis.forEach((k, i) =>
				cancels.push(
					tweenNumber(
						0,
						target(k.to),
						1100,
						(n) => (figures[i] = format(n, k.to)),
					),
				),
			);
		});
		at(500, () => (stage = [...stage, "s-chart"]));
		demo.meters.rows.forEach((_, i) =>
			at(1200 + i * 260, () => (ticked = i + 1)),
		);
		at(2700, () => (stage = [...stage, "s-press"]));
		at(
			2880,
			() => (stage = [...stage.filter((s) => s !== "s-press"), "s-run"]),
		);
		at(
			4250,
			() =>
				(stage = [...stage.filter((s) => s !== "s-run"), "s-done", "s-toast"]),
		);
		return () => {
			timers.forEach(clearTimeout);
			cancels.forEach((c) => c());
		};
	}

	$effect(() => {
		if (!active || prefersReducedMotion()) return;
		return play();
	});
</script>

<div class={["vd", ...stage]}>
	<div class="top">
		<span class="logo"
			><svg viewBox="0 0 14 14" aria-hidden="true"
				><rect x="1" y="2" width="3" height="10" rx="1.5" fill="#fff" /><rect
					x="5.5"
					y="2"
					width="3"
					height="10"
					rx="1.5"
					fill="#fff"
				/><rect x="10" y="2" width="3" height="10" rx="1.5" fill="#fff" /></svg
			></span
		>
		<span class="sel"><b>{demo.property}</b><small>{demo.units}</small></span>
		<span class="per">{demo.period}</span>
		<span class="tag">{demo.tag}</span>
	</div>
	<div class="kpis">
		{#each demo.kpis as kpi, i (kpi.label)}
			<div class="k">
				<small>{kpi.label}</small>
				<b>{figures[i]} <em>{kpi.unit}</em></b>
				<span class="d">{kpi.delta}</span>
			</div>
		{/each}
	</div>
	<div class="main">
		<div class="card ch">
			<div class="ch-h">
				<b>{demo.chart.title}</b>
				<span
					><i class="lg c"></i>{demo.chart.current}
					<i class="lg p"></i>{demo.chart.previous}</span
				>
			</div>
			<svg viewBox="-4 -6 308 122" preserveAspectRatio="none" aria-hidden="true"
				><g class="gl"
					><line x1="0" x2="300" y1="0" y2="0" /><line
						x1="0"
						x2="300"
						y1="27.5"
						y2="27.5"
					/><line x1="0" x2="300" y1="55" y2="55" /><line
						x1="0"
						x2="300"
						y1="82.5"
						y2="82.5"
					/><line x1="0" x2="300" y1="110" y2="110" /></g
				><defs
					><clipPath id="vd-clip"
						><rect
							class="cr"
							x="-4"
							y="-6"
							width="308"
							height="122"
						/></clipPath
					></defs
				><path
					class="pre"
					d="M0.0,3.4 L33.3,15.2 L66.7,29.6 L100.0,54.2 L133.3,79.5 L166.7,92.2 L200.0,96.5 L233.3,93.9 L266.7,77.0 L300.0,42.3"
				/><g clip-path="url(#vd-clip)"
					><path
						class="area"
						d="M0.0,10.2 L33.3,22.0 L66.7,37.2 L100.0,60.9 L133.3,83.8 L166.7,94.8 L200.0,98.2 L233.3,96.5 L266.7,81.2 L300.0,49.1 L300,110 L0,110 Z"
					/><path
						class="line"
						d="M0.0,10.2 L33.3,22.0 L66.7,37.2 L100.0,60.9 L133.3,83.8 L166.7,94.8 L200.0,98.2 L233.3,96.5 L266.7,81.2 L300.0,49.1"
					/></g
				></svg
			>
			<div class="x">
				{#each demo.chart.months as m (m)}<span>{m}</span>{/each}
			</div>
		</div>
		<div class="card st">
			<b class="st-h">{demo.meters.title}</b>
			<ul>
				{#each demo.meters.rows as row, i (row.label)}
					<li class={{ on: i < ticked }}>
						<span class="n">{row.count}</span><span class="l">{row.label}</span
						><i class="ok">{@render tick()}</i>
					</li>
				{/each}
			</ul>
			<span class="mk" aria-hidden="true"
				><i class="prog"></i><span class="t0">{demo.button[0]}</span><span
					class="t1">{demo.button[1]}</span
				><span class="t2">{@render tick()} {demo.button[2]}</span></span
			>
		</div>
	</div>
	<div class="toast">
		<span class="ti"
			><svg
				width="16"
				height="16"
				viewBox="0 0 20 20"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				><path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
					d="M12 2.5V6h3.5M8 10h5M8 13h5"
				/></svg
			></span
		>
		<span><b>{demo.toast.title}</b><small>{demo.toast.sub}</small></span>
	</div>
</div>

{#snippet tick()}
	<svg viewBox="0 0 12 10" width="10" aria-hidden="true"
		><path
			d="M1 5l3.5 3.5L11 1"
			stroke="#1E322D"
			stroke-width="2"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/></svg
	>
{/snippet}

<style>
	.vd {
		position: absolute;
		inset: 0;
		background: #eef2f0;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-size: 12px;
		color: var(--ink);
		text-align: left;
	}
	.top {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #fff;
		border-radius: 12px;
		padding: 8px 12px;
	}
	.logo {
		width: 26px;
		height: 26px;
		border-radius: 7px;
		background: #1e322d;
		display: grid;
		place-items: center;
		flex: none;
	}
	.logo svg {
		width: 14px;
		height: 14px;
		display: block;
	}
	.sel {
		border-left: 1px solid #e4eae6;
		padding-left: 12px;
		line-height: 1.2;
	}
	.sel b {
		display: block;
		font-size: 12.5px;
		font-weight: 600;
	}
	.sel small {
		color: var(--muted);
		font-size: 10.5px;
	}
	.per {
		margin-left: auto;
		background: #f1f4f2;
		border-radius: 999px;
		padding: 4px 10px;
		font-size: 11px;
		font-weight: 500;
	}
	.tag {
		background: #e6f5e7;
		color: #2f7a3c;
		border-radius: 999px;
		padding: 4px 9px;
		font-size: 10.5px;
		font-weight: 600;
	}
	.kpis {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
	}
	.k {
		background: #fff;
		border-radius: 12px;
		padding: 10px 12px;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.45s,
			transform 0.45s;
	}
	.k small {
		display: block;
		color: var(--muted);
		font-size: 10.5px;
	}
	.k b {
		display: block;
		font-size: 19px;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
		margin-top: 2px;
	}
	.k b em {
		font-style: normal;
		font-size: 11px;
		font-weight: 500;
		color: var(--muted);
	}
	.d {
		display: inline-block;
		margin-top: 4px;
		font-size: 10px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 1px 7px;
	}
	.main {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
		gap: 10px;
	}
	.card {
		background: #fff;
		border-radius: 12px;
		padding: 12px;
		display: flex;
		flex-direction: column;
		min-height: 0;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.45s,
			transform 0.45s;
	}
	.ch-h {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.ch-h b {
		font-size: 13px;
		font-weight: 600;
	}
	.ch-h span {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 10px;
		color: var(--muted);
	}
	.lg {
		display: inline-block;
		width: 12px;
		height: 2px;
		border-radius: 1px;
	}
	.lg.c {
		background: #1e322d;
	}
	.lg.p {
		background: repeating-linear-gradient(
			90deg,
			#9aa5a1 0 3px,
			transparent 3px 5px
		);
		margin-left: 6px;
	}
	.ch svg {
		flex: 1;
		min-height: 0;
		width: 100%;
		margin-top: 8px;
		overflow: visible;
	}
	.gl line {
		stroke: #eef1ef;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
	.pre {
		fill: none;
		stroke: #b9c4c0;
		stroke-width: 1.5;
		stroke-dasharray: 4 3;
		vector-effect: non-scaling-stroke;
		opacity: 0;
		transition: opacity 0.6s;
	}
	.line {
		fill: none;
		stroke: #1e322d;
		stroke-width: 2.2;
		stroke-linejoin: round;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}
	.cr {
		transform: scaleX(0);
		transform-origin: 0 0;
		transform-box: view-box;
	}
	.area {
		fill: #8ad68f;
		opacity: 0.16;
	}
	.x {
		display: flex;
		justify-content: space-between;
		color: var(--faint);
		font-size: 9.5px;
		margin-top: 4px;
	}
	.st-h {
		font-size: 13px;
		font-weight: 600;
	}
	.st ul {
		list-style: none;
		margin: 8px 0 0;
		padding: 0;
		display: grid;
		gap: 6px;
	}
	.st li {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) 18px;
		gap: 8px;
		align-items: center;
		padding: 6px 0;
		border-bottom: 1px solid #f0f3f1;
	}
	.n {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.l {
		color: var(--muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 11px;
	}
	.ok {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #8ad68f;
		color: #1e322d;
		display: grid;
		place-items: center;
		transform: scale(0);
		transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.ok :global(svg) {
		width: 10px;
		height: 10px;
	}
	.st li.on .ok {
		transform: none;
	}
	/* The design's (inert) <button>, a span here: it's only a picture. */
	.mk {
		position: relative;
		overflow: hidden;
		margin-top: auto;
		border-radius: 10px;
		background: #1e322d;
		color: #fff;
		font-size: 12px;
		font-weight: 600;
		padding: 10px;
		display: grid;
		place-items: center;
		transition:
			transform 0.15s,
			background 0.3s;
	}
	.mk > span {
		grid-area: 1/1;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		transition: opacity 0.25s;
	}
	.mk .t1,
	.mk .t2 {
		opacity: 0;
	}
	.mk :global(svg) {
		width: 12px;
		height: 12px;
	}
	.prog {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 0;
		background: rgba(138, 214, 143, 0.28);
	}
	.vd.s-press .mk {
		transform: scale(0.95);
	}
	.vd.s-run .mk .t0 {
		opacity: 0;
	}
	.vd.s-run .mk .t1 {
		opacity: 1;
	}
	.vd.s-run .prog {
		width: 100%;
		transition: width 1.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.vd.s-done .mk {
		background: #8ad68f;
		color: #1e322d;
	}
	.vd.s-done .mk .t0,
	.vd.s-done .mk .t1 {
		opacity: 0;
	}
	.vd.s-done .mk .t2 {
		opacity: 1;
	}
	.vd.s-done .prog {
		opacity: 0;
	}
	.toast {
		position: absolute;
		right: 16px;
		bottom: 16px;
		display: flex;
		align-items: center;
		gap: 10px;
		background: #fff;
		border-radius: 12px;
		padding: 10px 14px;
		box-shadow: 0 20px 40px -18px rgba(30, 50, 45, 0.45);
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 0.45s,
			transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ti {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: #1e322d;
		color: #8ad68f;
		display: grid;
		place-items: center;
	}
	.ti svg {
		width: 15px;
		height: 15px;
	}
	.toast b {
		display: block;
		font-size: 12.5px;
		font-weight: 600;
	}
	.toast small {
		display: block;
		font-size: 10.5px;
		color: var(--muted);
	}
	.vd.s-in .k,
	.vd.s-in .card {
		opacity: 1;
		transform: none;
	}
	.vd.s-in .k:nth-child(2) {
		transition-delay: 0.08s;
	}
	.vd.s-in .k:nth-child(3) {
		transition-delay: 0.16s;
	}
	.vd.s-in .card {
		transition-delay: 0.22s;
	}
	.vd.s-chart .cr {
		transform: none;
		transition: transform 1.6s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.vd.s-chart .pre {
		opacity: 1;
	}
	.vd.s-toast .toast {
		opacity: 1;
		transform: none;
	}
	@media (max-width: 640px) {
		.ch-h span {
			display: none;
		}
		.vd {
			padding: 10px;
			gap: 8px;
			font-size: 11px;
		}
		.tag,
		.per {
			display: none;
		}
		.k {
			padding: 8px;
		}
		.k b {
			font-size: 15px;
		}
		.d {
			display: none;
		}
		.main {
			grid-template-columns: 1fr 1fr;
		}
		.st li {
			padding: 3px 0;
			grid-template-columns: 1fr 18px;
		}
		.l {
			display: none;
		}
		.toast {
			left: 10px;
			right: 10px;
			bottom: 10px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.vd,
		.vd * {
			transition: none !important;
		}
	}
</style>
