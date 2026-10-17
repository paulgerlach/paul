<!--
  The hero's "Heizkostenabrechnung 2025" card: meter values arrive, the three
  checks tick, then "Abrechnung erstellen" turns the checklist into six
  Einzelabrechnungen. Without a click it runs by itself once, quietly; a click
  adds confetti. The server renders the start ("Daten kommen", 0/18), because
  the card is always in view on load; with reduced motion it's ready at once
  and a click goes straight to the result (plan 03 §3.1).
-->
<script lang="ts">
	import { onMount } from "svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { burst } from "$lib/landing/confetti";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { formatDecimal } from "$lib/landing/pages/upgrade-now/calculator";
	import Icon from "../components/Icon.svelte";
	import { demo } from "../content";

	type Phase = "idle" | "loading" | "ready" | "making" | "done";
	type Step = "off" | "on" | "ok";

	const total = demo.building.meters;
	const n = demo.results.length;

	let phase = $state<Phase>("idle");
	let count = $state(0);
	let steps = $state<Step[]>(["off", "off", "off"]);
	/** The result list is shown (the checklist slides away). */
	let showResults = $state(false);
	let rowsIn = $state(0);
	let toast = $state(false);
	let pressed = $state(false);

	let wrap = $state<HTMLElement>();
	let canvas = $state<HTMLCanvasElement>();
	let toastEl = $state<HTMLElement>();
	let timers: ReturnType<typeof setTimeout>[] = [];
	let stopConfetti = () => {};
	let reduced = false;
	/** A run is in progress; clicks wait for it (not state, nothing renders it). */
	let busy = false;

	function after(ms: number, fn: () => void) {
		timers.push(setTimeout(fn, ms));
	}
	function clearTimers() {
		for (const t of timers) clearTimeout(t);
		timers = [];
	}

	function ready() {
		count = total;
		steps = ["ok", "ok", "ok"];
		phase = "ready";
		// Nobody clicked: show the result once, without confetti.
		if (!reduced) after(2600, () => make(true));
	}

	function load() {
		phase = "loading";
		steps = ["on", "off", "off"];
		const tick = () => {
			count++;
			if (count < total) return after(60 + Math.random() * 60, tick);
			steps = ["ok", "off", "off"];
			after(550, () => {
				steps = ["ok", "ok", "off"];
				after(550, () => {
					steps = ["ok", "ok", "ok"];
					after(500, ready);
				});
			});
		};
		tick();
	}

	function confetti() {
		if (!wrap || !canvas || !toastEl) return;
		// The canvas reaches 80 px past the card on every side.
		const r = wrap.getBoundingClientRect();
		const t = toastEl.getBoundingClientRect();
		stopConfetti();
		stopConfetti = burst(
			canvas,
			{ width: r.width + 160, height: r.height + 160 },
			{
				x: t.left - r.left + t.width / 2 + 80,
				y: t.top - r.top + t.height / 2 + 80,
				width: t.width,
			},
			{ count: 120, speed: [2.6, 4.2], size: { w: [5, 5], h: [7, 7] } },
		);
	}

	function make(quiet = false) {
		if (busy || phase !== "ready") return;
		busy = true;
		clearTimers();
		phase = "making";
		if (reduced) {
			showResults = true;
			rowsIn = n;
			phase = "done";
			busy = false;
			return;
		}
		pressed = true;
		after(160, () => (pressed = false));
		after(700, () => {
			showResults = true;
			for (let i = 0; i < n; i++) after(120 * i + 200, () => (rowsIn = i + 1));
			after(120 * n + 500, () => {
				phase = "done";
				toast = true;
				if (!quiet) confetti();
				after(3800, () => {
					toast = false;
					busy = false;
				});
			});
		});
	}

	function onclick() {
		if (busy) return;
		if (phase === "done") {
			// "Erneut ansehen": back to the checklist, then run again.
			showResults = false;
			rowsIn = 0;
			phase = "ready";
			clearTimers();
			if (reduced) return make();
			after(350, () => make());
			return;
		}
		make();
	}

	onMount(() => {
		reduced = prefersReducedMotion();
		if (reduced) ready();
		return () => {
			clearTimers();
			stopConfetti();
		};
	});

	const status = $derived(
		phase === "done"
			? { cls: "done", text: demo.status.done }
			: phase === "ready" || phase === "making"
				? { cls: "ready", text: demo.status.ready }
				: { cls: "", text: demo.status.idle },
	);
	const buttonText = $derived(
		phase === "making"
			? demo.button.making
			: phase === "done"
				? demo.button.done
				: demo.button.idle,
	);
	const hint = $derived(
		phase === "done"
			? demo.hint.done(n)
			: phase === "ready" || phase === "making"
				? demo.hint.ready
				: demo.hint.idle,
	);
	const checks = [demo.checks.meters, demo.checks.costs, demo.checks.key];
	const amount = (a: number) =>
		`${a < 0 ? "−" : "+"}${formatDecimal(Math.abs(a))}\u00a0€`;
</script>

<div
	class="kd-wrap rv"
	bind:this={wrap}
	{@attach inView({
		threshold: 0.15,
		once: true,
		onEnter: () => {
			if (!reduced && phase === "idle") after(400, load);
		},
	})}
>
	<div
		class={["kd", showResults && "res"]}
		role="group"
		aria-label={demo.label}
	>
		<div class="kd-h">
			<span class="fi"><Icon name="file" /></span>
			<span class="ttl"><b>{demo.title}</b><small>{demo.subline}</small></span>
			<span class={["st", status.cls]} role="status"
				><i></i><em>{status.text}</em></span
			>
		</div>
		<div class="stage">
			<ol class="ck" aria-hidden={showResults}>
				{#each checks as check, i (check.title)}
					<li class={[steps[i] !== "off" && "on", steps[i] === "ok" && "ok"]}>
						<span class="b"><Check /></span>
						<span><b>{check.title}</b><small>{check.sub}</small></span>
						<em class="n"
							>{#if i === 0}<i>{count}</i>/{total}{:else}{"value" in check
									? check.value
									: ""}{/if}</em
						>
					</li>
				{/each}
			</ol>
			{#if showResults}
				<ul class="out">
					{#each demo.results as r, i (r.flat)}
						<li class={[i < rowsIn && "in"]}>
							<span class="we">{r.flat}</span>
							<span class="lb"
								>{r.area} · {r.amount < 0 ? demo.credit : demo.due}</span
							>
							<span class={["am", r.amount < 0 && "neg"]}
								>{amount(r.amount)}</span
							>
							<span class="pdf">PDF</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		<div class="kd-f">
			<button
				type="button"
				class={["go", phase === "ready" && "pulse", pressed && "press"]}
				disabled={phase === "idle" || phase === "loading"}
				{onclick}
			>
				<Icon name="sparkle" /><span>{buttonText}</span>
			</button>
			<span class="hint">{hint}</span>
		</div>
		<div class={["toast", toast && "show"]} role="status" bind:this={toastEl}>
			{#if phase === "done"}
				<span class="okb"><Check /></span>
				<span><b>{demo.toast.title(n)}</b><small>{demo.toast.text}</small></span
				>
			{/if}
		</div>
	</div>
	<canvas class="confetti" bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
	.kd-wrap {
		position: relative;
	}
	.confetti {
		position: absolute;
		left: -80px;
		top: -80px;
		width: calc(100% + 160px);
		height: calc(100% + 160px);
		pointer-events: none;
		z-index: 5;
	}
	.kd {
		position: relative;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.35);
		overflow: hidden;
	}
	.kd-h {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 18px 20px;
		border-bottom: 1px solid var(--hair);
	}
	.fi {
		width: 38px;
		height: 38px;
		border-radius: 11px;
		background: var(--bg);
		border: 1px solid var(--hair);
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.fi :global(svg) {
		width: 19px;
		height: 19px;
	}
	.ttl {
		min-width: 0;
		flex: 1;
	}
	.kd-h b {
		display: block;
		font-size: 15.5px;
		font-weight: 600;
	}
	.kd-h small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		margin-top: 1px;
	}
	.st {
		margin-left: auto;
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--muted);
		background: #f1f3f2;
		border-radius: 999px;
		padding: 4px 10px;
		white-space: nowrap;
	}
	.st em {
		font-style: normal;
	}
	.st i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #b9c3be;
		animation: blink 1.2s ease-in-out infinite;
	}
	.st.ready {
		color: var(--ok);
		background: #e6f5e7;
	}
	.st.ready i {
		background: var(--ok);
	}
	.st.done {
		color: var(--ink);
		background: #e6f5e7;
	}
	.st.done i {
		background: var(--accent-deep);
		animation: none;
	}
	@keyframes blink {
		50% {
			opacity: 0.25;
		}
	}
	.stage {
		position: relative;
		min-height: 300px;
	}
	.ck,
	.out {
		list-style: none;
		margin: 0;
		padding: 8px 20px;
		position: absolute;
		inset: 0;
		transition:
			opacity 0.45s,
			transform 0.45s;
	}
	.ck li {
		display: flex;
		align-items: center;
		gap: 13px;
		padding: 17px 0;
		border-bottom: 1px solid #eff2f0;
		opacity: 0.45;
		transition: opacity 0.4s;
	}
	.ck li:last-child {
		border-bottom: 0;
	}
	.ck li.on {
		opacity: 1;
	}
	.b {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		border: 1.5px solid #d5dcd8;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
		transition:
			background 0.3s,
			border-color 0.3s;
	}
	.b :global(svg) {
		width: 14px;
		height: 14px;
		opacity: 0;
		transform: scale(0.6);
		transition:
			opacity 0.3s,
			transform 0.3s;
	}
	.ck li.ok .b {
		background: var(--accent);
		border-color: var(--accent);
	}
	.ck li.ok .b :global(svg) {
		opacity: 1;
		transform: none;
	}
	.ck b {
		display: block;
		font-size: 14.5px;
		font-weight: 600;
	}
	.ck small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		margin-top: 2px;
	}
	.n {
		margin-left: auto;
		font-style: normal;
		font-size: 13.5px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
		white-space: nowrap;
	}
	.n i {
		font-style: normal;
	}
	.res .ck {
		opacity: 0;
		transform: translateY(-14px);
		pointer-events: none;
	}
	.out {
		animation: out-in 0.45s both;
	}
	@keyframes out-in {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}
	.out li {
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		gap: 12px;
		align-items: center;
		padding: 9px 0;
		border-bottom: 1px solid #eff2f0;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.35s,
			transform 0.35s;
	}
	.out li.in {
		opacity: 1;
		transform: none;
	}
	.out li:last-child {
		border-bottom: 0;
	}
	.we {
		font-weight: 600;
	}
	.lb {
		color: var(--muted);
		font-size: 12.5px;
	}
	.am {
		font-weight: 600;
		text-align: right;
	}
	.am.neg {
		color: var(--ok);
	}
	.pdf {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--ink);
		background: #eef8ef;
		border: 1px solid #cfebd1;
		border-radius: 6px;
		padding: 3px 7px;
	}
	.kd-f {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 20px 20px;
		border-top: 1px solid var(--hair);
		background: #fafbfa;
		flex-wrap: wrap;
	}
	/* The design's .bk-next, as a button */
	.go {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border: 0;
		background: var(--ink);
		color: #fff;
		font: inherit;
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 18px;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.15s,
			opacity 0.2s;
	}
	.go:hover:not(:disabled) {
		background: #2a443d;
	}
	.go:active:not(:disabled),
	.go.press {
		transform: scale(0.96);
	}
	.go:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.go :global(svg) {
		width: 17px;
		height: 17px;
	}
	.go.pulse {
		animation: pulse 1.8s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(138, 214, 143, 0.55);
		}
		50% {
			box-shadow: 0 0 0 9px rgba(138, 214, 143, 0);
		}
	}
	.hint {
		font-size: 12.5px;
		color: var(--muted);
	}
	.toast {
		position: absolute;
		left: 20px;
		right: 20px;
		bottom: 20px;
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--ink);
		color: #fff;
		border-radius: 14px;
		padding: 14px 16px;
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 0.35s,
			transform 0.35s;
		pointer-events: none;
		z-index: 4;
	}
	.toast.show {
		opacity: 1;
		transform: none;
	}
	.okb {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.okb :global(svg) {
		width: 10px;
	}
	.toast b {
		display: block;
		font-size: 14.5px;
	}
	.toast small {
		display: block;
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.7);
	}

	@media (max-width: 640px) {
		.stage {
			min-height: 276px;
		}
		.kd-h {
			padding: 16px;
		}
		.st {
			font-size: 11.5px;
			padding: 3px 8px;
		}
		.ck small,
		.lb {
			display: none;
		}
		.out li {
			grid-template-columns: auto 1fr auto;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.go.pulse,
		.st i,
		.out {
			animation: none;
		}
		.ck,
		.out,
		.out li,
		.ck li,
		.b,
		.b :global(svg),
		.toast {
			transition: none;
		}
	}
</style>
