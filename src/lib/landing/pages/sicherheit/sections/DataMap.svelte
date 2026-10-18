<!--
  The hero map (.sc-map): the Bundesländer, 14 properties with dashed curves
  to one server, the badge "Speicherort Deutschland" and a log line. The
  server renders it at rest; in the browser, while in view, a packet leaves a
  random property every 0.9–1.8 s and travels its curve to the server, which
  rings, and the log line changes (plan 03 §3.2). Reduced motion: at rest.
-->
<script lang="ts">
	import { onMount } from "svelte";
	import { enterView } from "$lib/landing/attachments/enterView";
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Icon from "../components/Icon.svelte";
	import { map } from "../content";
	import { curvePath, DOTS, SERVER, STATES, VIEW_BOX } from "../map";
	import {
		arcTable,
		ease,
		nextMessage,
		opacity,
		pointAtLength,
		type Curve,
	} from "../packets";

	type Packet = {
		id: number;
		dot: number;
		start: number;
		duration: number;
		x: number;
		y: number;
		o: number;
	};

	const curves: Curve[] = DOTS.map((d) => ({ p0: d, c: d.c, p1: SERVER }));
	const tables = curves.map((curve) => arcTable(curve));

	let entered = $state(false);
	let packets = $state<Packet[]>([]);
	/** Bumped to replay a dot's ping / the server's hit (keyed blocks). */
	let pings = $state(DOTS.map(() => 0));
	let hits = $state(0);
	let message = $state(0);
	let logVisible = $state(true);

	let nextId = 0;
	let frame = 0;
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- pending timeouts, not state
	const timers = new Set<ReturnType<typeof setTimeout>>();

	function later(fn: () => void, ms: number) {
		const timer = setTimeout(() => {
			timers.delete(timer);
			fn();
		}, ms);
		timers.add(timer);
	}

	function arrive() {
		hits++;
		logVisible = false;
		later(() => {
			message = nextMessage(message, map.messages.length);
			logVisible = true;
		}, 250);
	}

	function tick(now: number) {
		frame = 0;
		for (const packet of packets) {
			const p = Math.min(1, (now - packet.start) / packet.duration);
			const pt = pointAtLength(curves[packet.dot], tables[packet.dot], ease(p));
			packet.x = pt.x;
			packet.y = pt.y;
			packet.o = opacity(p);
		}
		const done = packets.filter((p) => now - p.start >= p.duration);
		if (done.length) {
			packets = packets.filter((p) => !done.includes(p));
			done.forEach(arrive);
		}
		if (packets.length) frame = requestAnimationFrame(tick);
	}

	function send() {
		const dot = Math.floor(Math.random() * DOTS.length);
		packets.push({
			id: nextId++,
			dot,
			start: performance.now(),
			duration: 2600 + Math.random() * 1200,
			x: DOTS[dot].x,
			y: DOTS[dot].y,
			o: 0,
		});
		pings[dot]++;
		if (!frame) frame = requestAnimationFrame(tick);
	}

	/** One pass of the loop: the next packet after 0–0.9 s (passes are 0.9 s apart). */
	function pass() {
		const timer = setTimeout(send, Math.random() * 900);
		return () => clearTimeout(timer);
	}

	onMount(() => () => {
		cancelAnimationFrame(frame);
		timers.forEach(clearTimeout);
	});
</script>

<div
	class={["map rv", entered && "in"]}
	{@attach enterView({ prepare: () => {}, play: () => void (entered = true) })}
	{@attach loopInView({ run: pass, every: 900, delay: 900 })}
>
	<svg class="svg" viewBox={VIEW_BOX} role="img" aria-label={map.label}>
		<g>
			{#each STATES as d, i (i)}<path class="st" {d} />{/each}
		</g>
		<g>
			{#each DOTS as dot, i (i)}<path class="ln" d={curvePath(dot)} />{/each}
		</g>
		<g class="pk">
			{#each packets as p (p.id)}
				<circle r="2.6" cx={p.x} cy={p.y} style:opacity={p.o} />
			{/each}
		</g>
		{#each DOTS as dot, i (i)}
			<g>
				{#key pings[i]}
					<circle
						class={["cr", pings[i] > 0 && "ping"]}
						cx={dot.x}
						cy={dot.y}
						r="9"
					/>
				{/key}
				<circle class="cc" cx={dot.x} cy={dot.y} r="3.6" />
			</g>
		{/each}
		<g>
			<circle class="sr2" cx={SERVER.x} cy={SERVER.y} r="16" />
			{#key hits}
				<circle
					class={["sr1", hits > 0 && "hit"]}
					cx={SERVER.x}
					cy={SERVER.y}
					r="16"
				/>
			{/key}
			<rect
				class="sb"
				x={SERVER.x - 15}
				y={SERVER.y - 15}
				width="30"
				height="30"
				rx="8"
			/>
			<g
				transform="translate({SERVER.x - 9} {SERVER.y - 9}) scale(.9)"
				fill="none"
				stroke="#1E322D"
				stroke-width="1.8"
				stroke-linecap="round"
			>
				<rect x="2" y="2" width="16" height="6" rx="1.5" />
				<rect x="2" y="12" width="16" height="6" rx="1.5" />
				<path d="M5.5 5h.01M5.5 15h.01" />
			</g>
		</g>
	</svg>
	<div class="badge">
		<span class="live" aria-hidden="true"></span>
		<p><small>{map.badgeLabel}</small><b>{map.badgeValue}</b></p>
		<span class="bk" aria-hidden="true"><Icon name="check" /></span>
	</div>
	<div class="log" aria-hidden="true">
		<span style:opacity={logVisible ? 1 : 0}>{map.messages[message]}</span>
		<em>{map.logTag}</em>
	</div>
</div>

<style>
	.map {
		position: relative;
		max-width: 520px;
		width: 100%;
		justify-self: center;
	}
	.svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.st {
		fill: rgba(138, 214, 143, 0.07);
		stroke: rgba(138, 214, 143, 0.32);
		stroke-width: 1;
		stroke-linejoin: round;
		transition: fill 0.6s;
	}
	.in .st {
		animation: st 1.2s ease both;
	}
	@keyframes st {
		from {
			fill: rgba(138, 214, 143, 0);
			stroke: rgba(138, 214, 143, 0);
		}
	}
	.ln {
		fill: none;
		stroke: rgba(138, 214, 143, 0.22);
		stroke-width: 1;
		stroke-dasharray: 3 4;
	}
	.cc {
		fill: var(--accent);
	}
	.cr {
		fill: none;
		stroke: var(--accent);
		stroke-width: 1;
		opacity: 0;
	}
	.cr.ping {
		animation: ping 1.4s ease-out;
	}
	@keyframes ping {
		0% {
			opacity: 0.8;
			transform: scale(0.4);
		}
		100% {
			opacity: 0;
			transform: scale(1.6);
		}
	}
	.cr,
	.sr1,
	.sr2 {
		transform-box: fill-box;
		transform-origin: center;
	}
	.pk circle {
		fill: #fff;
	}
	.sb {
		fill: var(--accent);
	}
	.sr1,
	.sr2 {
		fill: none;
		stroke: var(--accent);
		stroke-width: 1.2;
		opacity: 0;
	}
	.sr1.hit {
		animation: ring 1.2s ease-out;
	}
	.sr2 {
		animation: ring 3.2s ease-out infinite;
	}
	@keyframes ring {
		0% {
			opacity: 0.7;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(2.6);
		}
	}
	.badge {
		position: absolute;
		right: 0;
		bottom: 12%;
		display: flex;
		align-items: center;
		gap: 12px;
		background: #fff;
		color: var(--ink);
		border-radius: 14px;
		padding: 12px 16px;
		box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.5);
	}
	.badge p {
		margin: 0;
	}
	.badge small {
		display: block;
		font-size: 12px;
		color: var(--muted);
	}
	.badge b {
		display: block;
		font-size: 16px;
		font-weight: 600;
	}
	.live {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--ok);
		box-shadow: 0 0 0 4px rgba(47, 158, 68, 0.15);
		animation: breathe 2.4s ease-in-out infinite;
	}
	@keyframes breathe {
		50% {
			box-shadow: 0 0 0 7px rgba(47, 158, 68, 0.06);
		}
	}
	.bk {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: #e3f3e4;
		display: grid;
		place-items: center;
		color: var(--ok);
	}
	.bk :global(svg) {
		width: 14px;
		height: 14px;
	}
	.log {
		position: absolute;
		left: 0;
		top: 8%;
		display: flex;
		align-items: center;
		gap: 10px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.14);
		color: #fff;
		border-radius: 10px;
		padding: 8px 12px;
		font-size: 12.5px;
		backdrop-filter: blur(6px);
	}
	.log em {
		font-style: normal;
		font-size: 11px;
		color: var(--accent);
		border: 1px solid rgba(138, 214, 143, 0.4);
		border-radius: 5px;
		padding: 1px 6px;
	}
	.log span {
		transition: opacity 0.25s;
	}
	@media (max-width: 900px) {
		.log {
			display: none;
		}
	}
	@media (max-width: 560px) {
		.badge {
			right: 4px;
			bottom: 4%;
			padding: 10px 12px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.map * {
			animation: none !important;
		}
	}
</style>
