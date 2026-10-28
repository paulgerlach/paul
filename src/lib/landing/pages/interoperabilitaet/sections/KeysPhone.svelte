<!--
  Card 4's picture (the design's #iq-a4, "Ihr Bestand"): three metering
  services' devices are locked; one by one each lock opens and its key flies
  to the owner, then the services stack and fold into one Heidi dashboard
  ("3 Messdienste" turns "1 Anbieter"). A pass every 11.6 s while 30 % of it
  is in view; stopping leaves it merged. Server-rendered merged (the design's
  reduced-motion state). The key's flight is measured from the layout when
  it starts. Hidden from screen readers.
-->
<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import BrandMark from "../components/BrandMark.svelte";
	import PhoneFrame from "../components/PhoneFrame.svelte";
	import { BRANDS, keys } from "../content";
	import { KEYS, keysTimes } from "../scenes";

	const n = keys.services.length;
	const times = keysTimes(n);
	const color = (i: number) => BRANDS[keys.services[i].brand].color;

	let highlighted = $state<number | null>(null);
	let opened = $state(n);
	let handed = $state(n);
	let stacked = $state(true);
	let merged = $state(true);
	let faded = $state(false);
	/** The key in flight: its service and its path in px from the phone's corner. */
	let flight = $state<{
		id: number;
		service: number;
		from: [number, number];
		to: [number, number];
	} | null>(null);

	let phoneEl = $state<HTMLElement>();
	const lockEls: SVGSVGElement[] = $state([]);
	const slotEls: HTMLElement[] = $state([]);

	const centre = (el: Element, box: DOMRect): [number, number] => {
		const r = el.getBoundingClientRect();
		return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
	};

	/** The design's flight: rise, swing left of the line between, land small. */
	const fly =
		({
			from: [sx, sy],
			to: [ex, ey],
		}: {
			from: [number, number];
			to: [number, number];
		}): Attachment<HTMLElement> =>
		(el) => {
			const animation = el.animate(
				[
					{ transform: `translate(${sx}px,${sy}px) scale(.4)`, opacity: 0 },
					{
						transform: `translate(${sx - 6}px,${sy - 10}px) scale(1)`,
						opacity: 1,
						offset: 0.18,
					},
					{
						transform: `translate(${(sx + ex) / 2 - 40}px,${(sy + ey) / 2}px) scale(1)`,
						opacity: 1,
						offset: 0.6,
					},
					{ transform: `translate(${ex}px,${ey}px) scale(.45)`, opacity: 0.4 },
				],
				{
					duration: KEYS.flight,
					easing: "cubic-bezier(.45,0,.25,1)",
					fill: "forwards",
				},
			);
			return () => animation.cancel();
		};

	function run() {
		highlighted = null;
		opened = 0;
		handed = 0;
		stacked = false;
		merged = false;
		faded = false;
		flight = null;
		const at = (ms: number, fn: () => void) => setTimeout(fn, ms);
		const timers = [
			...keys.services.flatMap((_, i) => [
				at(times.highlight(i), () => (highlighted = i)),
				at(times.fly(i), () => {
					highlighted = null;
					opened = i + 1;
					if (!phoneEl) return;
					const box = phoneEl.getBoundingClientRect();
					flight = {
						id: i,
						service: i,
						from: centre(lockEls[i], box),
						to: centre(slotEls[i], box),
					};
				}),
				at(times.land(i), () => {
					flight = null;
					handed = i + 1;
				}),
			]),
			at(times.stack, () => (stacked = true)),
			at(times.merge, () => (merged = true)),
			at(times.fade, () => (faded = true)),
			at(times.reset, () => {
				stacked = false;
				merged = false;
			}),
		];
		return () => {
			timers.forEach(clearTimeout);
			highlighted = null;
			flight = null;
			opened = n;
			handed = n;
			stacked = true;
			merged = true;
			faded = false;
		};
	}
</script>

{#snippet key()}
	<svg
		width="14"
		height="14"
		viewBox="0 0 20 20"
		fill="none"
		stroke="currentColor"
		stroke-width="1.8"
		stroke-linecap="round"
		stroke-linejoin="round"
		><circle cx="6.5" cy="13.5" r="3.5" /><path
			d="M9 11l7-7M13.5 6.5l2 2M11.5 8.5l1.5 1.5"
		/></svg
	>
{/snippet}

<PhoneFrame {@attach loopInView({ run, every: times.every, threshold: 0.3 })}>
	<div
		class={["k", stacked && "st", merged && "mg", faded && "fd"]}
		bind:this={phoneEl}
	>
		<div class="hd">
			<b>{keys.title}</b><span class="st0"
				><i class="a">{keys.before}</i><i class="b">{keys.after}</i></span
			>
		</div>
		<div class="ms">
			{#each keys.services as service, i (service.name)}
				<div
					class={["m", highlighted === i && "hl", i < opened && "op"]}
					style:--i={i}
				>
					<span class="rb"><BrandMark brand={service.brand} size={14} /></span>
					<span class="tx"
						><b>{service.name}</b><small
							><i class="a">{keys.locked}</i><i class="b">{keys.open}</i></small
						></span
					>
					<svg
						class="lk"
						bind:this={lockEls[i]}
						width="16"
						height="16"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
						><path class="sk" d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" /><rect
							x="4"
							y="9"
							width="12"
							height="8.5"
							rx="2"
						/></svg
					>
				</div>
			{/each}
		</div>
		<div class={["ow", handed > 0 && "pl"]}>
			<div class="o1">
				<span class="kk">{@render key()}</span>
				<span class="tx"
					><b>{keys.owner}</b><small
						>{keys.material} <i>{handed}</i>&thinsp;/&thinsp;{n}</small
					></span
				>
				<span class="sl">
					{#each keys.services as service, i (service.name)}
						<i
							bind:this={slotEls[i]}
							class={[i < handed && "f"]}
							style:background={i < handed ? color(i) : undefined}
						></i>
					{/each}
				</span>
			</div>
			<div class="o2">
				<span class="lg">{keys.logo}</span>
				<span class="tx"
					><b>{keys.merged}</b><small>{keys.mergedSub}</small></span
				>
				<span class="sl on">
					{#each keys.services as service (service.name)}
						<BrandMark brand={service.brand} size={11} />
					{/each}
				</span>
			</div>
		</div>
		{#if flight}
			{#key flight.id}
				<span
					class="fk"
					style:background={color(flight.service)}
					{@attach fly(flight)}>{@render key()}</span
				>
			{/key}
		{/if}
	</div>
</PhoneFrame>

<style>
	.k {
		--rh: 56px;
		position: relative;
	}
	.hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}
	.hd b {
		display: block;
		font-size: 13.5px;
		font-weight: 500;
	}
	.st0 {
		position: relative;
		display: grid;
		font-size: 11px;
		background: #eef1ef;
		color: #1e322d;
		border-radius: 20px;
		padding: 3px 8px;
	}
	.st0 i {
		grid-area: 1/1;
		font-style: normal;
		transition:
			opacity 0.35s,
			translate 0.35s;
	}
	.st0 .b {
		opacity: 0;
		translate: 0 6px;
	}
	.mg .st0 .a {
		opacity: 0;
		translate: 0 -6px;
	}
	.mg .st0 .b {
		opacity: 1;
		translate: 0 0;
	}
	.ms {
		position: relative;
		height: calc(var(--rh) * 3);
	}
	.m {
		position: absolute;
		left: 0;
		right: 0;
		top: calc(var(--i) * var(--rh));
		height: calc(var(--rh) - 8px);
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 12px;
		border: 1px solid rgba(30, 50, 45, 0.09);
		border-radius: 14px;
		background: #fff;
		z-index: calc(3 - var(--i));
		transition:
			translate 0.7s cubic-bezier(0.6, 0, 0.2, 1) calc(var(--i) * 0.07s),
			scale 0.7s cubic-bezier(0.6, 0, 0.2, 1) calc(var(--i) * 0.07s),
			opacity 0.6s,
			border-color 0.3s,
			background 0.3s;
	}
	.rb {
		position: relative;
		flex: none;
		width: 28px;
		height: 28px;
		border-radius: 9px;
		background: #f3f5f4;
		display: grid;
		place-items: center;
	}
	.tx {
		flex: 1;
		min-width: 0;
	}
	.m b,
	.ow b {
		display: block;
		font-size: 12.5px;
		font-weight: 500;
	}
	.m small {
		display: grid;
		font-size: 10.5px;
		color: rgba(30, 50, 45, 0.55);
	}
	.m small i {
		grid-area: 1/1;
		font-style: normal;
		transition: opacity 0.3s;
	}
	.m small .b {
		opacity: 0;
		color: #2e7a45;
	}
	.lk {
		color: rgba(30, 50, 45, 0.55);
		flex: none;
		transition: color 0.3s;
	}
	.sk {
		transition: translate 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.m.hl {
		border-color: rgba(30, 50, 45, 0.3);
	}
	.m.hl .lk {
		animation: iq-sh 0.4s;
	}
	@keyframes iq-sh {
		25% {
			rotate: -12deg;
		}
		75% {
			rotate: 12deg;
		}
	}
	.m.op .sk {
		translate: 0 -2.8px;
	}
	.m.op .lk {
		color: #2e7a45;
	}
	.m.op small .a {
		opacity: 0;
	}
	.m.op small .b {
		opacity: 1;
	}
	.m.op {
		border-color: rgba(138, 214, 143, 0.8);
	}
	.st .m {
		translate: 0 calc(var(--i) * (var(--rh) * -1 + 7px));
		scale: calc(1 - var(--i) * 0.05);
	}
	.st .m:not(:first-child) {
		opacity: 0.8;
	}
	.m > * {
		transition: opacity 0.3s;
	}
	.st .m:not(:first-child) > * {
		opacity: 0;
	}
	.st .m:first-child {
		background: #f7f9f8;
	}
	.ow {
		position: relative;
		height: 58px;
		border-radius: 14px;
		margin-top: 2px;
		transition:
			translate 0.7s cubic-bezier(0.6, 0, 0.2, 1) 0.5s,
			opacity 0.4s;
	}
	.ow > div {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 12px;
		border-radius: 14px;
		transition:
			opacity 0.45s,
			scale 0.45s;
	}
	.o1 {
		border: 1.5px dashed rgba(30, 50, 45, 0.22);
		background: #fafbfa;
	}
	.o2 {
		background: #1e322d;
		color: #fff;
		opacity: 0;
		scale: 0.94;
	}
	.ow small {
		display: block;
		font-size: 10.5px;
		color: rgba(30, 50, 45, 0.55);
	}
	.o2 small {
		color: rgba(255, 255, 255, 0.7);
	}
	.ow small i {
		font-style: normal;
		font-weight: 600;
		color: #1e322d;
		font-variant-numeric: tabular-nums;
	}
	.kk {
		flex: none;
		width: 28px;
		height: 28px;
		border-radius: 9px;
		background: #eef1ef;
		display: grid;
		place-items: center;
		color: #1e322d;
	}
	.lg {
		flex: none;
		width: 42px;
		height: 28px;
		border-radius: 8px;
		background: #8ad68f;
		color: #1e322d;
		font-size: 12px;
		font-weight: 600;
		display: grid;
		place-items: center;
	}
	.sl {
		display: flex;
		gap: 4px;
	}
	.sl i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		border: 1.5px solid rgba(30, 50, 45, 0.25);
		box-sizing: border-box;
		transition:
			background 0.3s,
			border-color 0.3s,
			scale 0.3s;
	}
	.sl i.f {
		border-color: transparent;
		scale: 1.15;
	}
	.ow.pl .o1 {
		border-color: rgba(46, 122, 69, 0.6);
	}
	.st .ow {
		translate: 0 calc(var(--rh) * -2 + 14px);
	}
	.mg .ow .o1 {
		opacity: 0;
		scale: 1.04;
	}
	.mg .ow .o2 {
		opacity: 1;
		scale: 1;
	}
	.fk {
		position: absolute;
		left: 0;
		top: 0;
		width: 24px;
		height: 24px;
		margin: -12px 0 0 -12px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		color: #fff;
		z-index: 9;
		pointer-events: none;
		box-shadow: 0 4px 10px rgba(30, 50, 45, 0.25);
	}
	.fd .ms,
	.fd .ow {
		opacity: 0;
		transition: opacity 0.4s;
	}
</style>
