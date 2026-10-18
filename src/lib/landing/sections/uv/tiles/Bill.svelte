<!--
  A row's tile: "without" against "with Heidi". Every 6.4 s in view it starts
  on "without" (its `cut` rows, the sum's first value), then the thumb slides
  over, those rows fold away, the `ok` rows appear and the sum turns to its
  second value: swapped as text, or counted in € (03 §3.3).
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Tick from "../Tick.svelte";
	import type { BillTile } from "../types";

	let { without, with: withHeidi, rows, sum }: BillTile = $props();

	const euro = new Intl.NumberFormat("de-DE", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	const money = (n: number) => `${euro.format(n)}\u00a0€`;

	let good = $state(true);
	/** The counted sum while it counts; `null`: the sum of the current side. */
	let counting = $state<number | null>(null);

	const total = $derived(
		"from" in sum
			? money(counting ?? (good ? sum.to : sum.from))
			: good
				? sum.after
				: sum.before,
	);

	function run() {
		good = false;
		counting = null;
		let frame = 0;
		const timer = setTimeout(() => {
			good = true;
			if (!("from" in sum)) return;
			// The design's tween: 700 ms, ease-out cubic.
			const { from, to } = sum;
			const start = performance.now();
			const tick = (now: number) => {
				const p = Math.min(1, (now - start) / 700);
				counting = from + (to - from) * (1 - (1 - p) ** 3);
				if (p < 1) frame = requestAnimationFrame(tick);
				else counting = null;
			};
			counting = from;
			frame = requestAnimationFrame(tick);
		}, 2600);
		return () => {
			clearTimeout(timer);
			cancelAnimationFrame(frame);
			counting = null;
		};
	}
</script>

<div
	class={["bill", good && "good", "from" in sum && "money"]}
	{@attach loopInView({ run, every: 6400 })}
>
	<div class="seg">
		<span class="a">{without}</span><span class="b">{withHeidi}</span>
	</div>
	{#each rows as row (row.label)}
		<div class={["bl", row.kind]}>
			<span>{row.label}</span>{#if row.value}<b>{row.value}</b>{:else}<b
					class="tk"><Tick /></b
				>{/if}
		</div>
	{/each}
	<div class="bl sum"><span>{sum.label}</span><b>{total}</b></div>
</div>

<style>
	.bill {
		width: 100%;
		max-width: 440px;
		background: #fff;
		border-radius: 16px;
		padding: 18px 20px 16px;
		box-shadow: 0 24px 50px -34px rgba(30, 50, 45, 0.55);
		font-size: 14px;
	}
	.seg {
		display: grid;
		grid-template-columns: 1fr 1fr;
		background: var(--bg);
		border-radius: 9px;
		padding: 3px;
		margin-bottom: 12px;
		position: relative;
	}
	.seg span {
		text-align: center;
		padding: 7px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--muted);
		border-radius: 7px;
		position: relative;
		z-index: 1;
		transition: color 0.3s;
	}
	.seg::before {
		content: "";
		position: absolute;
		top: 3px;
		bottom: 3px;
		left: 3px;
		width: calc(50% - 3px);
		background: #fff;
		border-radius: 7px;
		box-shadow: 0 1px 3px rgba(30, 50, 45, 0.15);
		transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.good .seg::before {
		transform: translateX(100%);
	}
	.bill:not(.good) .seg .a,
	.good .seg .b {
		color: var(--ink);
	}
	.bl {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 11px 0;
		border-top: 1px solid var(--hair);
		transition:
			opacity 0.4s,
			max-height 0.45s,
			padding 0.45s;
		overflow: hidden;
		max-height: 60px;
	}
	.bl span {
		color: var(--muted);
	}
	.bl b {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.cut b {
		color: #b4472e;
		font-size: 13px;
	}
	/* Amounts keep the row's size (the /mieterportal text values are 13 px). */
	.money .cut b {
		font-size: inherit;
	}
	.tk {
		color: #2f7a3c;
		display: grid;
		place-items: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #e6f5e7;
	}
	.tk :global(svg) {
		width: 11px;
		height: 11px;
	}
	.bill:not(.good) .ok,
	.good .cut {
		opacity: 0;
		max-height: 0;
		padding-block: 0;
		border-top-color: transparent;
	}
	.sum span {
		color: var(--ink);
		font-weight: 600;
	}
	.sum b {
		font-size: 18px;
		letter-spacing: -0.02em;
	}
</style>
