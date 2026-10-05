<!--
  The dark "Auf Knopfdruck" section. The button runs a billing demo: the bar
  fills in 24 steps, then the final status and confetti. With reduced motion
  it jumps to the end, without confetti.
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { burst } from "$lib/landing/confetti";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import type { RegionContent } from "./types";

	let { content }: { content: RegionContent } = $props();
	const s = $derived(content.billing);

	const N = 24;
	let n = $state(0);
	let running = $state(false);
	let done = $state(false);

	let card = $state<HTMLElement>();
	let button = $state<HTMLButtonElement>();
	let canvas = $state<HTMLCanvasElement>();
	let timer: ReturnType<typeof setInterval> | undefined;
	let stopConfetti = () => {};

	function finish() {
		clearInterval(timer);
		n = N;
		running = false;
		done = true;
		if (!card || !button || !canvas) return;
		// The canvas reaches 80 px past the card on every side.
		const r = card.getBoundingClientRect();
		const b = button.getBoundingClientRect();
		stopConfetti();
		stopConfetti = burst(
			canvas,
			{ width: r.width + 160, height: r.height + 160 },
			{
				x: b.left - r.left + b.width / 2 + 80,
				y: b.top - r.top + 80,
				width: b.width,
			},
			{ speed: [3.2, 4.2], size: { w: [5, 6], h: [8, 8] }, spread: 0.6 },
		);
	}

	function run() {
		if (running) return;
		done = false;
		n = 0;
		running = true;
		if (prefersReducedMotion()) return finish();
		timer = setInterval(() => {
			n++;
			if (n >= N) finish();
		}, 70);
	}

	$effect(() => () => {
		clearInterval(timer);
		stopConfetti();
	});
</script>

<section class="dark knopf" aria-labelledby="kn-h">
	<div class="wrap">
		<div>
			<div class="eyebrow on-dark">Heizkostenabrechnung</div>
			<h2 id="kn-h">{s.title}</h2>
			<p class="sub">{s.text}</p>
			<ul>
				{#each s.checks as check (check)}
					<li><span class="okb"><Check /></span>{check}</li>
				{/each}
			</ul>
		</div>
		<div class="hk" bind:this={card}>
			<div class="hk-h">
				<div>
					<div class="s">Abrechnungszeitraum 2026</div>
					<div class="t">{content.example.address}</div>
				</div>
				<div class="s">24 Einheiten</div>
			</div>
			<div class="hk-list">
				<div><span>Brennstoffkosten</span><b>18.460 €</b></div>
				<div><span>Wartung &amp; Betriebsstrom</span><b>1.240 €</b></div>
				<div><span>Messdienst</span><b>nach installierten Zählern</b></div>
				<div><span>Verteilerschlüssel</span><b>70 / 30</b></div>
			</div>
			<button
				class="hk-btn"
				type="button"
				bind:this={button}
				disabled={running}
				onclick={run}
			>
				{running
					? "Wird erstellt …"
					: done
						? "Noch einmal ansehen"
						: "Abrechnung erstellen"}
			</button>
			<div class="hk-prog"><b style:width="{(n / N) * 100}%"></b></div>
			<div class={["hk-status", done && "done"]} aria-hidden="true">
				{#if running}
					Einheit {n} von {N} abgerechnet
				{:else if done}
					✓ 24 Abrechnungen erstellt und an Ihre Software übergeben
				{:else}
					Klicken Sie auf den Button, um die Abrechnung zu starten.
				{/if}
			</div>
			<!-- Announces the start and the result, not every step. -->
			<p class="sr-only" aria-live="polite">
				{#if running}Abrechnung wird erstellt …{:else if done}24 Abrechnungen
					erstellt und an Ihre Software übergeben{/if}
			</p>
			<canvas class="hk-confetti" bind:this={canvas} aria-hidden="true"
			></canvas>
		</div>
	</div>
</section>

<style>
	.dark {
		background: var(--ink);
		color: #fff;
	}
	.knopf {
		padding-block: 110px;
		/* The confetti canvas reaches past the card; never widen the page. */
		overflow-x: clip;
	}
	.wrap {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 56px;
		align-items: center;
	}
	.on-dark {
		color: var(--accent);
	}
	h2 {
		font-size: clamp(32px, 4vw, 52px);
		line-height: 1.06;
		letter-spacing: -0.03em;
	}
	.sub {
		color: #b7c4bf;
		font-size: 18px;
		margin-top: 16px;
		max-width: 42ch;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 26px 0 0;
		display: grid;
		gap: 12px;
		font-size: 16px;
	}
	li {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.hk {
		position: relative;
		background: #fff;
		color: var(--ink);
		border-radius: 18px;
		padding: 24px;
		box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.45);
	}
	.hk-h {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		border-bottom: 1px solid var(--line);
		padding-bottom: 12px;
	}
	.hk-h .t {
		font-weight: 600;
		font-size: 18px;
	}
	.hk-h .s {
		color: var(--muted);
		font-size: 13px;
	}
	.hk-list {
		display: grid;
		gap: 8px;
		margin-top: 14px;
		font-size: 14px;
	}
	.hk-list div {
		display: flex;
		justify-content: space-between;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.hk-list b {
		color: var(--ink);
		font-weight: 500;
	}
	.hk-confetti {
		position: absolute;
		left: -80px;
		top: -80px;
		pointer-events: none;
		z-index: 5;
		width: calc(100% + 160px);
		height: calc(100% + 160px);
	}
	.hk-btn {
		margin-top: 18px;
		width: 100%;
		border: 0;
		border-radius: 10px;
		background: var(--accent);
		color: var(--ink);
		font-weight: 600;
		font-size: 16px;
		padding: 14px;
		cursor: pointer;
		transition:
			transform 0.15s,
			filter 0.2s;
	}
	.hk-btn:hover {
		filter: brightness(0.96);
	}
	.hk-btn:active {
		transform: scale(0.98);
	}
	.hk-btn[disabled] {
		cursor: default;
	}
	.hk-prog {
		height: 8px;
		background: #edeeed;
		border-radius: 4px;
		margin-top: 14px;
		overflow: hidden;
	}
	.hk-prog b {
		display: block;
		height: 100%;
		background: var(--accent);
		transition: width 0.1s linear;
	}
	.hk-status {
		margin-top: 10px;
		font-size: 14px;
		color: var(--muted);
		min-height: 21px;
		font-variant-numeric: tabular-nums;
	}
	.hk-status.done {
		color: #2f7a3c;
		font-weight: 600;
	}

	@media (max-width: 980px) {
		.wrap {
			grid-template-columns: 1fr;
		}
	}
</style>
