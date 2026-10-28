<!--
  fr4 "Wächst mit Ihrem Bestand": four systems around the Heidi hub. The
  server renders the tiles and the hub, none lit. In view, every 2.2 s (first
  after 0.9 s) the hub pulses and a dot flies to the next tile, which lights
  650 ms later; leaving the view unlights them.
-->
<script lang="ts">
	import { inView } from "$lib/landing/attachments/inView";
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Bars from "../Bars.svelte";
	import Icon from "../Icon.svelte";
	import type { HubTile } from "../types";

	let { tile }: { tile: HubTile } = $props();

	/** The lit tile, if any. */
	let lit = $state<number | null>(null);

	let dot = $state<HTMLElement>();
	let hub = $state<HTMLElement>();
	let next = 0;

	/** Restarts a CSS animation by toggling its class. */
	function restart(el: HTMLElement, cls: string) {
		el.classList.remove(cls);
		void el.offsetWidth;
		el.classList.add(cls);
	}

	function step() {
		const first = hub?.parentElement?.firstElementChild;
		if (!dot || !hub || !(first instanceof HTMLElement)) return;
		const i = next;
		next = (next + 1) % tile.tiles.length;
		// The design's offsets are for 150 px tiles (120 px below 480 px).
		const scale = first.offsetWidth / 150;
		dot.style.setProperty("--dx", `${(i % 2 ? 80 : -80) * scale}px`);
		dot.style.setProperty("--dy", `${(i < 2 ? -80 : 80) * scale}px`);
		restart(hub, "pulse");
		restart(dot, "go");
		const timer = setTimeout(() => (lit = i), 650);
		return () => clearTimeout(timer);
	}
</script>

<div
	class="tiles"
	aria-hidden="true"
	{@attach loopInView({ run: step, every: 2200, delay: 900, threshold: 0.25 })}
	{@attach inView({ threshold: 0.25, onLeave: () => (lit = null) })}
>
	{#each tile.tiles as t, i (t.title)}
		<div class={["t", lit === i && "on"]}>
			<Icon name={t.icon} /><b>{t.title}</b><small>{t.status}</small>
		</div>
	{/each}
	<span class="dot" bind:this={dot}></span>
	<span class="hub" bind:this={hub}><Bars /></span>
</div>

<style>
	.tiles {
		position: relative;
		display: grid;
		grid-template-columns: repeat(2, 150px);
		gap: 10px;
	}
	.t {
		position: relative;
		height: 150px;
		border-radius: 18px;
		background: #fdfdfc;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		opacity: 0;
		transform: scale(0.9);
		transition:
			opacity 0.5s,
			transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1),
			background 0.4s,
			box-shadow 0.4s;
	}
	.t :global(svg) {
		width: 28px;
		height: 28px;
		color: var(--ink);
		transition:
			color 0.35s,
			transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	.t b {
		font-size: 15px;
		font-weight: 600;
		transition: transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	.t small {
		position: absolute;
		left: 8px;
		right: 8px;
		bottom: 12px;
		text-align: center;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.35s,
			transform 0.35s;
	}
	:global(.in) .t {
		opacity: 1;
		transform: none;
	}
	:global(.in) .t:nth-child(2) {
		transition-delay: 0.12s;
	}
	:global(.in) .t:nth-child(3) {
		transition-delay: 0.24s;
	}
	:global(.in) .t:nth-child(4) {
		transition-delay: 0.36s;
	}
	.t.on {
		background: #fff;
		box-shadow:
			0 0 0 2px var(--accent),
			0 14px 28px -18px rgba(30, 50, 45, 0.45);
	}
	.t.on :global(svg) {
		color: #2f7a3c;
		transform: translateY(-8px);
	}
	.t.on b {
		transform: translateY(-8px);
	}
	.t.on small {
		opacity: 1;
		transform: none;
	}
	.hub {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 52px;
		height: 52px;
		margin: -26px 0 0 -26px;
		border-radius: 50%;
		background: var(--accent);
		display: grid;
		place-items: center;
		box-shadow: 0 0 0 6px var(--bg);
		transform: scale(0);
		transition: transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) 0.6s;
	}
	.hub :global(svg) {
		width: 22px;
		height: 19px;
	}
	:global(.in) .hub {
		transform: scale(1);
	}
	.hub::after {
		content: "";
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 2px solid var(--accent);
		opacity: 0;
	}
	.hub:global(.pulse)::after {
		animation: fr-pulse 0.9s ease-out;
	}
	@keyframes fr-pulse {
		0% {
			opacity: 0.8;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(1.7);
		}
	}
	.dot {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 12px;
		height: 12px;
		margin: -6px 0 0 -6px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 4px rgba(138, 214, 143, 0.35);
		opacity: 0;
		z-index: 2;
		pointer-events: none;
	}
	.dot:global(.go) {
		animation: fr-dot 0.7s cubic-bezier(0.5, 0, 0.3, 1) forwards;
	}
	@keyframes fr-dot {
		0% {
			opacity: 1;
			transform: translate(0, 0) scale(0.6);
		}
		85% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translate(var(--dx), var(--dy)) scale(1);
		}
	}
	@media (max-width: 480px) {
		.tiles {
			grid-template-columns: repeat(2, 120px);
		}
		.t {
			height: 120px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.t,
		.t :global(svg),
		.t b,
		.t small,
		.hub {
			transition: none;
		}
		.dot,
		.hub::after {
			display: none;
		}
	}
</style>
