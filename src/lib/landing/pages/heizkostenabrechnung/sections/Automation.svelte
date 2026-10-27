<!--
  "Von Anfang bis Ende automatisiert" (.hk-auto): three cards that work
  (example data). "Zählerstände abrufen" counts 36 readings in over 1.8 s;
  the cost-type chips move between "Heizung" and the suggestions on click;
  "Abrechnungen erstellen" ticks off the units over 1.6 s (confetti when the
  visitor clicked it). When the cards first come into view, a pointer clicks
  through the three once (the design's `demoClick`), unless the visitor
  touched them first; nothing of it with reduced motion. Rendered in the
  design's start state.
-->
<script lang="ts">
	import { on } from "svelte/events";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import { automation } from "../content";

	const { readings, costs, billing, units } = automation;
	const PULL_MS = 1800;
	const CREATE_MS = 1600;

	/** The visitor pressed something: the pointer demo stops. */
	let touched = false;
	let timers: ReturnType<typeof setTimeout>[] = [];
	let frames: number[] = [];
	const wait = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
	$effect(() => () => {
		timers.forEach(clearTimeout);
		frames.forEach(cancelAnimationFrame);
	});

	/** Runs `step(p)` for p from 0 to 1 over `ms`, then `done`. */
	function animate(ms: number, step: (p: number) => void, done: () => void) {
		const start = performance.now();
		const frame = (now: number) => {
			const p = prefersReducedMotion() ? 1 : Math.min(1, (now - start) / ms);
			step(p);
			if (p < 1) frames.push(requestAnimationFrame(frame));
			else done();
		};
		frames.push(requestAnimationFrame(frame));
	}

	// Card 1: the readings
	let received = $state(0);
	let pulling = $state(false);
	let pulled = $state(false);
	function pull() {
		if (pulling) return;
		pulling = true;
		pulled = false;
		animate(
			PULL_MS,
			(p) => (received = Math.round(units * p)),
			() => {
				pulling = false;
				pulled = true;
			},
		);
	}
	const progress = $derived(received / units);

	// Card 2: the cost types
	let inside = $state([...costs.inside]);
	let outside = $state([...costs.outside]);
	/** The chip that just moved (its pop plays when it mounts). */
	let moved = $state("");
	function move(name: string) {
		if (inside.includes(name)) {
			inside = inside.filter((n) => n !== name);
			outside.push(name);
		} else {
			outside = outside.filter((n) => n !== name);
			inside.push(name);
		}
		moved = name;
	}

	// Card 3: the statements
	let created = $state(0);
	let creating = $state(false);
	let finished = $state(false);
	let createBtn = $state<HTMLButtonElement>();
	function create() {
		if (creating) return;
		finished = false;
		created = 0;
		creating = true;
		animate(
			CREATE_MS,
			(p) => (created = Math.round(units * p)),
			() => {
				creating = false;
				finished = true;
				if (touched && createBtn) confettiFrom(createBtn);
			},
		);
	}
	/** Units shown ticked: the design's `p >= (i + 1) / 3.4`. */
	const ticked = $derived(
		billing.units.map((_, i) => created / units >= (i + 1) / 3.4),
	);

	// The pointer demo
	let cursors = $state<{ x: number; y: number; on: boolean; jump: boolean }[]>(
		[0, 1, 2].map(() => ({ x: 0, y: 0, on: false, jump: false })),
	);
	let pressed = $state(-1);
	const cardEls: HTMLElement[] = [];
	let pullBtn = $state<HTMLButtonElement>();

	function demoClick(
		index: number,
		target: HTMLElement | undefined,
		act: () => void,
		then?: () => void,
	) {
		const card = cardEls[index];
		if (touched || !card || !target) return;
		const cr = card.getBoundingClientRect();
		const tr = target.getBoundingClientRect();
		const cursor = cursors[index];
		// Start below the card's corner without a transition, then glide.
		Object.assign(cursor, { x: cr.width - 10, y: cr.height + 20, jump: true });
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				Object.assign(cursor, {
					jump: false,
					on: true,
					x: tr.left - cr.left + tr.width * 0.6,
					y: tr.top - cr.top + tr.height * 0.55,
				});
			}),
		);
		wait(() => {
			if (touched) {
				cursor.on = false;
				return;
			}
			pressed = index;
			wait(() => {
				pressed = -1;
				act();
				wait(() => {
					cursor.on = false;
					then?.();
				}, 500);
			}, 180);
		}, 1000);
	}

	function demo() {
		if (prefersReducedMotion()) return;
		wait(
			() =>
				demoClick(0, pullBtn, pull, () =>
					wait(
						() =>
							demoClick(
								1,
								cardEls[1]?.querySelector<HTMLElement>(
									`[data-n="${costs.demo}"]`,
								) ?? undefined,
								() => move(costs.demo),
								() => wait(() => demoClick(2, createBtn, create), 500),
							),
						900,
					),
				),
			500,
		);
	}

	const touch = () => (touched = true);
</script>

<section class="pg-sec" aria-labelledby="hk-auh">
	<div class="wrap">
		<p class="kick rv">{automation.kicker}</p>
		<h2 class="h2 c rv" id="hk-auh">{automation.h2}</h2>
		<div
			class="three"
			{@attach (el) => on(el, "pointerdown", touch)}
			{@attach inView({ threshold: 0.15, once: true, onEnter: demo })}
		>
			<article class="rv">
				<div class="vis">
					<div class={["mock", pulled && "fin"]} bind:this={cardEls[0]}>
						<div class="avs">
							{#each readings.avatars as n, i (n)}
								<span class={[progress >= (i + 1) / 3.2 && "ok"]}>{n}</span>
							{/each}
							<small><b>{readings.property}</b>{readings.units}</small>
						</div>
						<div class="pb"><i style:width="{progress * 100}%"></i></div>
						<button
							type="button"
							class={["btn", pressed === 0 && "press"]}
							disabled={pulling}
							bind:this={pullBtn}
							onclick={(e) => {
								if (e.isTrusted) touch();
								pull();
							}}
						>
							{#if pulling}<span class="sp"
								></span>{readings.busy}{:else if pulled}{readings.again}{:else}{readings.button}{/if}
						</button>
						<span class="done"
							><b>{received}</b>{readings.received}<em
								><svg viewBox="0 0 12 10" width="10" aria-hidden="true"
									><path
										d="M1 5.2l3.2 3L11 1.5"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								></em
							></span
						>
						{@render cursor(0)}
					</div>
				</div>
				<h3>{readings.h3}</h3>
				<p>{readings.text}</p>
			</article>

			<article class="rv">
				<div class="vis">
					<div class="mock costs" bind:this={cardEls[1]}>
						<b>{costs.title}</b>
						<div class="k">
							<small
								>{costs.group}
								<span class="cnt">{costs.assigned(inside.length)}</span></small
							>
							<div class="chs">
								{#each inside as name (name)}
									<button
										type="button"
										class={["ch", moved === name && "pop"]}
										onclick={(e) => {
											if (e.isTrusted) touch();
											move(name);
										}}>{name}<i aria-hidden="true">×</i></button
									>
								{/each}
							</div>
						</div>
						<div class="k">
							<small>{costs.suggestions}</small>
							<div class="chs">
								{#each outside as name (name)}
									<button
										type="button"
										class={[
											"ch add",
											moved === name && "pop",
											pressed === 1 && name === costs.demo && "press",
										]}
										data-n={name}
										onclick={(e) => {
											if (e.isTrusted) touch();
											move(name);
										}}><i aria-hidden="true">+</i>{name}</button
									>
								{/each}
							</div>
						</div>
						{@render cursor(1)}
					</div>
				</div>
				<h3>{costs.h3}</h3>
				<p>{costs.text}</p>
			</article>

			<article class="rv">
				<div class="vis">
					<div class="mock" bind:this={cardEls[2]}>
						<small class="c3h"
							><span>{billing.head}</span><span class="c3s"
								>{finished
									? billing.finished
									: creating
										? `${created} / ${units}`
										: ""}</span
							></small
						>
						{#each billing.units as unit, i (unit.n)}
							<div class={["u", ticked[i] && "ok"]}>
								<span class="a">{unit.n}</span>{unit.name}<b>{unit.sum}</b>
							</div>
						{/each}
						<button
							type="button"
							class={["btn", finished && "fin", pressed === 2 && "press"]}
							disabled={creating}
							bind:this={createBtn}
							onclick={(e) => {
								if (e.isTrusted) touch();
								create();
							}}
						>
							{#if creating}<span class="sp"
								></span>{billing.busy}{:else if finished}{billing.done}{:else}{billing.button}{/if}
						</button>
						{@render cursor(2)}
					</div>
				</div>
				<h3>{billing.h3}</h3>
				<p>{billing.text}</p>
			</article>
		</div>
		<p class="hk-note c rv">{automation.note}</p>
	</div>
</section>

{#snippet cursor(i: number)}
	{@const c = cursors[i]}
	<i
		class={["cur", c.jump && "jump"]}
		style:opacity={c.on ? 1 : 0}
		style:transform="translate({c.x}px, {c.y}px)"
		aria-hidden="true"
	></i>
{/snippet}

<style>
	.kick {
		text-align: center;
		color: var(--muted);
		font-size: 15px;
	}
	.three {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin-top: 48px;
	}
	/* `.three h3`: beats the landing reset of heading margins. */
	.three h3 {
		font-size: 18px;
		font-weight: 600;
		margin-top: 18px;
	}
	.three p {
		color: var(--muted);
		font-size: 15px;
		line-height: 1.5;
		margin-top: 6px;
		max-width: 38ch;
	}
	.vis {
		position: relative;
		height: 300px;
		background: #efeeea;
		border-radius: 16px;
		display: grid;
		place-items: center;
		overflow: hidden;
	}
	.mock {
		position: relative;
		width: min(300px, 86%);
		background: #fff;
		border-radius: 14px;
		padding: 16px;
		box-shadow: 0 14px 30px -22px rgba(30, 50, 45, 0.4);
	}
	.avs {
		display: flex;
		align-items: center;
	}
	.avs span {
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: #f2f3f2;
		border: 2px solid #fff;
		display: grid;
		place-items: center;
		font-size: 11px;
		font-weight: 600;
		margin-right: -6px;
		transition:
			background 0.3s,
			color 0.3s,
			transform 0.3s;
	}
	.avs span.ok {
		background: #e3f3e4;
		color: #2f7a3c;
		transform: translateY(-2px);
	}
	.avs small {
		margin-left: 16px;
		font-size: 12px;
		color: var(--muted);
		line-height: 1.3;
	}
	.avs small b {
		display: block;
		color: var(--ink);
		font-size: 13px;
	}
	.pb {
		height: 5px;
		border-radius: 3px;
		background: #f0f2f1;
		margin-top: 14px;
		overflow: hidden;
	}
	.pb i {
		display: block;
		height: 100%;
		background: var(--ok);
		border-radius: 3px;
	}
	/* `.mock .btn`: beats the landing button reset's colour. */
	.mock .btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		margin-top: 12px;
		border: 0;
		border-radius: 9px;
		background: var(--ink);
		color: #fff;
		font-size: 14px;
		font-weight: 600;
		padding: 11px;
		cursor: pointer;
		transition:
			transform 0.15s,
			background 0.2s;
	}
	.mock .btn:hover {
		background: #2a443d;
	}
	.mock .btn:active,
	.mock .btn.press {
		transform: scale(0.97);
	}
	.mock .btn:disabled {
		cursor: default;
		background: #2a443d;
	}
	.mock .btn.fin {
		background: #e3f3e4;
		color: #245f33;
	}
	.sp {
		width: 13px;
		height: 13px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: hkspin 0.7s linear infinite;
	}
	.cur {
		position: absolute;
		left: 0;
		top: 0;
		width: 22px;
		height: 22px;
		pointer-events: none;
		z-index: 3;
		background: no-repeat center/contain
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4 2l16 9-7 2-3 7z' fill='%231E322D' stroke='%23fff' stroke-width='1.5'/%3E%3C/svg%3E");
		transition:
			transform 0.9s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.3s;
	}
	.cur.jump {
		transition: none;
	}
	.done {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 10px;
		font-size: 12.5px;
		color: var(--muted);
		min-height: 18px;
	}
	.done b {
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.done em {
		display: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #e3f3e4;
		color: #2f7a3c;
		place-items: center;
	}
	.fin .done em {
		display: grid;
	}
	.fin .done {
		color: #2f7a3c;
		font-weight: 600;
	}
	.costs > b {
		font-size: 16px;
		display: block;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--hair);
	}
	.k {
		padding: 12px 0;
		border-bottom: 1px solid var(--hair);
	}
	.k:last-of-type {
		border: 0;
		padding-bottom: 0;
	}
	.k small {
		display: flex;
		justify-content: space-between;
		font-size: 12.5px;
		margin-bottom: 8px;
	}
	.cnt {
		color: var(--ok);
		font-weight: 500;
	}
	.chs {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		min-height: 26px;
	}
	/* `.chs .ch`: beats the landing button reset's colour. */
	.chs .ch {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11.5px;
		background: #e4f3e6;
		color: #245f33;
		border: 1px solid transparent;
		border-radius: 6px;
		padding: 3px 8px;
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s;
	}
	.ch i {
		font-style: normal;
		opacity: 0.6;
	}
	.ch:hover i {
		opacity: 1;
	}
	.chs .ch.add {
		background: #fff;
		color: var(--muted);
		border: 1px dashed #c9d2ce;
	}
	.chs .ch.add:hover {
		border-color: var(--ok);
		color: var(--ink);
	}
	.ch.pop {
		animation: hkpop 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ch.press {
		transform: scale(0.97);
	}
	.c3h {
		display: flex;
		justify-content: space-between;
	}
	.c3s {
		color: #2f7a3c;
		font-weight: 600;
	}
	.u {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 13px;
		padding: 7px 0;
		border-bottom: 1px solid #f2f3f2;
	}
	.u b {
		margin-left: auto;
		font-variant-numeric: tabular-nums;
	}
	.u .a {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		background: #f2f3f2;
		display: grid;
		place-items: center;
		font-size: 11px;
		font-weight: 600;
		transition:
			background 0.3s,
			color 0.3s;
	}
	.u.ok .a {
		background: #e3f3e4;
		color: #2f7a3c;
	}
	/* The design's `.hk-u:nth-of-type(3)`: the third unit row. */
	.u:nth-of-type(3) {
		opacity: 0.45;
	}
	@keyframes hkspin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes hkpop {
		0% {
			transform: scale(0.8);
		}
		60% {
			transform: scale(1.08);
		}
		100% {
			transform: scale(1);
		}
	}
	@media (max-width: 900px) {
		.three {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sp,
		.ch.pop {
			animation: none;
		}
	}
</style>
