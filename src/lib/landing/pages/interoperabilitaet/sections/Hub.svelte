<!--
  The hero's middle panel (the design's .uv-pk.mid.iphub, #ip-js "Funk-Hub"):
  devices of every manufacturer on the left, four in view, send packets
  along wires into the dashboard on the right, whose four groups fill up to
  the building's 102 devices. After every fifth packet the devices move up
  one row (two side by side below 900 px). Full, it holds, then starts again
  from 0.

  Server-rendered full, without wires (they're drawn from the layout in the
  browser and redrawn on resize and after each move). The loop runs only
  while the panel is in view and the tab is visible, nothing with reduced
  motion; its first pass starts by holding the full dashboard, so the hero
  doesn't flash on load. The panel is hidden from screen readers; a list
  states the groups.
-->
<script lang="ts">
	import { onMount, tick as nextFrame } from "svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Tick from "$lib/landing/sections/uv/Tick.svelte";
	import BrandMark from "../components/BrandMark.svelte";
	import DevicePhoto from "../components/DevicePhoto.svelte";
	import HeidiBars from "../components/HeidiBars.svelte";
	import Signal from "../components/Signal.svelte";
	import { BRANDS, hub } from "../content";
	import {
		addReading,
		cubicPath,
		ease,
		HUB,
		pointAtShare,
		wire,
		type Box,
		type Cubic,
	} from "../scenes";

	const totals = hub.groups.map((g) => g.total);
	const allDevices = totals.reduce((a, b) => a + b, 0);

	/** The devices in display order; the first four are in view. */
	let order = $state(hub.devices.map((_, i) => i));
	let counts = $state([...totals]);
	const read = $derived(counts.reduce((a, b) => a + b, 0));
	/** Devices sending and groups receiving right now. */
	let sending = $state<number[]>([]);
	let hit = $state<number[]>([]);
	let wires = $state.raw<Cubic[]>([]);
	let faded = $state(false);
	/** The move up: its distance in px while sliding. */
	let slide = $state(0);
	/** The viewport's height in px, once measured. */
	let viewport = $state<number>();
	let packets = $state<
		{ id: number; wire: number; color: string; x: number; y: number }[]
	>([]);

	let hubEl: HTMLElement;
	let trackEl: HTMLElement;
	let dashEl: HTMLElement;
	const deviceEls: HTMLElement[] = $state([]);
	const rowEls: HTMLElement[] = $state([]);

	const color = (device: number) => BRANDS[device % BRANDS.length].color;

	const stacked = () =>
		getComputedStyle(hubEl).gridTemplateColumns.split(" ").length < 2;

	/** A row's height plus the gap; sizes the viewport to two or four rows. */
	function measure() {
		const first = trackEl.children[0] as HTMLElement | undefined;
		if (!first) return 0;
		const gap = parseFloat(getComputedStyle(trackEl).rowGap) || 8;
		const rows = stacked() ? 2 : 4;
		viewport = rows * first.offsetHeight + (rows - 1) * gap;
		return first.offsetHeight + gap;
	}

	function box(el: HTMLElement): Box {
		const a = el.getBoundingClientRect();
		const b = hubEl.getBoundingClientRect();
		return {
			l: a.left - b.left,
			t: a.top - b.top,
			r: a.right - b.left,
			b: a.bottom - b.top,
		};
	}

	async function layout() {
		measure();
		await nextFrame();
		const s = stacked();
		const dash = box(dashEl);
		wires = order
			.slice(0, 4)
			.map((d, i) =>
				wire(box(deviceEls[d]), box(rowEls[hub.devices[d].group]), dash, s, i),
			);
	}

	// The loop's timers and frames, cleared when it stops.
	let timers: ReturnType<typeof setTimeout>[] = [];
	let frames: Record<number, number> = {};
	let running = false;
	let busy = false;
	let flying = 0;
	let next = 0;
	let shots = 0;
	let packetId = 0;

	const later = (fn: () => void, ms: number) => {
		timers.push(setTimeout(fn, ms));
	};
	const flash = (list: number[], value: number) => {
		list.push(value);
		later(() => list.splice(list.indexOf(value), 1), HUB.flash);
	};

	function fly(w: number, device: number, done: () => void) {
		const curve = wires[w];
		if (!curve) return done();
		const id = ++packetId;
		const start = curve[0];
		packets.push({ id, wire: w, color: color(device), x: start.x, y: start.y });
		flying++;
		const t0 = performance.now();
		const step = (now: number) => {
			const k = Math.min(1, (now - t0) / HUB.flight);
			const at = pointAtShare(curve, ease(k));
			const p = packets.find((q) => q.id === id);
			if (p) {
				p.x = at.x;
				p.y = at.y;
			}
			if (k < 1) {
				frames[id] = requestAnimationFrame(step);
				return;
			}
			delete frames[id];
			packets = packets.filter((q) => q.id !== id);
			flying--;
			done();
		};
		frames[id] = requestAnimationFrame(step);
	}

	function send(slot: number) {
		const device = order[slot];
		const group = hub.devices[device].group;
		if (counts[group] >= totals[group]) return false;
		flash(sending, device);
		fly(slot, device, () => {
			flash(hit, group);
			counts[group] = addReading(counts[group], totals[group]);
		});
		return true;
	}

	function rotate() {
		if (flying > 0) return later(rotate, 150);
		busy = true;
		const shift = measure();
		const cols = stacked() ? 2 : 1;
		faded = true;
		slide = shift;
		later(async () => {
			order = [...order.slice(cols), ...order.slice(0, cols)];
			slide = 0;
			await layout();
			faded = false;
			busy = false;
		}, HUB.slide);
	}

	function step() {
		if (!running) return;
		if (document.hidden || busy) return later(step, 500);
		if (counts.every((c, i) => c >= totals[i])) {
			later(() => {
				counts = totals.map(() => 0);
				later(step, HUB.restart);
			}, HUB.hold);
			return;
		}
		for (let tries = 0; tries < 4; tries++) if (send(next++ % 4)) break;
		shots++;
		const turn = shots % HUB.rotateEvery === 0;
		if (turn) later(rotate, HUB.rotateAt);
		later(step, turn ? HUB.rotateGap : HUB.gap);
	}

	function start() {
		if (running || prefersReducedMotion()) return;
		running = true;
		later(step, HUB.start);
	}

	function stop() {
		running = false;
		busy = false;
		timers.forEach(clearTimeout);
		timers = [];
		Object.values(frames).forEach(cancelAnimationFrame);
		frames = {};
		flying = 0;
		packets = [];
		sending = [];
		hit = [];
		faded = false;
		if (slide) {
			slide = 0;
			layout();
		}
		counts = [...totals];
	}

	onMount(() => {
		layout();
		const observer = new ResizeObserver(() => {
			if (!busy) layout();
		});
		observer.observe(hubEl);
		return () => {
			observer.disconnect();
			stop();
		};
	});
</script>

<figure
	class="pk mid iphub"
	aria-label={hub.label}
	{@attach inView({ onEnter: start, onLeave: stop })}
>
	<div class="ip-hub" bind:this={hubEl} aria-hidden="true">
		<svg class={["wires", faded && "fade"]}>
			<g class="paths">
				{#each wires as w, i (i)}
					<path
						d={cubicPath(w)}
						class={[packets.some((p) => p.wire === i) && "on"]}
					/>
				{/each}
			</g>
			<g class="pk-dots">
				{#each packets as p (p.id)}
					<circle class="h" r="9" cx={p.x} cy={p.y} fill={p.color} />
					<circle class="c" r="4.5" cx={p.x} cy={p.y} fill={p.color} />
				{/each}
			</g>
		</svg>
		<div class="col devs">
			<span class="any"
				><span class="anyb"
					>{#each [0, 1, 2, 3, 4] as i (i)}<BrandMark brand={i} />{/each}</span
				>{hub.any}</span
			>
			<div class="vp" style:height={viewport ? `${viewport}px` : undefined}>
				<div
					class={["tr", slide && "mv"]}
					bind:this={trackEl}
					style:transform={slide ? `translateY(-${slide}px)` : undefined}
				>
					{#each order as d (d)}
						{@const device = hub.devices[d]}
						<div
							class={["dv", sending.includes(d) && "tx"]}
							bind:this={deviceEls[d]}
						>
							<span class="ph"
								><DevicePhoto image={device.image} size={38} /><span
									class="br"
									title={hub.brandTitle}><BrandMark brand={d} /></span
								></span
							>
							<span class="dt"
								><b lang="de">{device.name}</b><span class="tg"
									><Signal />{hub.signal}</span
								></span
							>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="col dash" bind:this={dashEl}>
			<div class="db">
				<div class="dbt">
					<span class="dbl"
						><b>{hub.brand}</b><HeidiBars /><em>{hub.app}</em></span
					><span class="lv"><i></i>{hub.live}</span>
				</div>
				<div class="dh">
					<span
						><small>{hub.property}</small><span class="ex">{hub.example}</span
						></span
					><span class="uni">{hub.united}</span>
				</div>
				<div class="cnt"><b>{read}</b><span>/ {allDevices}</span></div>
				<p class="cl">{hub.read}</p>
				{#each hub.groups as g, i (g.name)}
					{@const full = counts[i] >= g.total}
					<div class={["rw", hit.includes(i) && "hit"]} bind:this={rowEls[i]}>
						<span class="ph s"><DevicePhoto image={g.image} size={28} /></span>
						<span class="rt"
							><span class="rn"
								><b>{g.name}</b>{#if full}<span class="rk"
										><Tick width={11} /></span
									>{:else}<em class="rc">{counts[i]}/{g.total}</em>{/if}</span
							><span class="rb"
								><i style:width="{(counts[i] / g.total) * 100}%"></i></span
							></span
						>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<ul class="sr-only">
		{#each hub.groups as g (g.name)}
			<li>{g.name}: {g.total} {hub.read}</li>
		{/each}
	</ul>
</figure>

<style>
	/* The design's .uv-pk.mid with .iphub */
	.pk {
		margin: 0;
		border-radius: 26px;
		overflow: hidden;
		height: clamp(360px, 42vw, 600px);
		position: relative;
		background: #e4efe6;
		display: block;
		padding: clamp(18px, 2.8vw, 40px);
	}
	.ip-hub {
		position: relative;
		height: 100%;
		color: #1e322d;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
		gap: clamp(48px, 8vw, 120px);
		align-items: center;
	}
	.wires {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}
	.wires path {
		fill: none;
		stroke: #bfd8c3;
		stroke-width: 1.6;
		transition: stroke 0.35s;
	}
	.wires path.on {
		stroke: #8ad68f;
	}
	.paths {
		transition: opacity 0.35s;
	}
	.wires.fade .paths {
		opacity: 0.15;
	}
	.pk-dots .h {
		opacity: 0.3;
	}
	.pk-dots .c {
		stroke: #fff;
		stroke-width: 1.5;
	}
	.col {
		position: relative;
		z-index: 1;
		min-width: 0;
	}
	.devs {
		display: grid;
		gap: 8px;
	}
	.any {
		justify-self: start;
		white-space: nowrap;
		font-size: 12.5px;
		font-weight: 600;
		color: #2f6a39;
		background: #fff;
		border: 1px solid #cfe6d2;
		border-radius: 999px;
		padding: 4px 12px;
		margin-bottom: 2px;
	}
	.anyb {
		display: inline-flex;
		gap: 3px;
		margin-right: 8px;
		vertical-align: -2px;
	}
	.anyb :global(svg) {
		width: 12px;
		height: 12px;
	}
	/* Four rows until the browser measures them (two below 900 px). */
	.vp {
		overflow: hidden;
		margin: 0 -16px;
		padding: 0 16px;
		height: calc(4 * 58px + 3 * 8px);
	}
	.tr {
		display: grid;
		gap: 8px;
		will-change: transform;
	}
	.tr.mv {
		transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
	}
	.dv {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #fff;
		border-radius: 14px;
		padding: 6px 12px 6px 6px;
		box-shadow: 0 14px 30px -22px rgba(30, 50, 45, 0.45);
		transition:
			box-shadow 0.3s,
			transform 0.3s;
	}
	.dv.tx {
		box-shadow:
			0 0 0 2px #8ad68f,
			0 14px 30px -22px rgba(30, 50, 45, 0.45);
	}
	.ph {
		position: relative;
		width: 46px;
		height: 46px;
		border-radius: 10px;
		background: #f3f6f4;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ph.s {
		width: 38px;
		height: 38px;
	}
	.br {
		position: absolute;
		right: -6px;
		top: -6px;
		width: 22px;
		height: 22px;
		border-radius: 7px;
		background: #fff;
		box-shadow: 0 3px 8px -3px rgba(30, 50, 45, 0.45);
		display: grid;
		place-items: center;
	}
	.br :global(svg) {
		width: 13px;
		height: 13px;
	}
	.dt {
		min-width: 0;
		display: grid;
		gap: 3px;
	}
	.dt b {
		font-size: clamp(13px, 1vw, 14.5px);
		font-weight: 600;
		letter-spacing: -0.01em;
		line-height: 1.2;
		overflow-wrap: anywhere;
		hyphens: auto;
	}
	.tg {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 12.5px;
		color: #5e6e68;
	}
	.tg :global(.ip-sig) {
		width: 14px;
		height: 14px;
		color: #9ab8a0;
	}
	.tg :global(.ip-sig path) {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.tg :global(.ip-sig circle) {
		fill: currentColor;
	}
	.dv.tx .tg :global(.ip-sig) {
		color: #2f7a3c;
	}
	.dv.tx .tg :global(.a1) {
		animation: ipSig 0.5s;
	}
	.dv.tx .tg :global(.a2) {
		animation: ipSig 0.5s 0.12s;
	}
	@keyframes ipSig {
		0% {
			opacity: 0.2;
		}
		100% {
			opacity: 1;
		}
	}

	/* The dashboard */
	.db {
		background: #fff;
		border-radius: 20px;
		padding: 18px 18px 10px;
		overflow: hidden;
		box-shadow: 0 26px 50px -30px rgba(30, 50, 45, 0.55);
	}
	.dbt {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: -18px -18px 14px;
		padding: 14px 18px;
		background: #1e322d;
		color: #fff;
		border-radius: 20px 20px 0 0;
	}
	.dbl {
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}
	.dbl b {
		font-size: 17px;
		font-weight: 500;
		letter-spacing: -0.01em;
	}
	.dbl :global(svg) {
		width: 16px;
		color: #fff;
	}
	.dbl em {
		font-style: normal;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.65);
		margin-left: 4px;
	}
	.lv {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 11.5px;
		font-weight: 600;
		color: #8ad68f;
	}
	.lv i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #3fa34d;
		animation: ipBlink 1.6s infinite;
	}
	@keyframes ipBlink {
		50% {
			opacity: 0.3;
		}
	}
	.dh {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}
	.dh small {
		font-size: 13px;
		color: #5e6e68;
		margin-right: 6px;
	}
	.ex {
		font-size: 11px;
		font-weight: 600;
		color: #5e6e68;
		background: #f1f4f2;
		border-radius: 999px;
		padding: 2px 8px;
	}
	.uni {
		font-size: 11.5px;
		font-weight: 600;
		color: #2f6a39;
		background: #e3f3e4;
		border-radius: 999px;
		padding: 3px 9px;
		white-space: nowrap;
	}
	.cnt {
		display: flex;
		align-items: baseline;
		gap: 6px;
		margin-top: 10px;
	}
	.cnt b {
		font-size: clamp(28px, 2.6vw, 38px);
		font-weight: 600;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}
	.cnt span {
		font-size: 17px;
		color: #8a9792;
	}
	.cl {
		margin: 2px 0 8px;
		font-size: 12.5px;
		color: #5e6e68;
	}
	.rw {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 0;
		border-top: 1px solid #eef1ef;
		border-radius: 8px;
		transition: background 0.4s;
	}
	.rw.hit {
		background: #f2faf3;
	}
	.rt {
		flex: 1;
		min-width: 0;
		display: grid;
		gap: 6px;
	}
	.rn {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.rn b {
		flex: 1;
		min-width: 0;
		font-size: 13px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.rc {
		font-style: normal;
		font-size: 12px;
		color: #5e6e68;
		font-variant-numeric: tabular-nums;
	}
	.rk {
		display: grid;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #8ad68f;
		color: #1e322d;
		place-items: center;
	}
	.rb {
		height: 6px;
		border-radius: 3px;
		background: #edf1ee;
		overflow: hidden;
	}
	.rb i {
		display: block;
		height: 100%;
		background: #8ad68f;
		border-radius: 3px;
		transition: width 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	@media (max-width: 900px) {
		.pk {
			padding: 16px 12px;
		}
		.ip-hub {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
		}
		.vp {
			height: calc(2 * 58px + 10px);
		}
		.tr {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10px;
		}
		.any {
			grid-column: 1/-1;
		}
		.dv {
			padding: 8px;
		}
		.ph:not(.s) {
			width: 42px;
			height: 42px;
		}
	}
	@media (max-width: 620px) {
		.pk {
			height: auto;
			min-height: 440px;
			border-radius: 20px;
		}
	}
	@media (max-width: 420px) {
		.dt b {
			font-size: 12.5px;
		}
		.tg {
			font-size: 11.5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.lv i {
			animation: none;
		}
	}
</style>
