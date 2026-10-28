<!--
  The software card's picture (the design's figure.ip-orb, #ip-orb-css /
  #ip-orb-js): Heidi in the middle, eight systems on dashed spokes around
  it, the ring turning slowly (80 s, the labels counter-turning). Every
  1.6 s while in view a dot runs along one spoke, out to its system for a
  round and back in the next, and the system lights up with its name; an
  inbound dot makes the centre ripple. Nothing moves with reduced motion,
  and every name shows. The figure names the picture; its parts are hidden
  from screen readers.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import HeidiBars from "../components/HeidiBars.svelte";
	import { orb, type OrbIcon } from "../content";
	import { ease, ORB, pulse, spoke } from "../scenes";

	const n = orb.systems.length;
	const ends = orb.systems.map((_, i) => spoke(i, n));
	/** The systems' centres in % of the box (the spoke ends). */
	const at = ends.map((p) => ({ left: p.x / 4, top: p.y / 4 }));

	let lit = $state<number | null>(null);
	let dot = $state<{ x: number; y: number } | null>(null);
	let ripple = $state(0);
	let k = 0;

	function run() {
		const { system, out } = pulse(k++, n);
		const end = ends[system];
		lit = system;
		const t0 = performance.now();
		let timer: ReturnType<typeof setTimeout> | undefined;
		let frame = requestAnimationFrame(function step(now) {
			const q = Math.min(1, (now - t0) / ORB.flight);
			const u = out ? ease(q) : 1 - ease(q);
			dot = { x: 200 + (end.x - 200) * u, y: 200 + (end.y - 200) * u };
			if (q < 1) {
				frame = requestAnimationFrame(step);
				return;
			}
			dot = null;
			if (!out) ripple++;
			timer = setTimeout(() => (lit = null), ORB.linger);
		});
		return () => {
			cancelAnimationFrame(frame);
			clearTimeout(timer);
			dot = null;
			lit = null;
		};
	}
</script>

{#snippet icon(name: OrbIcon)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="#fff"
		stroke-width="1.7"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		{#if name === "building"}
			<path d="M4 20V8l8-4 8 4v12" /><path d="M9 20v-5h6v5" /><path
				d="M8 11h2M14 11h2"
			/>
		{:else if name === "people"}
			<circle cx="9" cy="9" r="3" /><path
				d="M3.5 19a5.5 5.5 0 0 1 11 0"
			/><circle cx="17" cy="10" r="2.4" /><path
				d="M15.5 14.6A4.5 4.5 0 0 1 21 19"
			/>
		{:else if name === "ledger"}
			<rect x="5" y="3.5" width="14" height="17" rx="2" /><path
				d="M8.5 8h7M8.5 12h7M8.5 16h4"
			/>
		{:else if name === "exchange"}
			<path d="M4 9h13l-3-3M20 15H7l3 3" />
		{:else if name === "phone"}
			<rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path
				d="M11 18.5h2"
			/>
		{:else if name === "doc"}
			<path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" />
		{:else if name === "receipt"}
			<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" />
		{:else}
			<rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path
				d="M3.5 10h17M8 3v4M16 3v4"
			/>
		{/if}
	</svg>
{/snippet}

<figure
	class="orb"
	aria-label={orb.label}
	{@attach loopInView({ run, every: ORB.every, threshold: 0, delay: 400 })}
>
	<div class="ob" aria-hidden="true">
		<span class="rg r2"></span>
		{#key ripple}<span class={["rg r3", ripple > 0 && "hit"]}></span>{/key}
		<div class="os">
			<svg class="sp" viewBox="0 0 400 400">
				{#each ends as end, i (i)}
					<line
						x1="200"
						y1="200"
						x2={end.x}
						y2={end.y}
						class={[lit === i && "on"]}
					/>
				{/each}
				{#if dot}<circle class="dot" r="5" cx={dot.x} cy={dot.y} />{/if}
			</svg>
			{#each orb.systems as system, i (system.name)}
				<span
					class={["sat", lit === i && "on"]}
					style:left="{at[i].left}%"
					style:top="{at[i].top}%"
					style:--c={system.color}
					><span class="sr"
						><span class="sb">{@render icon(system.icon)}</span><em
							>{system.name}</em
						></span
					></span
				>
			{/each}
		</div>
		<div class="oc">
			<b>{orb.brand}</b><HeidiBars /><small>{orb.status}</small>
		</div>
	</div>
</figure>

<style>
	.orb {
		margin: 0;
		aspect-ratio: 1/1;
		background: #eef1ef;
		border-radius: 20px;
		display: grid;
		place-items: center;
		overflow: hidden;
	}
	.ob {
		position: relative;
		width: min(88%, 460px);
		aspect-ratio: 1/1;
		container-type: inline-size;
	}
	.rg {
		position: absolute;
		border-radius: 50%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}
	.rg.r2 {
		width: 38%;
		height: 38%;
		background: #e5eae7;
	}
	.rg.r3 {
		width: 30%;
		height: 30%;
		border: 2px solid #8ad68f;
		opacity: 0;
	}
	.rg.r3.hit {
		animation: ipOr 1.1s ease-out;
	}
	@keyframes ipOr {
		0% {
			opacity: 0.8;
			width: 25%;
			height: 25%;
		}
		100% {
			opacity: 0;
			width: 60%;
			height: 60%;
		}
	}
	.os {
		position: absolute;
		inset: 0;
		animation: ipSpinO 80s linear infinite;
	}
	.sp {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.sp line {
		stroke: #cbd5d0;
		stroke-width: 1.2;
		stroke-dasharray: 2 5;
		transition: stroke 0.3s;
	}
	.sp line.on {
		stroke: #8ad68f;
		stroke-dasharray: none;
		stroke-width: 2;
	}
	.dot {
		fill: #8ad68f;
		stroke: #fff;
		stroke-width: 2;
	}
	.oc {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 25%;
		height: 25%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: #1e322d;
		color: #fff;
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		align-items: center;
		justify-content: center;
		column-gap: 7px;
		box-shadow: 0 22px 44px -20px rgba(30, 50, 45, 0.65);
		z-index: 2;
	}
	.oc b {
		font-size: 5.4cqw;
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.oc :global(svg) {
		width: 4.2cqw;
	}
	.oc small {
		flex-basis: 100%;
		text-align: center;
		font-size: max(9px, 2.7cqw);
		color: #8ad68f;
		margin-top: 2px;
	}
	.sat {
		position: absolute;
		width: 0;
		height: 0;
		z-index: 3;
	}
	.sr {
		position: absolute;
		left: 0;
		top: 0;
		translate: -50% -50%;
		display: grid;
		place-items: center;
		animation: ipSpinO 80s linear infinite reverse;
	}
	.sb {
		width: 12.5cqw;
		height: 12.5cqw;
		border-radius: 50%;
		background: var(--c);
		display: grid;
		place-items: center;
		box-shadow:
			0 0 0 1.2cqw #eef1ef,
			0 12px 24px -14px rgba(30, 50, 45, 0.55);
		transition:
			transform 0.35s cubic-bezier(0.3, 1.5, 0.5, 1),
			box-shadow 0.35s;
	}
	.sb :global(svg) {
		width: 46%;
		height: 46%;
	}
	.sr em {
		position: absolute;
		top: calc(100% + 2cqw);
		font-style: normal;
		font-size: max(10px, 2.9cqw);
		font-weight: 600;
		color: #1e322d;
		white-space: nowrap;
		background: #fff;
		border-radius: 999px;
		padding: 3px 10px;
		box-shadow: 0 6px 16px -8px rgba(30, 50, 45, 0.4);
		opacity: 0;
		transform: translateY(-4px);
		transition:
			opacity 0.3s,
			transform 0.3s;
		pointer-events: none;
	}
	.sat.on .sb {
		transform: scale(1.12);
		box-shadow:
			0 0 0 1.2cqw #eef1ef,
			0 0 0 2cqw rgba(138, 214, 143, 0.55),
			0 12px 24px -14px rgba(30, 50, 45, 0.55);
	}
	.sat.on em {
		opacity: 1;
		transform: none;
	}
	@keyframes ipSpinO {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.os,
		.sr {
			animation: none;
		}
		.sr em {
			opacity: 1;
			transform: none;
			font-size: 10px;
		}
	}
</style>
