<!--
  A row's tile: a phone with a notification and a figure with its chips, then
  monthly bars (the Verbrauchsinformation) or detail rows (an appointment).
  Every 7 s in view the notification drops in again, then the figure appears
  and the bars grow.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Icon from "../Icon.svelte";
	import type { PhoneTile } from "../types";

	let {
		time,
		app,
		title,
		sub,
		label,
		value,
		comparisons,
		details = [],
		bars = [],
		max = Math.max(...bars, 1) * 1.05,
	}: PhoneTile = $props();

	const full = $derived(bars.map((v) => Math.round((v / max) * 100)));

	/** 0: empty, 1: notification in, 2: figure in. */
	let stage = $state(2);
	/** Bar heights in % while animating; `null`: the full heights. */
	let heights = $state<number[] | null>(null);

	function run() {
		stage = 0;
		heights = full.map(() => 6);
		const timers = [
			setTimeout(() => (stage = 1), 500),
			setTimeout(() => {
				stage = 2;
				full.forEach((h, i) =>
					timers.push(setTimeout(() => (heights![i] = h), i * 60)),
				);
			}, 1800),
		];
		return () => timers.forEach(clearTimeout);
	}
</script>

<div
	class={["phone", stage >= 1 && "s1", stage >= 2 && "s2"]}
	{@attach loopInView({ run, every: 7000 })}
>
	<div class="pt"><span>{time}</span><span>{app}</span></div>
	<div class="nt">
		<span class="ni"><Icon name="bell" /></span>
		<span><b>{title}</b><small>{sub}</small></span>
	</div>
	<div class="pv">
		<small>{label}</small>
		<b>{value}</b>
		<div class="cmp">
			{#each comparisons as c (c)}<span>{c}</span>{/each}
		</div>
		{#if details.length}
			<div class="ev">
				{#each details as d (d.label)}
					<div><span>{d.label}</span><b>{d.value}</b></div>
				{/each}
			</div>
		{/if}
		{#if bars.length}
			<div class="mini">
				{#each heights ?? full as h, i (i)}<i style:height="{h}%"></i>{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.phone {
		width: min(300px, 82%);
		background: #fff;
		border-radius: 30px;
		padding: 14px 14px 60px;
		align-self: flex-end;
		position: relative;
		top: calc(clamp(20px, 4vw, 52px) + 70px);
		box-shadow:
			0 0 0 11px rgba(255, 255, 255, 0.05),
			0 0 0 12px rgba(255, 255, 255, 0.16),
			0 30px 60px -30px rgba(0, 0, 0, 0.5);
	}
	.pt {
		display: flex;
		justify-content: space-between;
		font-size: 11.5px;
		font-weight: 600;
		padding: 2px 8px 12px;
	}
	.nt {
		display: flex;
		gap: 10px;
		align-items: center;
		background: var(--bg);
		border-radius: 14px;
		padding: 10px 12px;
		opacity: 0;
		transform: translateY(-12px) scale(0.97);
		transition:
			opacity 0.45s,
			transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.45s;
	}
	.ni {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		flex: none;
	}
	.ni :global(svg) {
		width: 15px;
		height: 15px;
	}
	.nt b {
		display: block;
		font-size: 12.5px;
	}
	.nt small {
		display: block;
		font-size: 11px;
		color: var(--muted);
	}
	.pv {
		margin-top: 12px;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 14px 14px 70px;
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 0.5s,
			transform 0.5s;
	}
	.pv small {
		font-size: 11.5px;
		color: var(--muted);
	}
	.pv > b {
		display: block;
		font-size: 28px;
		font-weight: 500;
		letter-spacing: -0.03em;
		margin-top: 2px;
		font-variant-numeric: tabular-nums;
	}
	.cmp {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 8px;
	}
	.cmp span {
		font-size: 10.5px;
		font-weight: 600;
		border-radius: 6px;
		padding: 3px 7px;
		background: #e6f5e7;
		color: #245f33;
	}
	/* The design's .uv-ev */
	.ev {
		display: grid;
		gap: 6px;
		margin-top: 12px;
	}
	.ev div {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		font-size: 12px;
		border-top: 1px solid var(--hair);
		padding-top: 8px;
	}
	.ev span {
		color: var(--muted);
	}
	.ev b {
		font-weight: 600;
	}
	.mini {
		display: flex;
		align-items: flex-end;
		gap: 4px;
		height: 56px;
		margin-top: 14px;
	}
	.mini i {
		flex: 1;
		background: #d7e3da;
		border-radius: 3px 3px 0 0;
		transition: height 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.mini i:last-child {
		background: var(--ok);
	}
	.s1 .nt {
		opacity: 1;
		transform: none;
	}
	.s2 .nt {
		background: #eef6ef;
	}
	.s2 .pv {
		opacity: 1;
		transform: none;
	}
</style>
