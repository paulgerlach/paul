<!--
  Trio demo 2: the old way vs. the Heidi way. "Eine Unterschrift" steps
  through what Heidi does and ends at "Heidi übernimmt alles"; clicking
  again resets it. Reduced motion: straight to the end.
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";

	const STEPS = [
		"Kündigung per Vollmacht",
		"Montage geplant",
		"Mieter informiert",
		"Abrechnung eingerichtet",
	];
	const READY = "Bereit für den Wechsel";
	const DONE = "Heidi übernimmt alles";

	let status = $state<"idle" | "run" | "done">("idle");
	let text = $state(READY);
	/** A step text shows the small check; set after the first change, so only changes animate. */
	let stepped = $state(false);
	let changed = $state(false);

	let timers: ReturnType<typeof setTimeout>[] = [];
	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

	function show(next: string, step: boolean) {
		text = next;
		stepped = step;
		changed = true;
	}

	function onclick() {
		if (status === "run") return;
		if (status === "done") {
			status = "idle";
			show(READY, false);
			return;
		}
		if (prefersReducedMotion()) {
			status = "done";
			show(DONE, false);
			return;
		}
		status = "run";
		STEPS.forEach((step, i) => at(i * 520, () => show(step, true)));
		at(STEPS.length * 520 + 150, () => {
			status = "done";
			show(DONE, false);
		});
	}

	$effect(() => () => timers.forEach(clearTimeout));
</script>

<div class={["t-vis t2", status !== "idle" && status]}>
	<div class="t-ways">
		<h4>Der alte Weg</h4>
		<div class="t-track" aria-hidden="true">
			<i>
				<svg
					viewBox="0 0 12 12"
					fill="none"
					stroke="#1E322D"
					stroke-width="1.3"
				>
					<path d="M2 1.5h6l2 2v7H2z" /><path d="M4 6h4M4 8h3" />
				</svg>
			</i>
			<i>
				<svg
					viewBox="0 0 10 12"
					fill="none"
					stroke="#1E322D"
					stroke-width="1.3"
				>
					<path
						d="M1 1h8M1 11h8M2 1c0 3 6 3 6 5s-6 2-6 5M8 1c0 3-6 3-6 5s6 2 6 5"
					/>
				</svg>
			</i>
			<i class="ok"><Check color="#fff" /></i>
		</div>
		<div class="t-pill old">
			<span class="t-dot l">Kündigung</span>Fristen, Termine und Aushänge
			koordinieren<span class="t-dot r">Wechsel<br />erledigt</span>
		</div>
		<div class="t-gap"></div>
		<h4>Der Heidi-Weg</h4>
		<div class="t-track end" aria-hidden="true">
			<i class="hd">
				<span class="t2-pen">
					<svg viewBox="0 0 12 12" fill="none">
						<path
							d="M2 10l1-3 5-5 2 2-5 5z"
							stroke="#8AD68F"
							stroke-width="1.4"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
				<span class="t2-okc"><Check color="#fff" /></span>
			</i>
		</div>
		<div class="t-pill new">
			<span class="t2-fill"></span>
			{#key text}
				<span class={["t2-txt", changed && "in"]}
					>{#if stepped}<i class="t2-ck"></i>{/if}{text}</span
				>
			{/key}
			<p class="sr-only" aria-live="polite">
				{#if status === "done"}{DONE}{/if}
			</p>
			<button class="t-dot r t2-sign" type="button" {onclick}>
				<span class="t2-a">Eine Unter&shy;schrift</span>
				<span class="t2-b"><Check color="#fff" /></span>
			</button>
		</div>
	</div>
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
	.t-ways {
		width: 100%;
		padding: 0 6%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	h4 {
		margin: 0;
		font-size: clamp(15px, 1.45vw, 19px);
		font-weight: 500;
		letter-spacing: -0.01em;
	}
	h4 + .t-track {
		margin-top: 10px;
	}
	.t-track {
		position: relative;
		width: 78%;
		height: 18px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.t-track.end {
		justify-content: flex-end;
	}
	.t-track::before {
		content: "";
		position: absolute;
		left: 24px;
		right: 24px;
		top: 50%;
		border-top: 1px solid #d9ddda;
	}
	.t-track i {
		position: relative;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--stone);
		display: grid;
		place-items: center;
		font-style: normal;
	}
	.t-track i :global(svg) {
		width: 11px;
	}
	.t-track i.ok {
		background: #3e9a57;
	}
	.t-track i.hd {
		background: var(--ink);
	}
	.t-track i.ok :global(svg),
	.t2-okc :global(svg) {
		width: 9px;
	}
	.t-pill {
		position: relative;
		width: 100%;
		margin-top: 12px;
		height: clamp(52px, 5vw, 64px);
		border-radius: 999px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: clamp(12px, 1.1vw, 14.5px);
		text-align: center;
		line-height: 1.25;
		padding: 0 clamp(58px, 6vw, 72px);
		background: #fff;
		box-shadow: 0 0 0 4px #ebecea;
	}
	.t-pill.new {
		overflow: visible;
	}
	.t-dot {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: clamp(50px, 4.6vw, 60px);
		height: clamp(50px, 4.6vw, 60px);
		padding: 4px;
		box-sizing: border-box;
		hyphens: manual;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: clamp(8.5px, 0.75vw, 10px);
		line-height: 1.15;
		text-align: center;
		font-weight: 500;
	}
	.t-dot.l {
		left: 4px;
		background: #f1f2f0;
		color: var(--muted);
		border: 1px solid #e1e3e0;
	}
	.t-dot.r {
		right: 4px;
	}
	.old .t-dot.r {
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.t-gap {
		height: clamp(16px, 2vw, 26px);
	}
	.t2-fill {
		position: absolute;
		inset: 0;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			rgba(138, 214, 143, 0.15) 0%,
			rgba(138, 214, 143, 0.45) 45%,
			#b9e6bc 100%
		);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 2.2s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.run .t2-fill,
	.done .t2-fill {
		transform: scaleX(1);
	}
	.t2-txt {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--muted);
		font-weight: 400;
	}
	.run .t2-txt,
	.done .t2-txt {
		color: var(--ink);
		font-weight: 500;
	}
	.t2-txt.in {
		animation: k-in 0.3s both;
	}
	@keyframes k-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.t2-ck {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #3e9a57
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10'%3E%3Cpath d='M1 5l3.5 3.5L11 1' stroke='%23fff' stroke-width='2' fill='none'/%3E%3C/svg%3E")
			center/8px no-repeat;
		flex: none;
	}
	.t2-sign {
		border: 0;
		font-family: inherit;
		cursor: pointer;
		background: var(--ink);
		color: #fff;
		box-shadow: 0 0 0 4px rgba(30, 50, 45, 0.12);
		transition:
			transform 0.2s,
			background 0.3s;
	}
	.t2-sign:hover {
		transform: translateY(-50%) scale(1.06);
	}
	.t2-sign::after {
		content: "";
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		border: 2px solid var(--accent);
		animation: t-ring 1.8s ease-out infinite;
	}
	.run .t2-sign::after,
	.done .t2-sign::after {
		display: none;
	}
	@keyframes t-ring {
		0% {
			transform: scale(0.9);
			opacity: 0.9;
		}
		100% {
			transform: scale(1.35);
			opacity: 0;
		}
	}
	.t2-b,
	.done .t2-a {
		display: none;
	}
	.done .t2-b {
		display: grid;
		place-items: center;
		animation: hp-pop 0.45s both;
	}
	.t2-b :global(svg) {
		width: 16px;
	}
	.done .t2-sign {
		background: #3e9a57;
	}
	.t2-okc,
	.done .t2-pen {
		display: none;
	}
	.done .t2-okc {
		display: grid;
		place-items: center;
	}
	.done .t-track i.hd {
		background: #3e9a57;
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
		.t-ways {
			padding: 0 4%;
		}
	}
</style>
