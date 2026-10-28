<!--
  "Vier Dinge, die Sie prüfen sollten." (.pg-sec, .kd-ck): four toggle cards,
  the bar and the count. The first time all four are ticked the line says so
  and the confetti bursts from the last card (the design's `done`).
-->
<script lang="ts">
	import { onDestroy } from "svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import { checklist } from "../content";

	const total = checklist.items.length;
	const on = $state(checklist.items.map(() => false));
	const count = $derived(on.filter(Boolean).length);
	const countText = (n: number) =>
		checklist.count.replace("{n}", String(n)).replace("{total}", String(total));
	let line = $state(countText(0));

	let done = false;
	let stopConfetti = () => {};
	onDestroy(() => stopConfetti());

	function toggle(i: number, card: HTMLElement) {
		on[i] = !on[i];
		const n = on.filter(Boolean).length;
		line = countText(n);
		if (n === total && !done) {
			done = true;
			line = checklist.done;
			stopConfetti = confettiFrom(card);
		}
	}
</script>

{#snippet tick()}
	<path d="M5 10.5l3.2 3L15 7" />
{/snippet}

<section class="pg-sec" aria-labelledby="mk-ck-h">
	<div class="wrap">
		<div class="head">
			<SectionHead
				id="mk-ck-h"
				eyebrow={checklist.pill}
				icon={tick}
				heading={checklist.h2}
				center
			/>
		</div>
		<div class="ck">
			{#each checklist.items as item, i (item.title)}
				<button
					type="button"
					class={["c", "rv", on[i] && "on"]}
					aria-pressed={on[i]}
					onclick={(e) => toggle(i, e.currentTarget)}
					><span class="cb"><Check /></span><span class="cn"
						>{String(i + 1).padStart(2, "0")}</span
					><b>{item.title}</b><small>{item.text}</small></button
				>
			{/each}
		</div>
		<div class="bar rv">
			<div class="track"><i style:width="{(count / total) * 100}%"></i></div>
			<span aria-live="polite">{line}</span>
		</div>
	</div>
</section>

<style>
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	/* .dm-h2's 18 px, which the landing heading reset takes away */
	.head :global(h2) {
		margin-top: 18px;
	}
	.ck {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin-top: 48px;
	}
	.c {
		position: relative;
		text-align: left;
		font: inherit;
		color: var(--ink);
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 24px;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		transition:
			border-color 0.25s,
			background 0.25s,
			transform 0.25s;
	}
	.c:hover {
		transform: translateY(-2px);
	}
	.cb {
		position: absolute;
		right: 18px;
		top: 18px;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		border: 1.5px solid #c9d2ce;
		display: grid;
		place-items: center;
		transition:
			background 0.25s,
			border-color 0.25s;
	}
	.cb :global(svg) {
		width: 10px;
		opacity: 0;
		transform: scale(0.4);
		transition:
			opacity 0.2s,
			transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.cn {
		font-size: 13px;
		font-weight: 600;
		color: var(--ok);
	}
	.c b {
		font-size: 18px;
		font-weight: 600;
		margin-top: 18px;
		letter-spacing: -0.01em;
	}
	.c small {
		font-size: 14.5px;
		color: var(--muted);
		margin-top: 8px;
		line-height: 1.5;
	}
	.c.on {
		border-color: #c9d8cd;
		background: #f4faf5;
	}
	.c.on .cb {
		background: var(--accent);
		border-color: var(--accent);
	}
	.c.on .cb :global(svg) {
		opacity: 1;
		transform: none;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: 20px;
	}
	.track {
		flex: 1;
		height: 6px;
		border-radius: 999px;
		background: #e5eae7;
		overflow: hidden;
	}
	.track i {
		display: block;
		height: 100%;
		width: 0;
		background: var(--accent-deep, #5db864);
		border-radius: 999px;
		transition: width 0.4s;
	}
	.bar span {
		font-size: 13.5px;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	@media (max-width: 1040px) {
		.ck {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.ck {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
