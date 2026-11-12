<!--
  The hero's card "Befund Trinkwasser" (the design's .lg-card, #lg-js): the
  phases, the schematic of the hot-water system where a vial takes four
  samples, the lab rack, and the evaluation with the four values against the
  Maßnahmenwert 100. "Unauffällig" / "Auffällig" switch the example.

  Server-rendered finished (the evaluation of the "Auffällig" example). With
  motion, the sampling plays once when the card comes into view and again on
  "Ablauf ansehen"; the vial's flights are measured from the layout when they
  start (Web Animations). Nothing with reduced motion. The stage is
  decorative and hidden from screen readers; the evaluation is the content.
-->
<script lang="ts">
	import { onDestroy } from "svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { prefersReducedMotion, tweenNumber } from "$lib/landing/motion";
	import {
		barWidth,
		isHigh,
		PIPE_LENGTHS,
		SAMPLES,
		START_SET,
		verdict,
	} from "../befund";
	import { befund, type SampleSet } from "../content";

	type Status = "" | "ok" | "bad";

	const startValues = SAMPLES[START_SET];
	const startVerdict = verdict(startValues);

	let set = $state<SampleSet>(START_SET);
	let phase = $state(2);
	let ev = $state(true);
	let lab = $state(false);
	let status = $state<{ text: string; kind: Status }>({
		text: befund.status[startVerdict],
		kind: startVerdict,
	});
	let result = $state<{ text: string; kind: Status }>({
		text: befund.result[startVerdict],
		kind: startVerdict,
	});
	let caption = $state(befund.captions.start);
	let captionOff = $state(false);
	let points = $state<("" | "act" | "dn")[]>(["", "", "", ""]);
	let pipe = $state(-1);
	let tray = $state(0);
	let rack = $state(
		startValues.map(() => ({ rd: false, hi: false, value: 0 })),
	);
	let scan = $state({ on: false, left: 0 });
	let tip = $state({ on: false, text: "", x: 0, y: 0 });
	let vialShown = $state(false);
	let vialFull = $state(false);
	let bars = $state(
		startValues.map((v) => ({ width: barWidth(v), value: v, hi: isHigh(v) })),
	);

	let stage: HTMLDivElement | undefined = $state();
	let vial: HTMLDivElement | undefined = $state();
	let trayEl: HTMLDivElement | undefined = $state();
	let rackEl: HTMLDivElement | undefined = $state();
	const spots: SVGGElement[] = $state([]);
	const vials: HTMLSpanElement[] = $state([]);

	/** The current sequence; a newer one makes the older one's waits fail. */
	let run = 0;
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- pending timeouts, not state
	const timers = new Set<ReturnType<typeof setTimeout>>();
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- running tweens, not state
	const tweens = new Set<() => void>();
	let vialAt: [number, number] | null = null;

	function later(ms: number, fn: () => void) {
		const t = setTimeout(() => {
			timers.delete(t);
			fn();
		}, ms);
		timers.add(t);
	}

	/** Resolves after `ms` if sequence `id` is still the current one. */
	const wait = (ms: number, id: number) =>
		new Promise<void>((resolve, reject) =>
			later(ms, () => (id === run ? resolve() : reject(new Error("stale")))),
		);

	function tween(to: number, ms: number, set: (v: number) => void) {
		const cancel = tweenNumber(0, to, ms, (v) => set(Math.round(v)));
		tweens.add(cancel);
	}

	function stopTweens() {
		for (const cancel of tweens) cancel();
		tweens.clear();
	}

	function stopVial() {
		for (const a of vial?.getAnimations() ?? []) a.cancel();
		vialShown = false;
		vialFull = false;
		vialAt = null;
	}

	function showCaption(text: string) {
		captionOff = true;
		later(200, () => {
			caption = text;
			captionOff = false;
		});
	}

	/** An element's centre in the stage's coordinates. */
	function centre(el: Element): [number, number] {
		const r = el.getBoundingClientRect();
		const b = stage!.getBoundingClientRect();
		return [r.left + r.width / 2 - b.left, r.top + r.height / 2 - b.top];
	}

	/** The vial's arc to `to`, from where it was (or from up left). */
	function flyVial(to: [number, number]) {
		const from = vialAt ?? [to[0] - 60, to[1] - 40];
		vialAt = to;
		vialShown = true;
		const mx = (from[0] + to[0]) / 2;
		const my = Math.min(from[1], to[1]) - 34;
		vial?.animate(
			[
				{ transform: `translate(${from[0]}px,${from[1]}px) rotate(0deg)` },
				{
					transform: `translate(${mx}px,${my}px) rotate(-10deg)`,
					offset: 0.5,
				},
				{ transform: `translate(${to[0]}px,${to[1]}px) rotate(0deg)` },
			],
			{ duration: 760, easing: "cubic-bezier(.45,0,.2,1)", fill: "forwards" },
		);
	}

	/** The evaluation of example `key`: the bars grow, then the verdict. */
	async function evaluate(key: SampleSet) {
		const id = ++run;
		const values = SAMPLES[key];
		const v = verdict(values);
		stopTweens();
		if (prefersReducedMotion()) {
			bars = values.map((x) => ({
				width: barWidth(x),
				value: x,
				hi: isHigh(x),
			}));
			status = { text: befund.status[v], kind: v };
			result = { text: befund.result[v], kind: v };
			return;
		}
		status = { text: befund.status.pending, kind: "" };
		result = { text: befund.result.pending, kind: "" };
		// Each figure keeps its old value until its count starts.
		bars = values.map((x, i) => ({
			width: 0,
			value: bars[i].value,
			hi: isHigh(x),
		}));
		values.forEach((x, i) =>
			later(200 + i * 220, () => {
				if (id !== run) return;
				bars[i].width = barWidth(x);
				tween(x, 900, (n) => (bars[i].value = n));
			}),
		);
		try {
			await wait(200 + values.length * 220 + 900, id);
			status = { text: befund.status[v], kind: v };
			result = { text: befund.result[v], kind: v };
		} catch {
			// A newer sequence took over.
		}
	}

	/** The whole pass: four samples, the lab, then the evaluation. */
	async function sample() {
		if (!stage || !vial || !trayEl || !rackEl) return;
		const id = ++run;
		stopTweens();
		stopVial();
		const values = SAMPLES[set];
		status = { text: befund.status.sampling, kind: "" };
		phase = 0;
		ev = false;
		lab = false;
		points = ["", "", "", ""];
		pipe = -1;
		tray = 0;
		rack = values.map(() => ({ rd: false, hi: false, value: 0 }));
		scan = { on: false, left: 0 };
		tip.on = false;
		caption = befund.captions.start;
		try {
			await wait(450, id);
			for (let k = 0; k < values.length; k++) {
				pipe = k;
				points[k] = "act";
				vialFull = false;
				const p = centre(spots[k]);
				flyVial(p);
				showCaption(befund.captions.sample.replace("{n}", String(k + 1)));
				await wait(780, id);
				tip = { on: true, text: befund.points[k], x: p[0], y: p[1] };
				vialFull = true;
				await wait(1050, id);
				points[k] = "dn";
				tip.on = false;
				tray = k + 1;
				await wait(260, id);
			}
			pipe = -1;
			const t = centre(trayEl);
			flyVial([t[0], t[1] + 40]);
			vial.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 500,
				delay: 300,
				fill: "forwards",
			});
			await wait(700, id);
			lab = true;
			phase = 1;
			status = { text: befund.status.lab, kind: "" };
			showCaption(befund.captions.lab);
			await wait(900, id);
			for (let k = 0; k < values.length; k++) {
				const r = vials[k].getBoundingClientRect();
				const b = rackEl.getBoundingClientRect();
				scan = { on: true, left: r.left + r.width / 2 - b.left };
				await wait(520, id);
				rack[k].rd = true;
				rack[k].hi = isHigh(values[k]);
				tween(values[k], 420, (n) => (rack[k].value = n));
				await wait(260, id);
			}
			scan.on = false;
			showCaption(befund.captions.report);
			await wait(1100, id);
			ev = true;
			phase = 2;
			later(500, () => (lab = false));
			evaluate(set);
		} catch {
			// A newer sequence took over.
		}
	}

	/** "Unauffällig" / "Auffällig": straight to that example's evaluation. */
	function pick(key: SampleSet) {
		set = key;
		stopVial();
		tip.on = false;
		ev = true;
		lab = false;
		phase = 2;
		evaluate(key);
	}

	onDestroy(() => {
		run++;
		for (const t of timers) clearTimeout(t);
		timers.clear();
		stopTweens();
	});
</script>

<div
	class={["card rv", ev && "ev", lab && "is-lab"]}
	role="group"
	aria-label={befund.label}
	{@attach inView({
		threshold: 0.15,
		once: true,
		onEnter: () => {
			if (!prefersReducedMotion()) later(300, sample);
		},
	})}
>
	<div class="ch">
		<div><b>{befund.title}</b><small>{befund.sub}</small></div>
		<span class={["st", status.kind]}>{status.text}</span>
	</div>
	<div class="phase">
		{#each befund.phases as name, k (name)}
			<span class={[k === phase && "on", k < phase && "dn"]}
				><i>{k + 1}</i>{name}</span
			>
		{/each}
		<button
			type="button"
			class="replay"
			disabled={!ev}
			aria-label={befund.replay}
			onclick={sample}
			><StrokeIcon
				><path d="M4 10a6 6 0 1 0 2-4.5" /><path d="M4 3v3.5h3.5" /></StrokeIcon
			><em>{befund.replay}</em></button
		>
	</div>
	<div class="stack">
		<div class="stage" bind:this={stage} aria-hidden="true">
			<svg viewBox="0 0 360 178" class="net">
				<rect class="tank" x="14" y="56" width="62" height="100" rx="14" />
				<rect class="lvl" x="18" y="98" width="54" height="54" rx="10" />
				<path class="heat" d="M32 140h26M32 131h26" />
				<text class="tl" x="45" y="172" text-anchor="middle"
					>{befund.net.heater}</text
				>
				<path class="pipe" d="M76 86H300V30" />
				<path class="pipe" d="M190 86V30" />
				<path class="circ" d="M300 86v40H76" />
				<text class="tl" x="190" y="12" text-anchor="middle"
					>{befund.net.risers[0]}</text
				>
				<text class="tl" x="300" y="12" text-anchor="middle"
					>{befund.net.risers[1]}</text
				>
				<text class="tl" x="238" y="142" text-anchor="middle"
					>{befund.net.circulation}</text
				>
				<path class="flow" d="M76 86H300V30" />
				{#each ["M76 86H106", "M300 86v40H106", "M76 86H190V46", "M76 86H300V46"] as d, i (d)}
					<path
						class={["hl", pipe === i && "on"]}
						style:--len={PIPE_LENGTHS[i]}
						{d}
					/>
				{/each}
				<g class="tap" transform="translate(190 30)"
					><path d="M-8 0h16M0 0v-6" /></g
				>
				<g class="tap" transform="translate(300 30)"
					><path d="M-8 0h16M0 0v-6" /></g
				>
				{#each [[106, 86], [106, 126], [190, 46], [300, 46]] as [x, y], i (i)}
					<g
						class={["sp", points[i]]}
						transform={`translate(${x} ${y})`}
						bind:this={spots[i]}
						><circle class="rg" r="9" /><circle class="dt" r="6.5" /><text
							y="3.2"
							text-anchor="middle">{i + 1}</text
						><path class="ck" d="M-3 0l2 2 4-4.5" /></g
					>
				{/each}
			</svg>
			<div
				class={["tip", tip.on && "on"]}
				style:left={`${tip.x}px`}
				style:top={`${tip.y}px`}
			>
				{tip.text}
			</div>
			<div
				class={["vial", vialFull && "f"]}
				style:opacity={vialShown ? 1 : 0}
				bind:this={vial}
			>
				<i></i><b></b><b></b><b></b>
			</div>
			<div class="tray" bind:this={trayEl}>
				{#each [0, 1, 2, 3] as k (k)}<span class={[k < tray && "f"]}
					></span>{/each}
			</div>
			<div class="rack" bind:this={rackEl}>
				{#each rack as v, k (k)}
					<span
						class={["v", v.rd && "rd", v.hi && "hi"]}
						style:--i={k}
						bind:this={vials[k]}
						><i></i><em>{k + 1}</em><s class="kb">{v.value}</s></span
					>
				{/each}
				<div
					class={["scan", scan.on && "on"]}
					style:left={`${scan.left}px`}
				></div>
			</div>
			<p class={["cap", captionOff && "sw"]}>{caption}</p>
		</div>
		<div class="eval">
			<div class="scale" aria-hidden="true">
				<span>{befund.scale.min}</span><span class="tmw"
					>{befund.scale.threshold}</span
				><span>{befund.scale.max}</span>
			</div>
			<div class="pts">
				{#each befund.points as name, i (name)}
					<div class="pt">
						<span class="pn">{name}</span>
						<span class="tr" aria-hidden="true"
							><i class={[bars[i].hi && "hi"]} style:width={`${bars[i].width}%`}
							></i><em></em></span
						>
						<b class={["v", bars[i].hi && "hi"]}>{bars[i].value}</b>
					</div>
				{/each}
			</div>
			<div class={["res", result.kind]}>
				<span class="d"></span><span>{result.text}</span>
			</div>
		</div>
	</div>
	<div class="types">
		{#each befund.types as t (t.key)}
			<button
				type="button"
				class={[set === t.key && "on"]}
				aria-pressed={set === t.key}
				onclick={() => pick(t.key)}
				><b>{t.title}</b><small>{t.sub}</small></button
			>
		{/each}
	</div>
	<span class="tag">{befund.tag}</span>
</div>

<style>
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
	.phase {
		display: flex;
		gap: 6px;
		margin-top: 18px;
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
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.3s,
			color 0.2s;
	}
	.replay:hover {
		color: var(--ink);
	}
	.card.ev .replay {
		opacity: 1;
		pointer-events: auto;
	}
	.replay :global(svg) {
		width: 13px;
		height: 13px;
	}
	.replay em {
		font-style: normal;
	}
	.stack {
		display: grid;
		margin-top: 6px;
	}
	.stack > div {
		grid-area: 1/1;
		transition:
			opacity 0.5s,
			translate 0.5s;
	}
	.eval {
		align-self: center;
		opacity: 0;
		translate: 0 10px;
		pointer-events: none;
	}
	.card.ev .eval {
		opacity: 1;
		translate: 0 0;
		pointer-events: auto;
		transition:
			opacity 0.5s 0.3s,
			translate 0.5s 0.3s;
	}
	.card.ev .stage {
		opacity: 0;
		translate: 0 -10px;
		pointer-events: none;
		transition:
			opacity 0.3s,
			translate 0.3s;
	}
	.stage {
		position: relative;
	}
	.net {
		display: block;
		width: 100%;
		height: auto;
		margin-top: 6px;
		overflow: visible;
		font-family: inherit;
	}
	.tank {
		fill: #f3f5f4;
		stroke: #c9d2ce;
		stroke-width: 1.5;
	}
	.lvl {
		fill: #dceaf5;
		opacity: 0.7;
	}
	.heat {
		stroke: #e39a72;
		stroke-width: 2;
		stroke-linecap: round;
		fill: none;
		animation: lg-hb 2.4s ease-in-out infinite;
	}
	@keyframes lg-hb {
		50% {
			opacity: 0.35;
		}
	}
	.pipe {
		fill: none;
		stroke: #d3dad7;
		stroke-width: 5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.circ {
		fill: none;
		stroke: #d3dad7;
		stroke-width: 3;
		stroke-dasharray: 5 5;
	}
	.flow {
		fill: none;
		stroke: #e39a72;
		stroke-width: 1.6;
		stroke-dasharray: 4 16;
		stroke-linecap: round;
		animation: lg-fl 1.4s linear infinite;
		opacity: 0.55;
	}
	@keyframes lg-fl {
		to {
			stroke-dashoffset: -20;
		}
	}
	.hl {
		fill: none;
		stroke: #6fa8d6;
		stroke-width: 5;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: var(--len, 300);
		stroke-dashoffset: var(--len, 300);
		opacity: 0;
		transition:
			stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.3s;
	}
	.hl.on {
		stroke-dashoffset: 0;
		opacity: 0.85;
	}
	.tap path {
		stroke: #9aa5a1;
		stroke-width: 3;
		stroke-linecap: round;
		fill: none;
	}
	.tl {
		font-size: 10px;
		fill: var(--faint);
	}
	.sp .dt {
		fill: #fff;
		stroke: #a9b4b0;
		stroke-width: 1.5;
		transition:
			fill 0.35s,
			stroke 0.35s;
	}
	.sp text {
		font-size: 8px;
		font-weight: 700;
		fill: var(--muted);
		transition: opacity 0.25s;
	}
	.sp .ck {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 12;
		stroke-dashoffset: 12;
		transition: stroke-dashoffset 0.35s 0.1s;
	}
	.sp .rg {
		fill: none;
		stroke: var(--accent-deep);
		stroke-width: 2;
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
	}
	.sp.act .rg {
		animation: lg-rg 1.1s ease-out infinite;
	}
	@keyframes lg-rg {
		0% {
			opacity: 0.9;
			transform: scale(0.7);
		}
		100% {
			opacity: 0;
			transform: scale(2.1);
		}
	}
	.sp.act .dt {
		stroke: var(--ink);
		fill: #f4faf5;
	}
	.sp.dn .dt {
		fill: var(--accent);
		stroke: var(--accent-deep);
	}
	.sp.dn text {
		opacity: 0;
	}
	.sp.dn .ck {
		stroke-dashoffset: 0;
	}
	.tip {
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(-50%, calc(-100% - 46px));
		background: var(--ink);
		color: #fff;
		font-size: 11.5px;
		font-weight: 500;
		border-radius: 7px;
		padding: 4px 9px;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.25s;
		z-index: 3;
	}
	.tip.on {
		opacity: 1;
	}
	.vial {
		position: absolute;
		left: 0;
		top: 0;
		width: 15px;
		height: 32px;
		margin: -38px 0 0 -7.5px;
		border: 1.5px solid var(--ink);
		border-top: 5px solid var(--ink);
		border-radius: 3px 3px 8px 8px;
		background: rgba(255, 255, 255, 0.92);
		overflow: hidden;
		z-index: 2;
		box-shadow: 0 6px 14px -6px rgba(30, 50, 45, 0.4);
	}
	.vial i {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 0;
		background: #9cc7e8;
		transition: height 0.9s cubic-bezier(0.3, 0.6, 0.3, 1);
	}
	.vial i::before {
		content: "";
		position: absolute;
		left: -2px;
		right: -2px;
		top: -2px;
		height: 4px;
		border-radius: 50%;
		background: #b9d8ef;
	}
	.vial.f i {
		height: 72%;
	}
	.vial b {
		position: absolute;
		left: 50%;
		top: -4px;
		width: 3px;
		height: 5px;
		margin-left: -1.5px;
		border-radius: 50% 50% 50% 50%/60% 60% 40% 40%;
		background: #6fa8d6;
		opacity: 0;
	}
	.vial.f b {
		animation: lg-dr 0.5s ease-in 3;
	}
	.vial.f b:nth-of-type(2) {
		animation-delay: 0.16s;
	}
	.vial.f b:nth-of-type(3) {
		animation-delay: 0.32s;
	}
	@keyframes lg-dr {
		0% {
			opacity: 1;
			transform: translateY(-8px);
		}
		100% {
			opacity: 0;
			transform: translateY(14px);
		}
	}
	.tray {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-top: 4px;
		height: 22px;
		transition: opacity 0.3s;
	}
	.card.is-lab .tray,
	.card.ev .tray {
		opacity: 0;
	}
	.tray span {
		width: 9px;
		height: 20px;
		border: 1.5px solid #c9d2ce;
		border-top-width: 3px;
		border-radius: 2px 2px 5px 5px;
		position: relative;
		overflow: hidden;
		transition: border-color 0.3s;
	}
	.tray span::after {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 0;
		background: #9cc7e8;
		transition: height 0.45s ease-out;
	}
	.tray span.f {
		border-color: var(--ink);
	}
	.tray span.f::after {
		height: 70%;
	}
	.rack {
		position: absolute;
		inset: 4px 0 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 22px;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.45s;
		background: #fff;
	}
	.rack::after {
		content: "";
		position: absolute;
		left: 50%;
		top: calc(50% + 48px);
		width: 190px;
		height: 6px;
		margin-left: -95px;
		border-radius: 3px;
		background: #dde3e0;
	}
	.rack .v {
		position: relative;
		width: 24px;
		height: 80px;
		border: 1.5px solid var(--ink);
		border-top-width: 5px;
		border-radius: 3px 3px 12px 12px;
		translate: 0 26px;
		opacity: 0;
		transition:
			translate 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.2) calc(var(--i) * 0.09s),
			opacity 0.4s calc(var(--i) * 0.09s);
	}
	.rack .v i {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 72%;
		background: #9cc7e8;
		border-radius: 0 0 10px 10px;
		transition: background 0.5s;
	}
	.rack .v em {
		position: absolute;
		left: 0;
		right: 0;
		top: 4px;
		text-align: center;
		font-style: normal;
		font-size: 10px;
		font-weight: 700;
		color: var(--ink);
	}
	.rack .kb {
		position: absolute;
		left: 50%;
		top: -34px;
		transform: translateX(-50%) scale(0.6);
		text-decoration: none;
		font-size: 12px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		background: var(--ink);
		color: #fff;
		border-radius: 6px;
		padding: 2px 7px;
		opacity: 0;
		transition:
			opacity 0.3s,
			transform 0.35s cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	.rack .v.rd .kb {
		opacity: 1;
		transform: translateX(-50%) scale(1);
	}
	.rack .v.rd i {
		background: #a9ddb0;
	}
	.rack .v.rd.hi i {
		background: #f2b79c;
	}
	.rack .v.hi .kb {
		background: #d9622b;
	}
	.scan {
		position: absolute;
		top: calc(50% - 44px);
		height: 88px;
		width: 36px;
		margin-left: -18px;
		border-radius: 8px;
		background: rgba(138, 214, 143, 0.18);
		border: 1.5px solid rgba(111, 196, 118, 0.8);
		opacity: 0;
		transition:
			left 0.45s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.3s;
	}
	.card.is-lab .rack {
		opacity: 1;
	}
	.card.is-lab .rack .v {
		translate: 0 0;
		opacity: 1;
	}
	.card.is-lab .scan.on {
		opacity: 1;
	}
	.card.ev .rack {
		opacity: 0 !important;
		transition: opacity 0.25s;
	}
	.cap {
		margin: 6px 0 0;
		font-size: 13.5px;
		font-weight: 500;
		text-align: center;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		transition: opacity 0.2s;
	}
	.cap.sw {
		opacity: 0;
	}
	.scale {
		position: relative;
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		color: var(--faint);
		margin: 26px 0 6px 0;
		padding-left: 46%;
		padding-right: 54px;
	}
	.scale .tmw {
		position: absolute;
		left: calc(73% - 27px);
		transform: translateX(-50%);
		color: var(--ink);
		font-weight: 600;
		white-space: nowrap;
	}
	.pts {
		display: grid;
		gap: 12px;
	}
	.pt {
		display: grid;
		grid-template-columns: 46% minmax(0, 1fr) 54px;
		align-items: center;
		gap: 0;
	}
	.pn {
		font-size: 13.5px;
		padding-right: 12px;
		line-height: 1.3;
	}
	.tr {
		position: relative;
		height: 12px;
		background: #eef1ef;
		border-radius: 999px;
	}
	.tr i {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 0;
		border-radius: 999px;
		background: var(--accent-deep);
		transition:
			width 1s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.3s;
	}
	.tr i.hi {
		background: #d9622b;
	}
	.tr em {
		position: absolute;
		left: 50%;
		top: -5px;
		bottom: -5px;
		border-left: 1.5px dashed var(--ink);
		opacity: 0.55;
	}
	.pt .v {
		text-align: right;
		font-size: 15px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.pt .v.hi {
		color: #b4461e;
	}
	.res {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 20px;
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
	.res.bad {
		background: #fcede8;
		color: #8a3520;
	}
	.res.bad .d {
		background: #d9622b;
		animation: lg-pu 1.6s ease-in-out infinite;
	}
	@keyframes lg-pu {
		50% {
			opacity: 0.35;
		}
	}
	/* .ea-types.lg-types */
	.types {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
		margin-top: 16px;
	}
	.types button {
		min-width: 0;
		overflow-wrap: anywhere;
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
		.replay em {
			display: none;
		}
		.phase {
			gap: 4px;
		}
		.phase span {
			padding-right: 8px;
		}
		.pt {
			grid-template-columns: 40% minmax(0, 1fr) 46px;
		}
		.scale {
			padding-left: 40%;
			padding-right: 46px;
		}
		.scale .tmw {
			left: calc(70% - 23px);
		}
		.pn {
			font-size: 12.5px;
		}
		.scale > span:not(.tmw) {
			visibility: hidden;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.heat,
		.flow,
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
