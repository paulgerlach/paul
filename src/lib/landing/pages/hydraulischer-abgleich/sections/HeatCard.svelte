<!--
  The hero's card "Wärmebild" (the design's .svc-card.ha-card, #ha-css /
  #ha-js): the phases, the three figures (Vorlauf, Pumpe, Spreizung) and the
  drawn building whose five floors turn from blue / orange to green as the
  balancing runs: a scan line notes each floor's heat load, then each valve
  is preset and its flow changes, the pump steps down and the flow
  temperature falls from 70 to 55 °C.

  Server-rendered finished ("Abgeglichen"). With motion, the pass plays once
  when the card comes into view and again on "Ablauf ansehen"; the flow
  dashes, the riser and the pump are Web Animations whose speed follows
  each floor's flow, paused while the card is out of view. Nothing moves
  with reduced motion. The drawing is decorative; the figures and the
  caption are text.
-->
<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { prefersReducedMotion, tweenNumber } from "$lib/landing/motion";
	import { heatmap } from "../content";
	import {
		AFTER,
		BEFORE,
		color,
		de1,
		FLOOR_TOPS,
		flowOpacity,
		LOADS,
		PRESETS,
		spread,
		tone,
		type HeatState,
	} from "../heatmap";

	type Kind = "" | "ok" | "bad";
	type Floor = {
		/** The target temperature: colour and tone. */
		temp: number;
		/** The temperature as shown (tweened). */
		shown: number;
		flow: number;
		act: boolean;
		turn: boolean;
		set: boolean;
		load: boolean;
		valve: string;
	};

	const floorsOf = (s: HeatState, done: boolean): Floor[] =>
		s.temps.map((t, i) => ({
			temp: t,
			shown: t,
			flow: s.flows[i],
			act: false,
			turn: false,
			set: done,
			load: false,
			valve: done ? String(PRESETS[i]) : "–",
		}));

	let floors = $state(floorsOf(AFTER, true));
	let flowTemp = $state(AFTER.flowTemp);
	let pump = $state(AFTER.pump);
	let spreadShown = $state(spread(AFTER.temps));
	let phase = $state(2);
	let status = $state<{ text: string; kind: Kind }>({
		text: heatmap.status.done,
		kind: "ok",
	});
	let caption = $state(heatmap.captions.done);
	let captionOff = $state(false);
	let scan = $state({ on: false, y: 0, still: true });

	/** The flow dashes per floor, the riser and the pump (browser only). */
	let flowEls: SVGPathElement[] = $state([]);
	let riserEl: SVGPathElement | undefined = $state();
	let impEl: SVGGElement | undefined = $state();
	let flowAnims: (Animation | undefined)[] = [];
	let riserAnim: Animation | undefined;
	let impAnim: Animation | undefined;
	let motion = false;
	let visible = false;

	/** The current pass; a newer one makes the older one's waits fail. */
	let run = 0;
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- pending timeouts, not state
	const timers = new Set<ReturnType<typeof setTimeout>>();
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- running tweens and rate changes, not state
	const cancels = new Set<() => void>();

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

	function stopAll() {
		for (const t of timers) clearTimeout(t);
		timers.clear();
		for (const cancel of cancels) cancel();
		cancels.clear();
	}

	function tween(
		from: number,
		to: number,
		ms: number,
		set: (v: number) => void,
	) {
		cancels.add(tweenNumber(from, to, ms, set));
	}

	/** Eases an animation's speed to `to` (the design's rate()). */
	function rate(anim: Animation | undefined, to: number, ms: number) {
		if (!anim) return;
		if (ms <= 0) {
			anim.playbackRate = to;
			return;
		}
		const from = anim.playbackRate;
		const t0 = performance.now();
		let frame = requestAnimationFrame(function tick(now) {
			const p = Math.min(1, (now - t0) / ms);
			const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
			anim.playbackRate = from + (to - from) * e;
			if (p < 1) frame = requestAnimationFrame(tick);
		});
		cancels.add(() => cancelAnimationFrame(frame));
	}

	const pumpRates = (stage: number) =>
		stage === 3 ? { imp: 1.6, riser: 1.6 } : { imp: 0.8, riser: 0.9 };

	/** Jumps to a state: figures, colours and speeds at once. */
	function jump(s: HeatState, done: boolean) {
		floors = floorsOf(s, done);
		flowTemp = s.flowTemp;
		pump = s.pump;
		spreadShown = spread(s.temps);
		s.flows.forEach((f, i) => rate(flowAnims[i], f, 0));
		rate(impAnim, pumpRates(s.pump).imp, 0);
		rate(riserAnim, pumpRates(s.pump).riser, 0);
	}

	function showCaption(text: string) {
		captionOff = true;
		later(200, () => {
			caption = text;
			captionOff = false;
		});
	}

	/** The whole pass: before, heat loads, valves and pump, the result. */
	async function play() {
		if (!motion) return;
		const id = ++run;
		stopAll();
		jump(BEFORE, false);
		scan = { on: false, y: 0, still: true };
		status = { text: heatmap.status.before, kind: "bad" };
		phase = -1;
		caption = heatmap.captions.before;
		captionOff = false;
		try {
			await wait(1800, id);
			phase = 0;
			status = { text: heatmap.status.load, kind: "" };
			showCaption(heatmap.captions.load);
			scan = { on: true, y: 0, still: true };
			await wait(200, id);
			scan.still = false;
			for (let i = 0; i < floors.length; i++) {
				scan.y = FLOOR_TOPS[i] + 42 - FLOOR_TOPS[0];
				floors[i].act = true;
				await wait(240, id);
				floors[i].load = true;
				await wait(260, id);
				floors[i].act = false;
			}
			scan.on = false;
			await wait(900, id);
			for (const f of floors) f.load = false;
			phase = 1;
			status = { text: heatmap.status.setting, kind: "" };
			showCaption(heatmap.captions.setting);
			await wait(500, id);
			for (let i = 0; i < floors.length; i++) {
				floors[i].act = true;
				floors[i].turn = true;
				await wait(520, id);
				floors[i].valve = String(PRESETS[i]);
				floors[i].turn = false;
				floors[i].set = true;
				floors[i].flow = AFTER.flows[i];
				rate(flowAnims[i], AFTER.flows[i], 700);
				await wait(320, id);
				floors[i].act = false;
			}
			pump = AFTER.pump;
			rate(impAnim, pumpRates(AFTER.pump).imp, 900);
			rate(riserAnim, pumpRates(AFTER.pump).riser, 900);
			tween(BEFORE.flowTemp, AFTER.flowTemp, 1300, (v) => (flowTemp = v));
			await wait(1000, id);
			phase = 2;
			showCaption(heatmap.captions.done);
			AFTER.temps.forEach((t, i) =>
				later(i * 140, () => {
					if (id !== run) return;
					const from = floors[i].shown;
					floors[i].temp = t;
					tween(from, t, 1000, (v) => (floors[i].shown = v));
				}),
			);
			tween(
				spread(BEFORE.temps),
				spread(AFTER.temps),
				1400,
				(v) => (spreadShown = v),
			);
			await wait(1700, id);
			status = { text: heatmap.status.done, kind: "ok" };
		} catch {
			// A newer pass took over.
		}
	}

	function pauseLoops(paused: boolean) {
		for (const a of [...flowAnims, riserAnim, impAnim])
			if (paused) a?.pause();
			else a?.play();
	}

	onMount(() => {
		motion = !prefersReducedMotion();
		if (!motion) return;
		flowAnims = flowEls.map((el) =>
			el.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -28 }], {
				duration: 1000,
				iterations: Infinity,
			}),
		);
		riserAnim = riserEl?.animate(
			[{ strokeDashoffset: 0 }, { strokeDashoffset: 28 }],
			{ duration: 900, iterations: Infinity },
		);
		impAnim = impEl?.animate(
			[{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
			{ duration: 900, iterations: Infinity },
		);
		AFTER.flows.forEach((f, i) => rate(flowAnims[i], f, 0));
		rate(impAnim, pumpRates(AFTER.pump).imp, 0);
		rate(riserAnim, pumpRates(AFTER.pump).riser, 0);
		pauseLoops(!visible);
	});

	onDestroy(() => {
		run++;
		stopAll();
		for (const a of [...flowAnims, riserAnim, impAnim]) a?.cancel();
	});
</script>

<div
	class="card rv"
	role="group"
	aria-label={heatmap.label}
	{@attach inView({
		threshold: 0.15,
		once: true,
		onEnter: () => later(250, play),
	})}
	{@attach inView({
		onEnter: () => {
			visible = true;
			pauseLoops(false);
		},
		onLeave: () => {
			visible = false;
			pauseLoops(true);
		},
	})}
>
	<div class="ch">
		<div><b>{heatmap.title}</b><small>{heatmap.sub}</small></div>
		<span class={["st", status.kind]}>{status.text}</span>
	</div>
	<div class="phase">
		{#each heatmap.phases as name, k (name)}
			<span class={[k === phase && "on", k < phase && "dn"]}
				><i>{k + 1}</i>{name}</span
			>
		{/each}
		<button
			type="button"
			class="replay"
			aria-label={heatmap.replay}
			onclick={play}
			><StrokeIcon
				><path d="M4 10a6 6 0 1 0 2-4.5" /><path d="M4 3v3.5h3.5" /></StrokeIcon
			><em>{heatmap.replay}</em></button
		>
	</div>
	<div class="kpi">
		<div>
			<small>{heatmap.kpi.flow}</small><b>{Math.round(flowTemp)} °C</b>
		</div>
		<div>
			<small>{heatmap.kpi.pump}</small><b>{heatmap.kpi.stage} {pump}</b>
		</div>
		<div>
			<small>{heatmap.kpi.spread}</small><b>{de1(spreadShown)} K</b>
		</div>
	</div>
	<svg class="hb" viewBox="0 0 380 304" aria-hidden="true">
		<path class="roof" d="M34 46L190 10L346 46" />
		<rect class="shell" x="40" y="46" width="300" height="220" rx="2" />
		{#each floors as f, i (i)}
			{@const y = 44 * i}
			<g
				class={[
					"fl",
					f.act && "act",
					f.turn && "turn",
					f.set && "set",
					f.load && "hlon",
				]}
				style:--c={color(f.temp)}
			>
				<rect class="room" x="42" y={47 + y} width="296" height="42" rx="3" />
				<text class="lb" x="86" y={62 + y}>{heatmap.floors[i]}</text>
				<path class="br" d={`M68 ${68 + y}H240`} />
				<path
					class="fx"
					d={`M68 ${68 + y}H240`}
					style:opacity={flowOpacity(f.flow)}
					bind:this={flowEls[i]}
				/>
				<g class="rad">
					<rect x="240" y={58 + y} width="52" height="22" rx="4" />
					<g class="fins">
						{#each [246, 252, 258, 264, 270, 276, 282, 288] as x (x)}
							<line x1={x} y1={59 + y} x2={x} y2={79 + y} />
						{/each}
					</g>
				</g>
				<g class="vl" transform={`translate(214 ${68 + y})`}>
					<circle class="vr" r="9" />
					<g class="vk"><path d="M0 -6.5V-3" /></g>
					<text y="3.4">{f.valve}</text>
				</g>
				<g class="hl" transform={`translate(146 ${68 + y})`}>
					<rect x="-24" y="-9" width="48" height="18" rx="5" />
					<text y="4">{f.load ? `${LOADS[i]} kW` : ""}</text>
				</g>
				<text class={["tp", tone(f.temp)]} x="332" y={73 + y} text-anchor="end"
					>{de1(f.shown)}</text
				>
			</g>
		{/each}
		<rect class="base" x="40" y="266" width="300" height="34" rx="2" />
		<path class="rs" d="M62 280V68" />
		<path class="rr" d="M74 280V68" />
		<path class="rfx" d="M62 280V68" bind:this={riserEl} />
		<g class="pump" transform="translate(62 284)">
			<circle r="10" />
			<g class="imp" bind:this={impEl}><path d="M0-6l5 9h-10z" /></g>
		</g>
		<g class="boiler">
			<rect x="96" y="272" width="44" height="22" rx="4" />
			<path
				class="flame"
				d="M118 289c-4 0-6-3-4-7 1 2 2 2 2 0 0-3 2-5 4-6-1 3 3 4 3 8 0 3-2 5-5 5z"
			/>
		</g>
		<text class="bt" x="148" y="287">{heatmap.boiler}</text>
		<line
			class={["scan", scan.on && "on", scan.still && "still"]}
			x1="42"
			x2="338"
			y1="46"
			y2="46"
			style:transform={`translateY(${scan.y}px)`}
		/>
	</svg>
	<div class="leg" aria-hidden="true">
		<span><i style:background="#6FA8D6"></i>{heatmap.legend.cold}</span>
		<span><i style:background="#8AD68F"></i>{heatmap.legend.ok}</span>
		<span><i style:background="#E8875A"></i>{heatmap.legend.hot}</span>
		<span><i class="dash"></i>{heatmap.legend.flow}</span>
	</div>
	<p class={["cap", captionOff && "sw"]}>{caption}</p>
	<span class="tag">{heatmap.tag}</span>
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
	/* .ha-kpi */
	.kpi {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
		margin-top: 16px;
	}
	.kpi div {
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 9px 12px;
	}
	.kpi small {
		display: block;
		font-size: 11px;
		color: var(--muted);
	}
	.kpi b {
		font-size: 18px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.02em;
	}
	/* .hb */
	.hb {
		display: block;
		width: 100%;
		height: auto;
		margin-top: 12px;
		font-family: inherit;
		overflow: visible;
	}
	.roof {
		fill: none;
		stroke: #c9d2ce;
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.shell {
		fill: #f7f9f8;
		stroke: #c9d2ce;
		stroke-width: 1.5;
	}
	.base {
		fill: #eef1ef;
		stroke: #c9d2ce;
		stroke-width: 1.5;
	}
	.room {
		fill: var(--c, #dde3e0);
		fill-opacity: 0.28;
		transition: fill 1.1s ease;
	}
	.fl.act .room {
		fill-opacity: 0.42;
	}
	.lb {
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--muted);
	}
	.br {
		fill: none;
		stroke: #e8b99f;
		stroke-width: 4;
		stroke-linecap: round;
	}
	.fx,
	.rfx {
		fill: none;
		stroke: #d9622b;
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-dasharray: 3 11;
	}
	.rs {
		fill: none;
		stroke: #e8b99f;
		stroke-width: 5;
		stroke-linecap: round;
	}
	.rr {
		fill: none;
		stroke: #a9c8e2;
		stroke-width: 5;
		stroke-linecap: round;
	}
	.rad rect {
		fill: var(--c, #c9d2ce);
		stroke: rgba(30, 50, 45, 0.25);
		transition: fill 1.1s ease;
	}
	.fins line {
		stroke: rgba(255, 255, 255, 0.55);
		stroke-width: 1.5;
	}
	.vr {
		fill: #fff;
		stroke: var(--ink);
		stroke-width: 1.5;
		transition: fill 0.3s;
	}
	.vl text {
		font-size: 9px;
		font-weight: 700;
		fill: var(--ink);
		text-anchor: middle;
	}
	.vk {
		transition: transform 0.7s cubic-bezier(0.3, 1.4, 0.5, 1);
	}
	.vk path {
		stroke: var(--ink);
		stroke-width: 1.6;
		stroke-linecap: round;
		opacity: 0;
	}
	.fl.set .vr {
		fill: var(--accent);
	}
	.fl.turn .vk {
		transform: rotate(300deg);
	}
	.fl.turn .vk path {
		opacity: 1;
	}
	.fl.turn .vl text {
		opacity: 0;
	}
	.fl.set .vl text {
		opacity: 1;
		transition: opacity 0.2s 0.5s;
	}
	.hl {
		opacity: 0;
		transition:
			opacity 0.3s,
			transform 0.3s;
	}
	.hl rect {
		fill: var(--ink);
	}
	.hl text {
		font-size: 10px;
		font-weight: 600;
		fill: #fff;
		text-anchor: middle;
	}
	.fl.hlon .hl {
		opacity: 1;
	}
	.tp {
		font-size: 13px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		fill: var(--ink);
		transition: fill 0.4s;
	}
	.tp.cold {
		fill: #3c6e99;
	}
	.tp.hot {
		fill: #b4461e;
	}
	.pump circle {
		fill: #fff;
		stroke: var(--ink);
		stroke-width: 1.5;
	}
	.imp path {
		fill: var(--ink);
	}
	.boiler rect {
		fill: #fff;
		stroke: #b9c4c0;
		stroke-width: 1.5;
	}
	.flame {
		fill: #e8875a;
		transform-box: fill-box;
		transform-origin: 50% 100%;
		animation: ha-fl 1.2s ease-in-out infinite;
	}
	@keyframes ha-fl {
		50% {
			transform: scaleY(0.82);
		}
	}
	.bt {
		font-size: 10.5px;
		fill: var(--muted);
	}
	.scan {
		stroke: var(--accent-deep);
		stroke-width: 2;
		opacity: 0;
		filter: drop-shadow(0 0 4px rgba(138, 214, 143, 0.9));
		transition:
			opacity 0.3s,
			transform 0.42s ease-in-out;
	}
	.scan.on {
		opacity: 1;
	}
	.scan.still {
		transition: opacity 0.3s;
	}
	/* .ha-leg */
	.leg {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 14px;
		justify-content: center;
		margin-top: 8px;
		font-size: 11.5px;
		color: var(--muted);
	}
	.leg span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.leg i {
		width: 10px;
		height: 10px;
		border-radius: 3px;
		display: inline-block;
	}
	.leg i.dash {
		width: 16px;
		height: 0;
		border-top: 2px dashed #d9622b;
		border-radius: 0;
	}
	/* .ha-cap */
	.cap {
		margin: 10px 0 0;
		font-size: 13.5px;
		font-weight: 500;
		text-align: center;
		color: var(--muted);
		transition: opacity 0.2s;
	}
	.cap.sw {
		opacity: 0;
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
		.kpi b {
			font-size: 15px;
		}
		.kpi small {
			font-size: 10px;
		}
		.replay em {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.flame {
			animation: none;
		}
	}
	/* Nothing can replay the pass without JS. */
	@media (scripting: none) {
		.replay {
			display: none;
		}
	}
</style>
