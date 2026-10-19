<!--
  fr3 "Verbräuche jeden Monat im Blick": three flats' monthly values with
  bars; the outlier turns orange ("Über Vormonat") and gets flagged. The
  server renders the design's reduced-motion state (`s1 s2 s4`): every value
  and bar in place, the outlier flagged, no cursor and no toast.
-->
<script lang="ts">
	import Icon from "../Icon.svelte";
	import Tick from "../Tick.svelte";
	import type { MonthlyTile } from "../types";

	let { tile }: { tile: MonthlyTile } = $props();

	/** The loop's stages (the design's s1–s5 classes). */
	let stage = $state({ s1: true, s2: true, s3: false, s4: true, s5: false });
	// svelte-ignore state_referenced_locally
	let values = $state(tile.rows.map((r) => r.value));
	const width = (v: number) => `${(v / tile.max) * 100}%`;
</script>

<div class={["list card", stage]} aria-hidden="true">
	{#each tile.rows as row, i (row.unit)}
		<div class={["li", row.outlier && "sp"]}>
			<span class="av">{row.unit}</span><span class="lt"
				><span class="nm">{tile.same}</span><span class="w"
					><Icon name="alert" /> {tile.above}</span
				></span
			><span class="bar"><i style:width={width(values[i])}></i></span><span
				class="v"><b>{values[i]}</b> {tile.unit}</span
			><span class="act"
				><i class="ok"><Tick /></i><i class="fl"
					><svg viewBox="0 0 12 12"
						><path d="M3 11V1.5h6.5L8 4l1.5 2.5H3" fill="currentColor" /></svg
					></i
				></span
			>
		</div>
	{/each}
	<span class="cur"
		><svg viewBox="0 0 24 28"
			><path
				d="M2 2l19 11-8.5 1.8L8 24z"
				fill="#1E322D"
				stroke="#fff"
				stroke-width="1.6"
				stroke-linejoin="round"
			/></svg
		><i>{tile.cursor}</i></span
	>
	<span class="toast"><Icon name="check" /> {tile.toast}</span>
</div>
<span class="demo tg">{tile.tag}</span>

<style>
	.list {
		position: relative;
		width: min(460px, 90%);
		padding: 8px 16px;
	}
	.li {
		position: relative;
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr) 56px 76px 58px;
		align-items: center;
		gap: 12px;
		padding: 14px 6px;
		margin: 0 -6px;
		border-radius: 10px;
		border-bottom: 1px solid #eef1ef;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.45s,
			transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.4s;
	}
	.li:nth-of-type(3) {
		border-bottom: 0;
	}
	.s1 .li {
		opacity: 1;
		transform: none;
	}
	.s1 .li:nth-of-type(2) {
		transition-delay: 0.15s;
	}
	.s1 .li:nth-of-type(3) {
		transition-delay: 0.3s;
	}
	.av {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: #eef1ef;
		display: grid;
		place-items: center;
		font-size: 13px;
		font-weight: 600;
		transition:
			background 0.4s,
			color 0.4s;
	}
	.lt {
		position: relative;
		font-size: 15px;
		height: 22px;
		overflow: hidden;
	}
	.lt > span {
		position: absolute;
		left: 0;
		top: 0;
		white-space: nowrap;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		transition:
			transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.35s;
	}
	.nm {
		color: var(--muted);
	}
	.w {
		color: #c2581f;
		transform: translateY(100%);
		opacity: 0;
	}
	.lt :global(svg) {
		width: 15px;
		height: 15px;
	}
	.bar {
		height: 6px;
		border-radius: 3px;
		background: #eef1ef;
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		border-radius: 3px;
		background: #9fd3a3;
		transition:
			width 0.9s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.4s;
	}
	.v {
		text-align: right;
		font-size: 15.5px;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		color: var(--ink);
		transition: color 0.4s;
	}
	.v b {
		font-weight: 500;
	}
	.act {
		display: flex;
		gap: 5px;
		justify-content: flex-end;
	}
	.act i {
		width: 24px;
		height: 24px;
		border-radius: 7px;
		display: grid;
		place-items: center;
		background: #f1f3f2;
		color: #9aa5a1;
		transition:
			background 0.25s,
			color 0.25s,
			transform 0.2s;
	}
	.act i :global(svg) {
		width: 11px;
		height: 11px;
	}
	.act i.ok :global(path) {
		stroke: #9aa5a1;
	}
	.s2 .sp {
		background: #fff6f1;
	}
	.s2 .sp .av {
		background: #fbe4da;
		color: #b5471a;
	}
	.s2 .sp .nm {
		transform: translateY(-100%);
		opacity: 0;
	}
	.s2 .sp .w {
		transform: none;
		opacity: 1;
	}
	.s2 .sp .bar i {
		background: #e3794a;
	}
	.s2 .sp .v {
		color: #b5471a;
	}
	.s2 .sp .act i.fl {
		background: #fce3d7;
		color: #d9622b;
	}
	.s4 .sp .act i.fl {
		background: #d9622b;
		color: #fff;
		transform: scale(1.12);
	}
	.cur {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 3;
		display: flex;
		align-items: flex-start;
		gap: 2px;
		pointer-events: none;
		opacity: 0;
		transform: translate(var(--x0, 380px), var(--y0, 230px));
		transition:
			transform 1.1s cubic-bezier(0.45, 0.05, 0.25, 1),
			opacity 0.4s;
	}
	.cur svg {
		width: 20px;
		height: 24px;
		transition: transform 0.15s;
	}
	.cur i {
		position: absolute;
		right: 16px;
		top: 22px;
		font-style: normal;
		font-size: 12px;
		font-weight: 600;
		background: var(--ink);
		color: #fff;
		border-radius: 7px;
		padding: 4px 8px;
		white-space: nowrap;
	}
	.s3 .cur {
		opacity: 1;
		transform: translate(var(--x, 300px), var(--y, 80px));
	}
	.s4 .cur svg {
		transform: scale(0.85);
	}
	.toast {
		position: absolute;
		left: 50%;
		bottom: -46px;
		transform: translate(-50%, 8px);
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: var(--ink);
		color: #fff;
		font-size: 13px;
		font-weight: 600;
		border-radius: 10px;
		padding: 8px 12px;
		white-space: nowrap;
		opacity: 0;
		transition:
			opacity 0.35s,
			transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1);
	}
	.toast :global(svg) {
		width: 14px;
		height: 14px;
		color: var(--accent);
	}
	.s5 .toast {
		opacity: 1;
		transform: translate(-50%, 0);
	}
	.tg {
		position: absolute;
		right: 14px;
		top: 14px;
	}
	@media (max-width: 480px) {
		.li {
			grid-template-columns: 34px minmax(0, 1fr) 64px 52px;
			gap: 8px;
		}
		.bar {
			display: none;
		}
		.av {
			width: 34px;
			height: 34px;
		}
		.lt {
			font-size: 13px;
		}
		.act i {
			width: 22px;
			height: 22px;
		}
		.cur {
			right: -2px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.li,
		.lt > span,
		.bar i,
		.av,
		.v,
		.act i {
			transition: none;
		}
	}
</style>
