<!--
  fr5 "Rollout Liegenschaft für Liegenschaft": a rollout of four properties
  with their bars and status. The server renders the start state (two done).
  In view, a 15 s loop (first after 1.8 s) plays the content's timeline:
  back to the start state, then the other two properties finish.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Tick from "../Tick.svelte";
	import type { RolloutRow, RolloutTile } from "../types";

	let { tile }: { tile: RolloutTile } = $props();

	// svelte-ignore state_referenced_locally
	let rows = $state<RolloutRow[]>(tile.rows.map((r) => ({ ...r })));
	let live = $state(false);
	const done = $derived(rows.filter((r) => r.done).length);
	function pass() {
		live = true;
		rows = tile.rows.map((r) => ({ ...r }));
		const timers = tile.timeline.map(({ at, row, ...state }) =>
			setTimeout(() => (rows[row] = state), at),
		);
		return () => timers.forEach(clearTimeout);
	}

	const count = $derived(
		(done === rows.length ? tile.count.all : tile.count.some)
			.replace("{n}", String(done))
			.replace("{total}", String(rows.length)),
	);
</script>

<div
	class={["ro card", live && "live"]}
	aria-hidden="true"
	{@attach loopInView({
		run: pass,
		every: tile.every,
		delay: 1800,
		threshold: 0.25,
	})}
>
	<div class="h">
		<span><b>{tile.title}</b><small class="c">{count}</small></span><span
			class="demo">{tile.tag}</span
		>
	</div>
	{#each rows as row (row.name)}
		<div class="r" style:--rp="{row.progress}%">
			<span>{row.name}</span><i
				><i class={[row.done && row.progress >= 100 && "done"]}></i></i
			>{#key row.status}<em class={[row.done && "ok", live && "flip"]}
					>{row.status}</em
				>{/key}
		</div>
	{/each}
	<div class="f">
		<span class="badge"><Tick />{tile.badge}</span><span>{tile.note}</span>
	</div>
</div>

<style>
	.ro {
		width: min(88%, 460px);
		padding: 20px 22px;
	}
	.h {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		margin-bottom: 14px;
	}
	.h > span:first-child {
		display: grid;
		gap: 2px;
	}
	.h b {
		font-size: 15px;
	}
	.c {
		font-size: 12px;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.r {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 90px 112px;
		gap: 12px;
		align-items: center;
		padding: 10px 0;
		border-top: 1px solid var(--hair);
		font-size: 14px;
	}
	.r > i {
		display: block;
		height: 8px;
		border-radius: 8px;
		background: #eef1ef;
		overflow: hidden;
	}
	.r > i > i {
		display: block;
		height: 100%;
		width: 0;
		background: #1e322d;
		border-radius: 8px;
		transition: width 1.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.r:nth-of-type(2) > i > i {
		transition-delay: 0.15s;
	}
	.r:nth-of-type(3) > i > i {
		transition-delay: 0.3s;
	}
	.r:nth-of-type(4) > i > i {
		transition-delay: 0.45s;
		background: var(--accent);
	}
	.r:nth-of-type(5) > i > i {
		transition-delay: 0.6s;
		background: var(--accent);
	}
	:global(.in) .r > i > i {
		width: var(--rp);
	}
	.r > i > i.done {
		background: #1e322d !important;
	}
	.live .r > i > i {
		transition:
			width 2.6s cubic-bezier(0.4, 0, 0.2, 1),
			background 0.4s;
		transition-delay: 0s !important;
	}
	em {
		font-style: normal;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--muted);
		text-align: right;
		white-space: nowrap;
		transition: color 0.3s;
	}
	em.ok {
		color: #2f7a3c;
	}
	em.flip {
		animation: ro-flip 0.45s cubic-bezier(0.3, 1.4, 0.5, 1);
	}
	@keyframes ro-flip {
		0% {
			opacity: 0;
			transform: translateY(5px);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}
	.f {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 14px;
		padding-top: 14px;
		border-top: 1px solid var(--hair);
		font-size: 12.5px;
		color: var(--muted);
	}
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: var(--accent);
		color: var(--ink);
		font-weight: 600;
		border-radius: 999px;
		padding: 5px 11px;
		font-size: 12.5px;
	}
	.badge :global(svg) {
		width: 11px;
	}
	@media (max-width: 520px) {
		.ro {
			width: 92%;
			padding: 16px;
		}
		.r {
			grid-template-columns: minmax(0, 1fr) 44px 100px;
			gap: 10px;
			font-size: 13px;
		}
		em {
			font-size: 11px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.r > i > i {
			transition: none;
		}
		em.flip {
			animation: none;
		}
	}
</style>
