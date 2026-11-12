<!--
  The hero's card "Bleiwert im Trinkwasser" (the design's .pb-card, #pb-js):
  the phases, the tap filling a sample bottle, the bottle going to the lab,
  the value with its unit, the scale 0–20 µg/l with the limits of 2028 and
  today, the verdict line and the three examples.

  Server-rendered finished (the 7 µg/l example's result, the bottle filled
  and capped). With motion, the pass plays once when the card comes into
  view and again on "Ablauf ansehen"; an example button jumps to its result
  and the value counts up through `tweenNumber`. Nothing with reduced
  motion. The tap is decorative; the value, the status and the verdict are
  the content. Without JS the replay and the examples are hidden.
-->
<script lang="ts">
	import { onDestroy } from "svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { prefersReducedMotion, tweenNumber } from "$lib/landing/motion";
	import { messung as m } from "../content";
	import { pointer, verdict, type Verdict } from "../messung";

	const START = 1;

	let picked = $state(START);
	const startValue = m.examples[START].value;
	const startVerdict = verdict(startValue);

	/** 0 Probe, 1 Labor, 2 Ergebnis. */
	let phase = $state(2);
	let flow = $state(false);
	let capped = $state(true);
	let lab = $state(false);
	let res = $state(true);
	let gone = $state(false);
	let full = $state(true);
	let value = $state(startValue);
	let kind = $state<Verdict | "">(startVerdict);
	let status = $state<string>(m.status[startVerdict]);
	let result = $state<string>(m.result[startVerdict]);
	let caption = $state(m.captions.result);
	let captionOff = $state(false);
	let ptr = $state(pointer(startValue));

	let water: SVGRectElement | undefined = $state();

	/** The current pass; a newer one makes the older one's waits fail. */
	let run = 0;
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- pending timeouts, not state
	const timers = new Set<ReturnType<typeof setTimeout>>();
	let stopTween: (() => void) | undefined;

	function later(ms: number, fn: () => void) {
		const t = setTimeout(() => {
			timers.delete(t);
			fn();
		}, ms);
		timers.add(t);
	}

	/** Resolves after `ms` if pass `id` is still the current one. */
	const wait = (ms: number, id: number) =>
		new Promise<void>((resolve, reject) =>
			later(ms, () => (id === run ? resolve() : reject(new Error("stale")))),
		);

	function showCaption(text: string) {
		captionOff = true;
		later(200, () => {
			caption = text;
			captionOff = false;
		});
	}

	/** The result for `v`: the pointer, the count, the status and the line. */
	function showResult(v: number) {
		const k = verdict(v);
		res = true;
		ptr = pointer(v);
		stopTween?.();
		if (prefersReducedMotion()) value = v;
		else stopTween = tweenNumber(0, v, 1100, (n) => (value = Math.round(n)));
		kind = k;
		status = m.status[k];
		result = m.result[k];
		phase = 2;
		showCaption(m.captions.result);
	}

	/** The design's reset(): an empty bottle at the tap, the cap off. */
	function reset() {
		flow = false;
		capped = false;
		lab = false;
		res = false;
		gone = false;
		stopTween?.();
		value = 0;
		kind = "";
		ptr = 0;
		status = m.status.sampling;
		result = m.result.pending;
		phase = 0;
		showCaption(m.captions.sampling);
		// The water drains at once, without its transition.
		if (water) {
			water.style.transition = "none";
			full = false;
			water.style.y = "56px";
			water.style.height = "0px";
			void water.getBBox();
			water.style.transition = "";
		} else full = false;
	}

	async function play() {
		const id = ++run;
		reset();
		try {
			await wait(500, id);
			flow = true;
			await wait(300, id);
			full = true;
			await wait(1900, id);
			flow = false;
			await wait(350, id);
			capped = true;
			await wait(500, id);
			gone = true;
			lab = true;
			phase = 1;
			status = m.status.lab;
			showCaption(m.captions.lab);
			await wait(1800, id);
			lab = false;
			showResult(m.examples[picked].value);
		} catch {
			// A newer pass took over.
		}
	}

	/** An example: straight to its result. */
	function pick(i: number) {
		run++;
		picked = i;
		lab = false;
		flow = false;
		full = true;
		showResult(m.examples[i].value);
	}

	onDestroy(() => {
		run++;
		for (const t of timers) clearTimeout(t);
		timers.clear();
		stopTween?.();
	});
</script>

<div
	class={[
		"card rv",
		flow && "is-flow",
		capped && "is-cap",
		lab && "is-lab",
		res && "is-res",
	]}
	role="group"
	aria-label={m.label}
	{@attach inView({
		threshold: 0.15,
		once: true,
		onEnter: () => {
			if (!prefersReducedMotion()) later(250, play);
		},
	})}
>
	<div class="ch">
		<div><b>{m.title}</b><small>{m.sub}</small></div>
		<span class={["st", kind]}>{status}</span>
	</div>
	<div class="phase">
		{#each m.phases as name, k (name)}
			<span class={[k === phase && "on", k < phase && "dn"]}
				><i>{k + 1}</i>{name}</span
			>
		{/each}
		<button type="button" class="replay" aria-label={m.replay} onclick={play}
			><StrokeIcon
				><path d="M4 10a6 6 0 1 0 2-4.5" /><path d="M4 3v3.5h3.5" /></StrokeIcon
			><em>{m.replay}</em></button
		>
	</div>
	<div class="top">
		<svg class="tap" viewBox="0 0 120 130" aria-hidden="true">
			<path class="pipe" d="M0 22h46" />
			<rect class="body" x="44" y="10" width="34" height="24" rx="8" />
			<path class="spout" d="M70 26h18a8 8 0 0 1 8 8v8" />
			<rect class="knob" x="54" y="2" width="14" height="8" rx="3" />
			<path class="stream" d="M96 44v54" />
			<g class={["bottle", gone && "gone"]} transform="translate(80 70)">
				<rect class="gl" x="0" y="8" width="32" height="48" rx="7" />
				<rect class="cap" x="7" y="0" width="18" height="9" rx="2" />
				<clipPath id="pb-clip"
					><rect x="1.5" y="9.5" width="29" height="45" rx="5.5" /></clipPath
				>
				<rect
					class="wt"
					bind:this={water}
					x="0"
					y={full ? 20 : 56}
					width="32"
					height={full ? 36 : 0}
					style:y={full ? "20px" : "56px"}
					style:height={full ? "36px" : "0px"}
					clip-path="url(#pb-clip)"
				/>
				<rect class="lb" x="5" y="24" width="22" height="12" rx="2" />
			</g>
		</svg>
		<div class="num">
			<small class={[captionOff && "sw"]}>{caption}</small>
			<b class={kind}>{value}<em>{m.unit}</em></b>
			<i class="spin" aria-hidden="true"></i>
		</div>
	</div>
	<div class="scale" aria-hidden="true">
		<div class="track">
			<i class="z1"></i><i class="z2"></i><i class="z3"></i>
			<span class="ptr" style:left={`${ptr}%`}></span>
		</div>
		{#each m.marks as mark (mark.value)}
			<div class="mk" style:left={`${mark.left}%`}>
				<b>{mark.value}</b><span>{mark.text}</span>
			</div>
		{/each}
		<div class="ends"><span>{m.ends[0]}</span><span>{m.ends[1]}</span></div>
	</div>
	<div class={["res", kind]}>
		<span class="d"></span><span>{result}</span>
	</div>
	<div class="types">
		{#each m.examples as ex, i (ex.value)}
			<button
				type="button"
				class={[picked === i && "on"]}
				aria-pressed={picked === i}
				onclick={() => pick(i)}><b>{ex.title}</b><small>{ex.sub}</small></button
			>
		{/each}
	</div>
	<span class="tag">{m.tag}</span>
</div>

<style>
	/* .svc-card */
	.card {
		position: relative;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 24px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.35);
	}
	/* .ea-ch */
	.ch {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
	}
	.ch b {
		display: block;
		font-size: 18px;
		font-weight: 600;
	}
	.ch small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		margin-top: 2px;
	}
	/* .lg-st */
	.st {
		font-size: 12px;
		font-weight: 600;
		background: #eef1ef;
		color: var(--muted);
		border-radius: 999px;
		padding: 4px 10px;
		white-space: nowrap;
		transition:
			background 0.3s,
			color 0.3s;
	}
	.st.ok {
		background: #e3f3e4;
		color: #2f7a3c;
	}
	.st.bad {
		background: #fbe3dc;
		color: #a8452e;
	}
	.st.warn {
		background: #fbf1d9;
		color: #7a5a12;
	}
	/* .lg-phase */
	.phase {
		display: flex;
		gap: 6px;
		margin-top: 18px;
		align-items: center;
		flex-wrap: wrap;
	}
	.phase span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 600;
		color: var(--faint);
		border: 1px solid var(--hair);
		border-radius: 999px;
		padding: 3px 10px 3px 4px;
		transition:
			color 0.3s,
			border-color 0.3s,
			background 0.3s;
	}
	.phase i {
		font-style: normal;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #eef1ef;
		display: grid;
		place-items: center;
		font-size: 10.5px;
		transition:
			background 0.3s,
			color 0.3s;
	}
	.phase span.on {
		color: var(--ink);
		border-color: var(--ink);
	}
	.phase span.on i {
		background: var(--ink);
		color: #fff;
	}
	.phase span.dn {
		color: #2f7a3c;
		border-color: rgba(62, 154, 87, 0.4);
	}
	.phase span.dn i {
		background: var(--accent);
		color: var(--ink);
	}
	/* .lg-replay */
	.replay {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		margin-left: auto;
		border: 0;
		background: none;
		font: inherit;
		font-size: 12px;
		font-weight: 500;
		color: var(--muted);
		cursor: pointer;
		padding: 3px 2px;
		transition: color 0.2s;
	}
	.replay:hover {
		color: var(--ink);
	}
	.replay :global(svg) {
		width: 13px;
		height: 13px;
	}
	.replay em {
		font-style: normal;
	}
	/* .pb-top, .pb-tap */
	.top {
		display: grid;
		grid-template-columns: 120px minmax(0, 1fr);
		gap: 18px;
		align-items: center;
		margin-top: 14px;
	}
	.tap {
		width: 120px;
		height: 130px;
		overflow: visible;
	}
	.tap .pipe {
		stroke: #c9d2ce;
		stroke-width: 8;
		stroke-linecap: round;
	}
	.tap .body,
	.tap .knob {
		fill: #dde3e0;
		stroke: #b9c4c0;
		stroke-width: 1.5;
	}
	.tap .spout {
		fill: none;
		stroke: #b9c4c0;
		stroke-width: 8;
		stroke-linecap: round;
	}
	.tap .knob {
		transform-box: fill-box;
		transform-origin: center;
		transition: rotate 0.5s;
	}
	.card.is-flow .tap .knob {
		rotate: -35deg;
	}
	.tap .stream {
		stroke: #8dbee3;
		stroke-width: 4;
		stroke-linecap: round;
		stroke-dasharray: 54;
		stroke-dashoffset: 54;
		transition: stroke-dashoffset 0.5s ease-in;
	}
	.card.is-flow .tap .stream {
		stroke-dashoffset: 0;
		animation: pb-stream 0.5s linear infinite;
	}
	@keyframes pb-stream {
		50% {
			stroke-width: 3;
		}
	}
	.tap .gl {
		fill: rgba(255, 255, 255, 0.9);
		stroke: var(--ink);
		stroke-width: 1.5;
	}
	.tap .cap {
		fill: var(--ink);
		transition: translate 0.4s;
		translate: 0 -12px;
	}
	.card.is-cap .tap .cap {
		translate: 0 0;
	}
	.tap .wt {
		fill: #9cc7e8;
		transition:
			y 1.8s ease-in,
			height 1.8s ease-in;
	}
	.tap .lb {
		fill: #fff;
		stroke: #c9d2ce;
		opacity: 0.9;
	}
	.tap .bottle {
		transition:
			translate 0.7s cubic-bezier(0.5, 0, 0.2, 1),
			opacity 0.5s;
	}
	.tap .bottle.gone {
		translate: 60px 0;
		opacity: 0;
	}
	/* .pb-num */
	.num {
		position: relative;
		min-width: 0;
	}
	.num small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		transition: opacity 0.2s;
	}
	.num small.sw {
		opacity: 0;
	}
	.num b {
		display: flex;
		align-items: baseline;
		gap: 6px;
		font-size: 52px;
		font-weight: 600;
		letter-spacing: -0.04em;
		line-height: 1.05;
		font-variant-numeric: tabular-nums;
		transition: color 0.4s;
	}
	.num b em {
		font-style: normal;
		font-size: 15px;
		font-weight: 500;
		color: var(--muted);
		letter-spacing: 0;
	}
	.num b.ok {
		color: #2f7a3c;
	}
	.num b.warn {
		color: #9a6b10;
	}
	.num b.bad {
		color: #b4461e;
	}
	.spin {
		position: absolute;
		left: 0;
		top: 26px;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		border: 3px solid #e3e8e6;
		border-top-color: var(--accent-deep);
		opacity: 0;
		animation: pb-spin 0.8s linear infinite;
		transition: opacity 0.2s;
	}
	.card.is-lab .spin {
		opacity: 1;
	}
	.card.is-lab .num b {
		opacity: 0.15;
	}
	@keyframes pb-spin {
		to {
			rotate: 360deg;
		}
	}
	/* .pb-scale */
	.scale {
		position: relative;
		margin-top: 20px;
		padding: 22px 0 18px;
	}
	.track {
		position: relative;
		display: flex;
		height: 12px;
		border-radius: 999px;
		overflow: visible;
	}
	.track i {
		display: block;
		height: 100%;
	}
	.track .z1 {
		width: 25%;
		background: #bfe3c3;
		border-radius: 999px 0 0 999px;
	}
	.track .z2 {
		width: 25%;
		background: #f4dfa8;
	}
	.track .z3 {
		width: 50%;
		background: #f4c2ae;
		border-radius: 0 999px 999px 0;
	}
	.ptr {
		position: absolute;
		top: 50%;
		width: 20px;
		height: 20px;
		margin: -10px 0 0 -10px;
		border-radius: 50%;
		background: #fff;
		border: 3px solid var(--ink);
		box-shadow: 0 2px 8px rgba(30, 50, 45, 0.25);
		transition:
			left 1.2s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.3s;
		opacity: 0;
	}
	.card.is-res .ptr {
		opacity: 1;
	}
	.mk {
		position: absolute;
		top: 0;
		translate: -50% 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 10.5px;
		color: var(--muted);
		white-space: nowrap;
	}
	.mk b {
		font-size: 11px;
		color: var(--ink);
	}
	.mk span {
		position: absolute;
		top: 44px;
	}
	.mk::after {
		content: "";
		position: absolute;
		top: 16px;
		height: 20px;
		border-left: 1.5px dashed var(--ink);
		opacity: 0.5;
	}
	.ends {
		display: flex;
		justify-content: space-between;
		font-size: 10.5px;
		color: var(--faint);
		margin-top: 26px;
	}
	/* .lg-res.pb-res */
	.res {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 14px;
		padding: 12px 14px;
		border-radius: 12px;
		background: var(--bg);
		font-size: 14px;
		font-weight: 500;
		transition:
			background 0.3s,
			color 0.3s;
	}
	.res .d {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #b9c4c0;
		flex: none;
		transition: background 0.3s;
	}
	.res.ok {
		background: #eaf6eb;
		color: #24452f;
	}
	.res.ok .d {
		background: #3e9a57;
	}
	.res.warn {
		background: #fbf4e2;
		color: #6e520f;
	}
	.res.warn .d {
		background: #d9a12b;
	}
	.res.bad {
		background: #fcede8;
		color: #8a3520;
	}
	.res.bad .d {
		background: #d9622b;
		animation: pb-pulse 1.6s ease-in-out infinite;
	}
	@keyframes pb-pulse {
		50% {
			opacity: 0.35;
		}
	}
	/* .ea-types.pb-types */
	.types {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
		margin-top: 14px;
	}
	.types button {
		min-width: 0;
		overflow-wrap: normal;
		hyphens: auto;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 12px;
		padding: 12px 14px;
		text-align: left;
		font: inherit;
		cursor: pointer;
		color: var(--ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.types b {
		display: block;
		font-size: 14.5px;
	}
	.types small {
		display: block;
		font-size: 12px;
		color: var(--muted);
		margin-top: 2px;
		overflow-wrap: normal;
		hyphens: auto;
	}
	.types button.on {
		border-color: var(--ink);
		background: var(--bg);
	}
	/* .dbm-demo.ea-tag */
	.tag {
		position: absolute;
		right: 14px;
		bottom: -12px;
		display: inline-flex;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	@media (max-width: 640px) {
		.top {
			grid-template-columns: 96px minmax(0, 1fr);
			gap: 12px;
		}
		.tap {
			width: 96px;
			height: 104px;
		}
		.num b {
			font-size: 42px;
		}
		.types small {
			font-size: 11px;
		}
		.replay em {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.res.bad .d {
			animation: none;
		}
	}
	/* Nothing can switch or replay the example without JS. */
	@media (scripting: none) {
		.replay,
		.types {
			display: none;
		}
	}
</style>
