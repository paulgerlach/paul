<!--
  Trio demo 2: a power of attorney ("Vollmacht") that signs itself. A pen
  draws the signature, the stamp and today's date appear, the four steps
  Heidi takes over light up one by one, and confetti ends it. Plays once when
  it comes into view; a click on the field replays it. Reduced motion: the
  steps without the drawing, no confetti.
-->
<script lang="ts">
	import { onMount } from "svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { burst } from "$lib/landing/confetti";
	import { prefersReducedMotion } from "$lib/landing/motion";

	const STEPS = [
		{ title: "Kündigung", sub: "per Vollmacht" },
		{ title: "Montage", sub: "geplant" },
		{ title: "Mieter", sub: "informiert" },
		{ title: "Abrechnung", sub: "eingerichtet" },
	];
	const READY = "Eine Unterschrift genügt";
	const DONE = "Erledigt. Ihr Team musste nichts koordinieren.";

	let phase = $state<"idle" | "signing" | "signed" | "done">("idle");
	let steps = $state(0);
	let status = $state(READY);
	/** Signed today; set in the browser only, shown once signed. */
	let date = $state("");
	/** Share of the signature drawn, 0–1. */
	let drawn = $state(0);
	let pen = $state<{ x: number; y: number }>();

	let vis = $state<HTMLElement>();
	let field = $state<HTMLButtonElement>();
	let path = $state<SVGPathElement>();
	let canvas = $state<HTMLCanvasElement>();
	/** Length of the signature path, measured in the browser. */
	let length = $state(0);

	let busy = false;
	let timers: ReturnType<typeof setTimeout>[] = [];
	let frame = 0;
	let stopConfetti = () => {};
	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

	onMount(() => {
		date = new Date().toLocaleDateString("de-DE", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
		if (path) length = path.getTotalLength();
	});

	/** The pen's tip at `len` along the signature, relative to the field. */
	function penAt(len: number) {
		const m = path?.getScreenCTM();
		if (!path || !field || !m) return;
		const p = path.getPointAtLength(len);
		const s = new DOMPoint(p.x, p.y).matrixTransform(m);
		const f = field.getBoundingClientRect();
		pen = { x: s.x - f.left - 2, y: s.y - f.top - 24 };
	}

	function reset() {
		timers.forEach(clearTimeout);
		timers = [];
		cancelAnimationFrame(frame);
		phase = "idle";
		steps = 0;
		drawn = 0;
		pen = undefined;
		status = READY;
	}

	function confetti() {
		if (!vis || !field || !canvas) return;
		const r = vis.getBoundingClientRect();
		const b = field.getBoundingClientRect();
		stopConfetti();
		stopConfetti = burst(
			canvas,
			{ width: r.width, height: r.height },
			{
				x: b.left - r.left + b.width / 2,
				y: b.top - r.top + b.height / 2,
				width: b.width,
			},
			{
				count: 70,
				speed: [2.2, 3.4],
				angle: 1.2,
				spread: 0.6,
				gravity: 0.05,
				maxFall: 1.1,
				wobble: [420, 0.5],
				spin: 0.12,
				fadeAfter: 3400,
				fadeMs: 1000,
				maxTime: 4600,
			},
		);
	}

	function play() {
		if (busy) return;
		if (phase === "done") {
			reset();
			at(350, play);
			return;
		}
		busy = true;
		const reduced = prefersReducedMotion();
		const sl = (ms: number) => (reduced ? Math.min(ms, 80) : ms);
		phase = "signing";
		status = "Wird unterschrieben …";
		const duration = reduced ? 1 : 1900;
		const t0 = performance.now();
		frame = requestAnimationFrame(function tick(now) {
			const p = Math.min(1, (now - t0) / duration);
			drawn = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
			if (!reduced) penAt(length * drawn);
			if (p < 1) {
				frame = requestAnimationFrame(tick);
				return;
			}
			pen = undefined;
			phase = "signed";
			status = "Heidi übernimmt ab hier";
			STEPS.forEach((step, i) =>
				at(sl(450 + i * 520), () => {
					steps = i + 1;
					status = `${step.title} ${step.sub}`;
				}),
			);
			at(sl(450 + STEPS.length * 520 + 200), () => {
				phase = "done";
				status = DONE;
				busy = false;
				confetti();
			});
		});
	}

	$effect(() => () => {
		timers.forEach(clearTimeout);
		cancelAnimationFrame(frame);
		stopConfetti();
	});
</script>

<div
	class={["t-vis t2", phase !== "idle" && phase, phase === "done" && "signed"]}
	bind:this={vis}
	{@attach inView({
		threshold: 0.6,
		once: true,
		onEnter: () => at(700, play),
	})}
>
	<div class="sg">
		<div class="sg-card">
			<div class="sg-hd">
				<span class="sg-ic">
					<svg
						viewBox="0 0 20 20"
						fill="none"
						stroke="#1E322D"
						stroke-width="1.5"
						aria-hidden="true"
						><path d="M5 2.5h7l3.5 3.5v11.5H5z" stroke-linejoin="round" /><path
							d="M12 2.5V6h3.5M7.5 10h5M7.5 13h3.5"
						/></svg
					>
				</span>
				<span class="sg-tt"
					><b>Vollmacht</b><small>Messdienstwechsel · Lindenallee 8</small
					></span
				>
			</div>
			<div class="sg-lines" aria-hidden="true"><i></i><i></i></div>
			<button
				class="sg-field"
				type="button"
				aria-label="Vollmacht unterschreiben"
				bind:this={field}
				onclick={play}
			>
				<span class="sg-ph">
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"
						><path
							d="M2.5 13.5l1-3.3 7.4-7.4a1.3 1.3 0 0 1 1.9 0l.4.4a1.3 1.3 0 0 1 0 1.9l-7.4 7.4z"
							stroke="currentColor"
							stroke-width="1.4"
							stroke-linejoin="round"
						/></svg
					>Hier unterschreiben
				</span>
				<span class="sg-x" aria-hidden="true">×</span>
				<span class="sg-stamp" aria-hidden="true"
					><Check color="#fff" /><span>Unterschrieben</span></span
				>
				<svg class="sg-sig" viewBox="0 0 160 40" aria-hidden="true"
					><path
						bind:this={path}
						style:stroke-dasharray={length || null}
						style:stroke-dashoffset={length ? length * (1 - drawn) : null}
						d="M4 30 C 9 18 12 6 15 9 C 18 12 15 28 18 30 C 21 20 26 6 29 9 C 32 12 28 28 33 29 C 38 30 40 18 44 12 C 46 9 47 20 46 30 C 45 22 52 14 56 12 C 52 18 50 22 58 30 C 62 33 64 22 70 22 C 74 22 72 28 68 28 C 64 28 66 20 72 20 C 78 20 78 29 82 29 C 86 29 86 8 89 8 C 92 8 88 30 92 30 C 96 30 96 8 99 8 C 102 8 98 30 102 30 C 106 30 108 22 112 22 C 116 22 114 28 110 28 C 106 28 108 20 116 21 C 120 22 120 30 124 28 C 128 26 128 20 132 21 C 136 22 128 36 156 25"
					/></svg
				>
				<span
					class="sg-pen"
					aria-hidden="true"
					style:opacity={pen ? 1 : 0}
					style:transform={pen ? `translate(${pen.x}px,${pen.y}px)` : null}
				>
					<svg viewBox="0 0 24 24" fill="none"
						><path
							d="M3 21l1.6-5.2L16.3 4.1a2.1 2.1 0 0 1 3 0l.6.6a2.1 2.1 0 0 1 0 3L8.2 19.4z"
							fill="#fff"
							stroke="#1E322D"
							stroke-width="1.6"
							stroke-linejoin="round"
						/><path
							d="M14.5 6l3.5 3.5"
							stroke="#1E322D"
							stroke-width="1.6"
						/><path d="M3 21l1.6-5.2 3.6 3.6z" fill="#1E322D" /></svg
					>
				</span>
			</button>
			<div class="sg-cap">
				<span>Eigentümer oder Verwaltung</span><span class="sg-date"
					>{date}</span
				>
			</div>
		</div>
		<ul class="sg-steps">
			{#each STEPS as step, i (step.title)}
				<li class={[steps > i && "on"]}>
					<i><Check color="#fff" /></i><b>{step.title}</b><small
						>{step.sub}</small
					>
				</li>
			{/each}
		</ul>
		<div class="sg-st" aria-live="polite">{status}</div>
	</div>
	<canvas class="sg-cf" bind:this={canvas} aria-hidden="true"></canvas>
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
	.sg {
		width: 100%;
		padding: 0 7%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.sg-card {
		position: relative;
		width: 100%;
		background: #fff;
		border-radius: 14px;
		padding: 14px 14px 10px;
		box-shadow:
			0 1px 2px rgba(30, 50, 45, 0.06),
			0 18px 36px -22px rgba(30, 50, 45, 0.35);
		transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.signing .sg-card {
		transform: translateY(-2px);
	}
	.sg-hd {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.sg-ic {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: var(--stone);
		display: grid;
		place-items: center;
		flex: none;
	}
	.sg-ic svg {
		width: 16px;
		height: 16px;
	}
	.sg-tt {
		min-width: 0;
	}
	.sg-tt b {
		display: block;
		font-size: 14.5px;
		font-weight: 600;
		line-height: 1.2;
	}
	.sg-tt small {
		display: block;
		font-size: 11.5px;
		color: var(--muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.sg-stamp {
		position: absolute;
		right: 10px;
		top: -11px;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		font-weight: 600;
		color: #fff;
		background: #3e9a57;
		border-radius: 999px;
		padding: 4px 9px 4px 6px;
		opacity: 0;
		transform: scale(0.6);
		transition:
			opacity 0.3s,
			transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.sg-stamp :global(svg) {
		width: 10px;
	}
	.signed .sg-stamp {
		opacity: 1;
		transform: none;
	}
	.sg-lines {
		display: grid;
		gap: 6px;
		margin: 12px 0 10px;
	}
	.sg-lines i {
		display: block;
		height: 5px;
		border-radius: 3px;
		background: #eef0ee;
	}
	.sg-lines i:nth-child(2) {
		width: 62%;
	}
	.sg-field {
		position: relative;
		display: block;
		width: 100%;
		height: clamp(84px, 8vw, 104px);
		border: 1.5px dashed #cdd3d0;
		border-radius: 12px;
		background: #fafbfa;
		cursor: pointer;
		font-family: inherit;
		padding: 0;
		overflow: visible;
		transition:
			border-color 0.3s,
			background 0.3s;
	}
	.sg-field:hover {
		border-color: var(--accent-deep);
	}
	.signing .sg-field,
	.signed .sg-field {
		border-style: solid;
		border-color: #e3e7e5;
		background: #fff;
		cursor: default;
	}
	.done .sg-field {
		cursor: pointer;
	}
	.sg-field::after {
		content: "";
		position: absolute;
		left: 30px;
		right: 16px;
		bottom: 24%;
		border-top: 1px solid #c9cfcc;
	}
	.sg-x {
		position: absolute;
		left: 12px;
		bottom: calc(24% - 2px);
		font-size: 15px;
		color: #9aa5a1;
		line-height: 1;
	}
	.sg-ph {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		font-size: 13.5px;
		font-weight: 500;
		color: var(--ink);
		transition: opacity 0.3s;
	}
	.sg-ph svg {
		width: 15px;
		height: 15px;
	}
	.sg-ph::before {
		content: "";
		position: absolute;
		width: 150px;
		height: 34px;
		border-radius: 999px;
		border: 2px solid var(--accent);
		opacity: 0;
		animation: sg-ring 2.2s ease-out infinite;
	}
	@keyframes sg-ring {
		0% {
			transform: scale(0.85);
			opacity: 0.8;
		}
		100% {
			transform: scale(1.25);
			opacity: 0;
		}
	}
	.signing .sg-ph,
	.signed .sg-ph {
		opacity: 0;
	}
	.sg-sig {
		position: absolute;
		left: 8%;
		right: 8%;
		top: 8%;
		bottom: 20%;
		width: 84%;
		height: 72%;
		overflow: visible;
	}
	/* Unsigned: only the placeholder (also without JS) */
	.t2:not(.signing, .signed) .sg-sig {
		visibility: hidden;
	}
	.sg-sig path {
		fill: none;
		stroke: #2b4a8c;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.sg-pen {
		position: absolute;
		left: 0;
		top: 0;
		width: 26px;
		height: 26px;
		pointer-events: none;
		transition: opacity 0.25s;
		filter: drop-shadow(0 3px 4px rgba(30, 50, 45, 0.25));
		z-index: 3;
	}
	.sg-pen svg {
		width: 26px;
		height: 26px;
		display: block;
	}
	.sg-cap {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		margin-top: 8px;
		font-size: 11px;
		color: var(--faint);
		font-variant-numeric: tabular-nums;
	}
	.sg-date {
		opacity: 0;
		transition: opacity 0.4s;
	}
	.signed .sg-date {
		opacity: 1;
	}
	.sg-steps {
		list-style: none;
		margin: 16px 0 0;
		padding: 0;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 6px;
	}
	.sg-steps li {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 3px;
		opacity: 0.5;
		transition: opacity 0.35s;
	}
	.sg-steps li i {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #fff;
		box-shadow: inset 0 0 0 1.5px #d3d8d5;
		display: grid;
		place-items: center;
		margin-bottom: 3px;
		transition:
			background 0.3s,
			box-shadow 0.3s;
	}
	.sg-steps li i :global(svg) {
		width: 10px;
		opacity: 0;
		transform: scale(0.4);
		transition:
			opacity 0.25s,
			transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.sg-steps li b {
		font-size: 12px;
		font-weight: 600;
		line-height: 1.15;
	}
	.sg-steps li small {
		font-size: 10.5px;
		color: var(--muted);
		line-height: 1.2;
	}
	.sg-steps li.on {
		opacity: 1;
	}
	.sg-steps li.on i {
		background: #3e9a57;
		box-shadow: none;
	}
	.sg-steps li.on i :global(svg) {
		opacity: 1;
		transform: none;
	}
	.sg-st {
		margin-top: 12px;
		font-size: 12.5px;
		font-weight: 500;
		color: var(--muted);
		min-height: 1.3em;
		transition: color 0.3s;
	}
	.done .sg-st {
		color: #2f7a3c;
	}
	.sg-cf {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 6;
	}

	@media (max-width: 980px) {
		.t-vis {
			aspect-ratio: auto;
			height: 400px;
		}
		.sg {
			padding: 0 9%;
			max-width: 460px;
		}
	}
	@media (max-width: 560px) {
		.t-vis {
			height: 360px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sg-ph::before {
			display: none;
		}
	}
</style>
