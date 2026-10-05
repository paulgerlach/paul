<!--
  Trio demo 3: "Zugang an Mieter senden" walks through the tenant getting
  their uVI access in three stages. Afterwards the whole visual is a reset
  button. Reduced motion: straight to the last stage.
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import type { RegionContent } from "./types";

	let { example }: { example: RegionContent["example"] } = $props();

	let stage = $state(0);
	let busy = $state(false);
	let timers: ReturnType<typeof setTimeout>[] = [];

	function send() {
		if (busy || stage) return;
		if (prefersReducedMotion()) {
			stage = 3;
			return;
		}
		busy = true;
		timers = [
			setTimeout(() => (stage = 1), 350),
			setTimeout(() => (stage = 2), 1000),
			setTimeout(() => {
				stage = 3;
				busy = false;
			}, 1650),
		];
	}

	function reset() {
		stage = 0;
	}

	$effect(() => () => timers.forEach(clearTimeout));
</script>

<div
	class={[
		"t-vis t3",
		stage >= 1 && "s1",
		stage >= 2 && "s2",
		stage >= 3 && "s3",
	]}
>
	<div class="t-flow">
		<div class="t-box">
			<span class="lg">
				<svg
					viewBox="0 0 20 20"
					fill="none"
					stroke="#1E322D"
					stroke-width="1.6"
					aria-hidden="true"
				>
					<path d="M3 9l7-6 7 6v8H3z" /><path d="M8 17v-5h4v5" />
				</svg>
			</span>
			<div>
				<b>{example.address}</b><small>{example.units} Mietparteien</small>
			</div>
		</div>
		<div class="t-step t3-1">
			<span class="t-sq"></span>
			<button class="t3-send" type="button" onclick={send}>
				<svg viewBox="0 0 24 24" width="12" aria-hidden="true"
					><path d="M2 11l19-8-7 19-3-8z" fill="#1E322D" /></svg
				>
				<span
					>{busy && stage === 0 ? "Sendet …" : "Zugang an Mieter senden"}</span
				>
			</button>
			<span class="t-chip t3-c1">
				<span class="t-ok"><Check color="#fff" /></span>Zugang per E-Mail
				versendet
			</span>
		</div>
		<div class="t-step t3-2">
			<span class="t-sq"></span>
			<span class="t-chip tenant">
				<span class="t-av">{example.tenant}</span>
				<span class="t-okbox"><Check color="#3E9A57" /></span>
				<span>Wohnung 07<small>Zugang aktiviert</small></span>
			</span>
		</div>
		<div class="t-box t3-3">
			<span class="lg">
				<span class="t3-cl">
					<svg
						viewBox="0 0 20 20"
						width="20"
						fill="none"
						stroke="#9AA5A1"
						stroke-width="1.6"
						aria-hidden="true"
					>
						<circle cx="10" cy="10" r="7.5" /><path d="M10 6v4l3 2" />
					</svg>
				</span>
				<span class="t3-ok"><Check color="#3E9A57" /></span>
			</span>
			<div>
				<b>uVI September</b><small
					>{stage === 3
						? "142 kWh · −12 % ggü. August"
						: "Wartet auf Zugang"}</small
				>
			</div>
		</div>
	</div>
	<p class="sr-only" aria-live="polite">
		{#if stage === 3}Zugang versendet, uVI September: 142 kWh, minus 12 %
			gegenüber August{/if}
	</p>
	{#if stage === 3}
		<button class="t-reset" type="button" onclick={reset}>
			<span class="t-hint">Klicken zum Zurücksetzen</span>
		</button>
	{/if}
</div>

<style>
	.t-vis {
		position: relative;
		aspect-ratio: 1/1;
		background: var(--stone);
		border-radius: 16px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.t-flow {
		width: 100%;
		padding: 0 9%;
		position: relative;
	}
	.t-flow::before,
	.t-flow::after {
		content: "";
		position: absolute;
		left: calc(9% + 34px);
		top: 60px;
		bottom: 60px;
	}
	.t-flow::before {
		border-left: 1px solid #d2d7d4;
	}
	.t-flow::after {
		border-left: 2px solid #3e9a57;
		margin-left: -0.5px;
		transform: scaleY(0);
		transform-origin: top;
		transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.s1 .t-flow::after {
		transform: scaleY(0.4);
	}
	.s2 .t-flow::after {
		transform: scaleY(0.72);
	}
	.s3 .t-flow::after {
		transform: scaleY(1);
	}
	.t-box {
		position: relative;
		z-index: 1;
		background: #fff;
		border-radius: 12px;
		padding: 10px;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: 14px;
	}
	.t-box > div {
		min-width: 0;
	}
	.lg {
		width: clamp(44px, 4.3vw, 56px);
		height: clamp(44px, 4.3vw, 56px);
		border-radius: 8px;
		background: #f1f3f2;
		display: grid;
		place-items: center;
		flex: none;
		transition: background 0.3s;
	}
	.lg svg {
		width: 22px;
	}
	.t-box b {
		display: block;
		font-weight: 500;
		font-size: clamp(15px, 1.35vw, 19px);
		letter-spacing: -0.01em;
		white-space: nowrap;
	}
	.t-box small {
		color: var(--muted);
		font-size: clamp(11.5px, 1vw, 13.5px);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
	.t-step {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: clamp(14px, 2vw, 26px);
		margin: clamp(10px, 1.4vw, 16px) 0 0 26px;
	}
	.t-step + .t-box {
		margin-top: clamp(10px, 1.4vw, 16px);
	}
	.t-sq {
		width: 16px;
		height: 16px;
		border-radius: 4px;
		background: var(--ink);
		flex: none;
		transition: background 0.3s;
	}
	.t-chip {
		background: #fff;
		border-radius: 8px;
		padding: 8px 12px;
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: clamp(12.5px, 1.1vw, 14.5px);
	}
	.t-chip.tenant {
		padding: 6px 14px 6px 6px;
	}
	.t-chip small {
		display: block;
		color: var(--muted);
		font-size: 11px;
	}
	.t-av {
		width: 34px;
		height: 34px;
		border-radius: 6px;
		background: #fbe6da;
		color: #b4461e;
		font-weight: 700;
		font-size: 12px;
		display: grid;
		place-items: center;
		flex: none;
	}
	.t-ok {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #3e9a57;
		display: grid;
		place-items: center;
		flex: none;
	}
	.t-ok :global(svg) {
		width: 9px;
	}
	.t-okbox {
		width: 34px;
		height: 34px;
		border-radius: 6px;
		background: #e6f5e7;
		display: grid;
		place-items: center;
		flex: none;
	}
	.t-okbox :global(svg),
	.t3-ok :global(svg) {
		width: 14px;
	}
	.t3-send {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 7px;
		flex: none;
		border: 0;
		font-family: inherit;
		cursor: pointer;
		background: var(--accent);
		color: var(--ink);
		font-weight: 600;
		font-size: clamp(12.5px, 1.1vw, 14px);
		padding: 9px 13px;
		border-radius: 8px;
		white-space: nowrap;
		transition:
			filter 0.2s,
			transform 0.15s;
	}
	.t3-send:hover {
		filter: brightness(0.95);
	}
	.t3-send:active {
		transform: scale(0.96);
	}
	.t3:not(.s1) .t3-send::after {
		content: "";
		position: absolute;
		inset: -4px;
		border-radius: 11px;
		border: 2px solid var(--accent);
		animation: t-ring2 1.8s ease-out infinite;
	}
	@keyframes t-ring2 {
		0% {
			opacity: 0.9;
			transform: scale(0.95);
		}
		100% {
			opacity: 0;
			transform: scale(1.15);
		}
	}
	.t3-1,
	.t3-2,
	.t3-3 {
		transition: opacity 0.4s;
	}
	.t3:not(.s2) .t3-2 {
		opacity: 0.4;
	}
	.t3:not(.s1) .t3-c1 {
		display: none;
	}
	.s1 .t3-send {
		display: none;
	}
	.t3:not(.s3) .t3-3 {
		opacity: 0.55;
	}
	.t3:not(.s1) .t3-1 .t-sq {
		background: var(--accent);
	}
	.t3:not(.s2) .t3-2 .t-sq {
		background: #c9cfcc;
	}
	.t3-1 .t-ok,
	.t3-2 .t-okbox {
		transform: scale(0);
		transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.s1 .t3-1 .t-ok,
	.s2 .t3-2 .t-okbox {
		transform: none;
	}
	.t3-ok,
	.s3 .t3-cl {
		display: none;
	}
	.s3 .t3-ok {
		display: grid;
		place-items: center;
		animation: hp-pop 0.45s both;
	}
	.s3 .t3-3 .lg {
		background: #e6f5e7;
	}
	@keyframes hp-pop {
		0% {
			transform: scale(0.4);
			opacity: 0;
		}
		60% {
			transform: scale(1.15);
			opacity: 1;
		}
		100% {
			transform: none;
		}
	}
	/* After the last stage, the whole visual resets it. */
	.t-reset {
		position: absolute;
		inset: 0;
		z-index: 2;
		border: 0;
		background: transparent;
		cursor: pointer;
		border-radius: 16px;
	}
	.t-hint {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 10px;
		text-align: center;
		font-size: 12.5px;
		color: var(--faint);
	}

	@media (max-width: 980px) {
		.t-vis {
			aspect-ratio: auto;
			height: 400px;
		}
	}
	@media (max-width: 560px) {
		.t-vis {
			height: 360px;
		}
		.t3-send {
			font-size: 11.5px;
			padding: 7px 9px;
		}
	}
</style>
