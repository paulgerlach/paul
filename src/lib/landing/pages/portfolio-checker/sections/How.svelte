<!--
  "Prüfen, analysieren, extrahieren." (.pg-sec, .pc-how): the three steps
  with their demo chips. With motion, while the cards are in view, the
  design's 10.5 s loop (`#pc-how-js`) lights one card after the other, shows
  its chips, merges the contract and its Nachtrag, types "30.09." and counts
  to 72. The server, reduced motion and every stop show the end state: all
  chips, the final figures, no card lit.
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Head from "../components/Head.svelte";
	import Icon from "../components/Icon.svelte";
	import { how } from "../content";

	/** Each chip's index across the three steps. */
	const offsets = how.steps.map((_, s) =>
		how.steps.slice(0, s).reduce((n, step) => n + step.chips.length, 0),
	);
	const total = how.steps.reduce((n, step) => n + step.chips.length, 0);
	const kv = how.steps[2].chips.flatMap((c) => (c.kind === "kv" ? [c] : []));
	const DATE = kv[0].value;
	const DEVICES = Number(kv[1].value);
	const BLANK = "--.--.";

	/** Chips hide until shown (set when the loop first runs). */
	let anim = $state(false);
	let lit = $state(-1);
	let shown = $state<boolean[]>(Array(total).fill(true));
	let merged = $state(false);
	let date = $state(DATE);
	let devices = $state(DEVICES);

	function endState() {
		lit = -1;
		shown = Array(total).fill(true);
		merged = false;
		date = DATE;
		devices = DEVICES;
	}

	function pass() {
		anim = true;
		const timers: ReturnType<typeof setTimeout>[] = [];
		let frame = 0;
		const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
		const show = (i: number) => (shown[i] = true);
		lit = -1;
		shown = Array(total).fill(false);
		merged = false;
		date = BLANK;
		devices = 0;

		at(200, () => (lit = 0));
		for (let i = 0; i < how.steps[0].chips.length; i++)
			at(500 + i * 550, () => show(offsets[0] + i));
		at(2600, () => (lit = 1));
		at(2900, () => show(offsets[1]));
		at(3500, () => show(offsets[1] + 1));
		at(4200, () => (merged = true));
		at(4700, () => show(offsets[1] + 2));
		at(5600, () => (lit = 2));
		at(5900, () => {
			show(offsets[2]);
			let n = 0;
			const type = () => {
				n++;
				date = DATE.slice(0, n) + BLANK.slice(n);
				if (n < DATE.length) timers.push(setTimeout(type, 110));
			};
			type();
		});
		at(6600, () => {
			show(offsets[2] + 1);
			const t0 = performance.now();
			const count = (t: number) => {
				const p = Math.min(1, (t - t0) / 900);
				devices = Math.round(DEVICES * (1 - (1 - p) ** 3));
				if (p < 1) frame = requestAnimationFrame(count);
			};
			frame = requestAnimationFrame(count);
		});
		at(8200, () => (lit = -1));
		return () => {
			for (const t of timers) clearTimeout(t);
			cancelAnimationFrame(frame);
			endState();
		};
	}

	const loop = loopInView({ run: pass, every: 10500, threshold: 0.35 });
</script>

<section class="pg-sec" aria-labelledby="how-h">
	<div class="wrap">
		<Head id="how-h" pill={how.pill} symbol="list" heading={how.heading} />
		<ol class={["how", anim && "anim"]} {@attach loop}>
			{#each how.steps as step, s (step.title)}
				<li class={["rv", lit === s && "act"]}>
					<span class="hn">{s + 1}</span>
					<div class="hv">
						{#each step.chips as chip, c (c)}
							{@const i = offsets[s] + c}
							{#if chip.kind === "kv"}
								<span class={["kv", shown[i] && "in"]}
									><small>{chip.label}</small><b>{c === 0 ? date : devices}</b
									></span
								>
							{:else}
								<span
									class={[
										chip.kind,
										shown[i] && "in",
										merged && s === 1 && c < 2 && "merge",
									]}
									>{#if chip.kind === "ok"}<Check
										/>{:else if chip.kind === "wn"}<Icon
											name="warning"
										/>{/if}{chip.text}</span
								>
							{/if}
						{/each}
					</div>
					<h3>{step.title}</h3>
					<p>{step.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.how {
		list-style: none;
		margin: 44px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}
	li {
		position: relative;
		background: #f2f4f3;
		border-radius: 20px;
		padding: 24px;
		transition:
			box-shadow 0.5s,
			background 0.5s;
	}
	li.act {
		background: #fff;
		box-shadow:
			0 0 0 2px #cbe7ce,
			0 20px 40px -30px rgba(30, 50, 45, 0.4);
	}
	.hn {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		font-size: 13px;
		font-weight: 700;
		transition:
			transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1),
			background 0.4s;
	}
	li.act .hn {
		transform: scale(1.12);
	}
	.hv {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 20px 0 4px;
		min-height: 64px;
		align-content: flex-start;
	}
	.hv span {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		background: #fff;
		border-radius: 999px;
		padding: 6px 11px;
		font-size: 12.5px;
		font-weight: 600;
	}
	.hv span :global(svg) {
		width: 12px;
		height: 12px;
	}
	.hv .wn {
		color: #9a5b12;
	}
	.hv .add {
		color: #2f7a3c;
	}
	.hv .kv {
		flex-direction: column;
		align-items: flex-start;
		border-radius: 12px;
		padding: 8px 12px;
	}
	.kv small {
		font-size: 11px;
		color: var(--muted);
		font-weight: 500;
	}
	.kv b {
		font-size: 18px;
		/* The browser's bold (preflight's "bolder" would give 900 here). */
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	/* `li h3`: beats the landing reset of heading margins. */
	li h3 {
		font-size: 19px;
		font-weight: 600;
		margin-top: 10px;
	}
	p {
		color: var(--muted);
		font-size: 15px;
		line-height: 1.5;
		margin-top: 6px;
	}
	/* The loop's states */
	.anim .hv span {
		opacity: 0;
		transform: translateY(6px) scale(0.92);
		transition:
			opacity 0.4s,
			transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	.anim .hv span.in {
		opacity: 1;
		transform: none;
	}
	li.act .hv span {
		background: #f2f4f3;
	}
	.anim .hv .wn.in {
		animation: pcShake 0.5s 0.2s;
	}
	@keyframes pcShake {
		0%,
		100% {
			transform: none;
		}
		25% {
			transform: translateX(-3px);
		}
		75% {
			transform: translateX(3px);
		}
	}
	.anim .hv .add.in {
		animation: pcSlide 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	@keyframes pcSlide {
		0% {
			opacity: 0;
			transform: translateX(24px);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}
	.hv .merge {
		animation: pcMerge 0.6s ease;
	}
	@keyframes pcMerge {
		50% {
			box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.6);
		}
	}
	@media (max-width: 980px) {
		.how {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
