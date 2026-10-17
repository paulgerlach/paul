<!--
  Hero visual: one property going through the switch check. Every 6 s it shows
  "Heidi prüft den Vertrag" for 2.2 s, then "Wechsel freigegeben" again. It's
  decoration (aria-hidden); the text alternative is in the sr-only paragraph.
-->
<script lang="ts">
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Check from "$lib/landing/components/icons/Check.svelte";

	let visible = $state(false);
	let reviewing = $state(false);

	// Runs only while the card is on screen, so a background tab or a visitor
	// further down the page doesn't keep timers going.
	$effect(() => {
		if (!visible || prefersReducedMotion()) return;
		let back: ReturnType<typeof setTimeout>;
		const loop = setInterval(() => {
			reviewing = true;
			back = setTimeout(() => (reviewing = false), 2200);
		}, 6000);
		return () => {
			clearInterval(loop);
			clearTimeout(back);
			reviewing = false;
		};
	});

	const checks = [
		"Bestandszähler übernommen",
		"Eichfristen erfasst",
		"HKVO-konform",
	];
</script>

<div
	class="hero-visual"
	{@attach inView({
		onEnter: () => (visible = true),
		onLeave: () => (visible = false),
	})}
>
	<p class="sr-only">
		Beispiel einer Wechselprüfung: Lindenallee 8, Mehrfamilienhaus mit 36
		Wohneinheiten. Wechsel freigegeben, Bestandszähler übernommen, Eichfristen
		erfasst, HKVO-konform.
	</p>
	<div class="stack" aria-hidden="true">
		<div class="card-row">
			<div class="thumb">
				<svg viewBox="0 0 30 34">
					<rect x="3" y="6" width="24" height="26" rx="2" fill="#4A90D9" />
					<rect x="8" y="11" width="5" height="5" fill="#fff" />
					<rect x="17" y="11" width="5" height="5" fill="#fff" />
					<rect x="8" y="20" width="5" height="5" fill="#fff" />
					<rect x="17" y="20" width="5" height="5" fill="#fff" />
					<path
						d="M1 8L15 1l14 7"
						stroke="#4A90D9"
						stroke-width="2"
						fill="none"
					/>
				</svg>
			</div>
			<div>
				<div class="t">Lindenallee 8</div>
				<div class="s">Mehrfamilienhaus</div>
			</div>
			<div class="amt">36 WE</div>
		</div>
		<div class={["status", reviewing ? "reviewing" : "done"]}>
			<div class="dot">
				{#if reviewing}
					<svg viewBox="0 0 26 26">
						<g stroke="#fff" stroke-width="2.4" stroke-linecap="round">
							<path
								d="M13 2v6M13 18v6M2 13h6M18 13h6M5 5l4 4M17 17l4 4M21 5l-4 4M9 17l-4 4"
							/>
						</g>
					</svg>
				{:else}
					<svg viewBox="0 0 26 20">
						<path
							d="M2 10l7 7L24 2"
							stroke="#fff"
							stroke-width="3.5"
							fill="none"
						/>
					</svg>
				{/if}
			</div>
			<span
				>{reviewing ? "Heidi prüft den Vertrag" : "Wechsel freigegeben"}</span
			>
		</div>
		<div class="checks">
			{#each checks as check, i (check)}
				<div class="check" class:pending={reviewing && i === checks.length - 1}>
					<i><Check color="#fff" /></i><span>{check}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.hero-visual {
		border-radius: 18px;
		background: linear-gradient(180deg, var(--hero-a), var(--hero-b));
		display: grid;
		place-items: center;
		padding: 48px 24px;
		min-height: 520px;
		/* The hero centres its text below 980px; the card stays left-aligned. */
		text-align: left;
	}
	.stack {
		width: min(420px, 100%);
		display: grid;
		gap: 14px;
	}
	.card-row {
		background: #fff;
		border-radius: 18px;
		padding: 12px;
		display: flex;
		align-items: center;
		gap: 14px;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.05);
	}
	.thumb {
		width: 62px;
		height: 62px;
		border-radius: 12px;
		background: #e3eaf5;
		display: grid;
		place-items: center;
		flex: none;
	}
	.thumb svg {
		width: 30px;
	}
	.card-row .t {
		font-size: 19px;
		font-weight: 500;
		line-height: 1.2;
	}
	.card-row .s {
		color: var(--muted);
		font-size: 14px;
	}
	.card-row .amt {
		margin-left: auto;
		font-size: 19px;
		font-variant-numeric: tabular-nums;
		padding-right: 8px;
		white-space: nowrap;
	}
	.status {
		background: #fff;
		border-radius: 999px;
		padding: 10px 20px 10px 10px;
		display: flex;
		align-items: center;
		gap: 16px;
		font-size: 24px;
		transition: color 0.4s;
	}
	.status .dot {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		flex: none;
		transition: background 0.4s;
	}
	.status .dot svg {
		width: 26px;
	}
	.status.reviewing {
		color: #b4bbb8;
	}
	.status.reviewing .dot {
		background: #cfcbc8;
	}
	.status.done {
		color: var(--ok);
	}
	.status.done .dot {
		background: #a9d9b4;
	}
	.checks {
		background: #fff;
		border-radius: 18px;
		padding: 22px;
		display: grid;
		gap: 18px;
	}
	.check {
		display: flex;
		align-items: center;
		gap: 14px;
		font-size: 20px;
		color: var(--ok);
		transition: opacity 0.4s;
	}
	.check i {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #5fb673;
		display: grid;
		place-items: center;
		flex: none;
	}
	.check i :global(svg) {
		width: 12px;
	}
	.check.pending {
		color: transparent;
	}
	.check.pending i {
		background: #d6d3d0;
	}
	.check.pending span {
		background: #eeedeb;
		border-radius: 999px;
		color: transparent;
	}

	@media (max-width: 980px) {
		.hero-visual {
			min-height: 440px;
		}
	}
	@media (max-width: 520px) {
		.hero-visual {
			min-height: 0;
			padding: 24px 12px;
		}
		.card-row .t {
			font-size: 17px;
		}
		.card-row .amt {
			font-size: 17px;
		}
		.status {
			font-size: 19px;
		}
		.check {
			font-size: 17px;
		}
	}
</style>
