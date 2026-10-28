<!--
  The three cards over the hero photo. Every 8 s they replay their entrance,
  and the third shows the existing meters being taken over (2.6 s). The loop
  runs only while the stack is on screen and not with reduced motion; the
  server renders the end state. Decorative: the copy next to it says the same.
-->
<script lang="ts">
	import { inView } from "$lib/landing/attachments/inView";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import Pin from "$lib/landing/components/icons/Pin.svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import type { RegionContent } from "./types";

	let { example, units }: { example: RegionContent["example"]; units: number } =
		$props();

	let playing = $state(false);
	/** Bumped per cycle, so the {#key} block restarts the entrance animations. */
	let cycle = $state(0);
	let loading = $state(false);

	let timers: ReturnType<typeof setTimeout>[] = [];
	const clear = () => {
		timers.forEach(clearTimeout);
		timers = [];
	};

	function run() {
		clear();
		playing = true;
		cycle++;
		loading = true;
		timers.push(setTimeout(() => (loading = false), 2600));
		timers.push(setTimeout(run, 8000));
	}

	function start() {
		if (!prefersReducedMotion()) run();
	}

	function stop() {
		clear();
		loading = false;
	}

	$effect(() => clear);
</script>

<div
	class="hp-wrap"
	aria-hidden="true"
	{@attach inView({ threshold: 0.2, onEnter: start, onLeave: stop })}
>
	{#key cycle}
		<div class={["hp-stack", playing && "play"]}>
			<div class="hp-card">
				<span class="hp-ic"><Pin /></span>
				<div>
					<div class="t">{example.address}</div>
					<div class="s">{example.area}</div>
				</div>
				<span class="r">{units} WE</span>
			</div>
			<div class="hp-card">
				<span class="hp-ic">
					<svg viewBox="0 0 20 16" fill="none">
						<rect
							x="1"
							y="1"
							width="18"
							height="14"
							rx="2"
							stroke="#1E322D"
							stroke-width="1.6"
						/>
						<path d="M1 6h18" stroke="#1E322D" stroke-width="1.6" />
					</svg>
				</span>
				<div>
					<div class="t">Altvertrag läuft bis 2029</div>
					<div class="s">Kein Warten nötig</div>
				</div>
				<span class="hp-badge">Sofort starten</span>
			</div>
			<div class={["hp-card ok c3", loading ? "loading" : playing && "done"]}>
				<span class="hp-ic">
					<span class="hp-spin"></span>
					<span class="hp-ok"><Check /></span>
				</span>
				<div>
					{#if loading}
						<div class="t">Bestandszähler werden übernommen …</div>
						<div class="s">Ablesewerte werden importiert</div>
					{:else}
						<div class="t">Bestandszähler übernommen</div>
						<div class="s">Abrechnung läuft ab sofort über Heidi</div>
					{/if}
				</div>
			</div>
		</div>
	{/key}
</div>

<style>
	.hp-wrap {
		position: absolute;
		left: 20px;
		right: 20px;
		bottom: 20px;
	}
	.hp-stack {
		display: grid;
		gap: 10px;
		max-width: 380px;
	}
	.hp-card {
		background: rgba(255, 255, 255, 0.96);
		backdrop-filter: blur(6px);
		border-radius: 14px;
		padding: 12px 14px;
		display: flex;
		align-items: center;
		gap: 12px;
		box-shadow: 0 10px 30px rgba(20, 30, 28, 0.18);
		font-size: 14px;
	}
	.t {
		font-weight: 600;
		font-size: 15px;
	}
	.s {
		color: var(--muted);
		font-size: 13px;
	}
	.r {
		margin-left: auto;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}
	.hp-ic {
		position: relative;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: #eef1ef;
		display: grid;
		place-items: center;
		flex: none;
	}
	.hp-ic :global(svg) {
		width: 18px;
	}
	.hp-card.ok {
		color: #24452f;
		transition:
			background 0.4s,
			color 0.4s;
	}
	.hp-card.ok .hp-ic {
		background: var(--accent);
		transition: background 0.4s;
	}
	.hp-badge {
		margin-left: auto;
		background: #e6f5e7;
		color: #2f7a3c;
		font-size: 11.5px;
		font-weight: 600;
		border-radius: 999px;
		padding: 3px 9px;
		white-space: nowrap;
	}
	.hp-spin {
		position: absolute;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2.5px solid rgba(30, 50, 45, 0.2);
		border-top-color: var(--ink);
		opacity: 0;
	}
	.hp-ok {
		display: grid;
		place-items: center;
	}
	.hp-ok :global(svg) {
		width: 14px;
	}
	@keyframes hp-in {
		0% {
			opacity: 0;
			transform: translateY(18px) scale(0.97);
		}
		100% {
			opacity: 1;
			transform: none;
		}
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
	.play .hp-card {
		animation: hp-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.play .hp-card:nth-child(2) {
		animation-delay: 0.5s;
	}
	.play .hp-card:nth-child(3) {
		animation-delay: 1s;
	}
	.play .hp-badge {
		animation: hp-pop 0.45s 1.1s both;
	}
	.c3.loading {
		color: var(--ink);
	}
	.c3.loading .hp-ic {
		background: #eef1ef;
	}
	.c3.loading .hp-spin {
		opacity: 1;
		animation: spin 0.8s linear infinite;
	}
	.c3.loading .hp-ok {
		opacity: 0;
	}
	.c3.done .hp-ok {
		animation: hp-pop 0.45s both;
	}

	@media (max-width: 560px) {
		.hp-wrap {
			left: 12px;
			right: 12px;
			bottom: 12px;
		}
	}
</style>
