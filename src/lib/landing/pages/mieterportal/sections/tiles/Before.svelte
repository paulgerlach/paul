<!--
  Row 4's tile: "Ohne Portal" against "Mit Heidi". Every 6.4 s in view it
  starts on "Ohne Portal" (late consumption, frequent calls, "viele"), then
  the thumb slides over, those rows fold away, the portal's rows appear and
  the sum turns to "weniger".
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Tick from "$lib/landing/sections/uv/Tick.svelte";
	import { before } from "../../content";

	let good = $state(true);

	function run() {
		good = false;
		const timer = setTimeout(() => (good = true), 2600);
		return () => clearTimeout(timer);
	}
</script>

<div
	class={["bill", good && "good"]}
	{@attach loopInView({ run, every: 6400 })}
>
	<div class="seg">
		<span class="a">{before.without}</span><span class="b">{before.with}</span>
	</div>
	{#each before.cut as row (row.label)}
		<div class="bl cut"><span>{row.label}</span><b>{row.value}</b></div>
	{/each}
	{#each before.ok as label (label)}
		<div class="bl ok"><span>{label}</span><b><Tick /></b></div>
	{/each}
	<div class="bl sum">
		<span>{before.sum.label}</span><b
			>{good ? before.sum.after : before.sum.before}</b
		>
	</div>
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
	.ok b {
		color: #2f7a3c;
		display: grid;
		place-items: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #e6f5e7;
	}
	.ok b :global(svg) {
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
