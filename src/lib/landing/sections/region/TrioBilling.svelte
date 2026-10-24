<!--
  Trio demo 1: "Abrechnung erstellen" fills in 24 steps, then shows the
  result with confetti. Clicking again resets it. Reduced motion: straight
  to the result, no confetti.
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { burst } from "$lib/landing/confetti";
	import { prefersReducedMotion } from "$lib/landing/motion";

	const N = 24;
	// The 64 rays of the background burst (decorative)
	const rays = Array.from({ length: 64 }, (_, i) => {
		const a = (2 * Math.PI * i) / 64;
		const p = (r: number) =>
			[200 + r * Math.cos(a), 200 + r * Math.sin(a)].map((v) => v.toFixed(1));
		const [x1, y1] = p(60);
		const [x2, y2] = p(300);
		return { x1, y1, x2, y2 };
	});

	let status = $state<"idle" | "run" | "done">("idle");
	let n = $state(0);
	const label = $derived(
		status === "run"
			? `Einheit ${n} von ${N}`
			: status === "done"
				? "24 Abrechnungen erstellt"
				: "Abrechnung erstellen",
	);

	let vis = $state<HTMLElement>();
	let button = $state<HTMLButtonElement>();
	let canvas = $state<HTMLCanvasElement>();
	let timers: ReturnType<typeof setTimeout>[] = [];
	let interval: ReturnType<typeof setInterval> | undefined;
	let stopConfetti = () => {};

	function finish() {
		status = "done";
		n = N;
		if (!vis || !button || !canvas) return;
		const r = vis.getBoundingClientRect();
		const b = button.getBoundingClientRect();
		stopConfetti();
		stopConfetti = burst(
			canvas,
			{ width: r.width, height: r.height },
			{
				x: b.left - r.left + b.width / 2,
				y: b.top - r.top + 6,
				width: b.width,
			},
		);
	}

	function onclick() {
		if (status === "run") return;
		if (status === "done") {
			status = "idle";
			n = 0;
			return;
		}
		status = "run";
		n = 0;
		if (prefersReducedMotion()) return finish();
		interval = setInterval(() => {
			n++;
			if (n < N) return;
			clearInterval(interval);
			timers.push(setTimeout(finish, 250));
		}, 60);
	}

	$effect(() => () => {
		clearInterval(interval);
		timers.forEach(clearTimeout);
		stopConfetti();
	});
</script>

<div class={["t-vis t1", status !== "idle" && status]} bind:this={vis}>
	<svg
		class="t-burst"
		viewBox="0 0 400 400"
		preserveAspectRatio="xMidYMid slice"
		aria-hidden="true"
	>
		<g>
			{#each rays as ray, i (i)}<line {...ray} />{/each}
		</g>
	</svg>
	<button class="t-btn" type="button" bind:this={button} {onclick}>
		<span class="t1-fill" style:width="{(n / N) * 100}%"></span>
		<span class="bolt">
			<span class="t1-bo">
				<svg viewBox="0 0 9 14" aria-hidden="true"
					><path d="M6 0L0 8h4l-1 6 6-8H5z" fill="#8AD68F" /></svg
				>
			</span>
			<span class="t1-ck"><Check color="#fff" /></span>
		</span>
		<span class="t1-l">{label}</span>
		<svg class="t-cur" viewBox="0 0 24 28" aria-hidden="true">
			<path
				d="M2 2l19 11-8.5 1.8L8 24z"
				fill="#1E322D"
				stroke="#fff"
				stroke-width="1.6"
				stroke-linejoin="round"
			/>
		</svg>
	</button>
	<span class="t-hint t1-again" aria-hidden="true"
		>Nochmal klicken zum Zurücksetzen</span
	>
	<p class="sr-only" aria-live="polite">
		{#if status === "done"}24 Abrechnungen erstellt{/if}
	</p>
	<canvas class="t1-cf" bind:this={canvas} aria-hidden="true"></canvas>
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
	.t-burst {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.t-burst g {
		stroke: #dee1de;
		stroke-width: 1;
		transition: stroke 0.6s;
	}
	.done .t-burst g {
		stroke: #c6e8c9;
	}
	.done .t-burst {
		transform: scale(1.08) rotate(3deg);
	}
	.t-btn {
		position: relative;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		background: var(--accent);
		color: var(--ink);
		font-size: clamp(17px, 1.7vw, 22px);
		font-weight: 500;
		border: 0;
		border-radius: 8px;
		padding: 18px 24px;
		box-shadow:
			0 1px 0 rgba(30, 50, 45, 0.08),
			0 14px 30px -14px rgba(30, 50, 45, 0.35);
		white-space: nowrap;
		cursor: pointer;
		overflow: visible;
		transition:
			background 0.35s,
			color 0.35s,
			transform 0.15s;
	}
	.t-btn:active {
		transform: scale(0.97);
	}
	.t1-fill {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		background: #6fc476;
		border-radius: 8px;
		transition: width 0.1s linear;
	}
	.bolt {
		position: relative;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--ink);
		display: grid;
		place-items: center;
		flex: none;
	}
	.bolt svg {
		width: 9px;
		height: 14px;
		display: block;
	}
	.t1-bo {
		display: grid;
		place-items: center;
		line-height: 0;
	}
	.t1-ck {
		display: none;
	}
	.t1-ck :global(svg) {
		width: 10px;
	}
	.done .t1-bo {
		display: none;
	}
	.done .t1-ck {
		display: grid;
		place-items: center;
		animation: hp-pop 0.45s both;
	}
	.done .t-btn {
		background: var(--ink);
		color: #fff;
	}
	.done .t1-fill {
		opacity: 0;
	}
	.done .bolt {
		background: #3e9a57;
	}
	.t1-l {
		position: relative;
		font-variant-numeric: tabular-nums;
		min-width: 11ch;
		text-align: left;
	}
	.t-cur {
		position: absolute;
		right: -14px;
		bottom: -26px;
		width: 30px;
		filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
		transition:
			opacity 0.3s,
			transform 0.3s;
	}
	.t-btn:hover .t-cur,
	.run .t-cur,
	.done .t-cur {
		opacity: 0;
		transform: translate(6px, 6px);
	}
	.t-hint {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 22px;
		text-align: center;
		font-size: 12.5px;
		color: var(--faint);
		opacity: 0;
		transition: opacity 0.4s;
	}
	.done .t1-again {
		opacity: 1;
	}
	.t1-cf {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
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
	}
</style>
