<!--
  fr1 "Verbräuche lückenlos erfasst": a reading card (label, value, Stichtag),
  a tick and the device card with its "per Funk" pill. On hover the cards
  part, the tick spins and the signal pings (CSS).
-->
<script lang="ts">
	import Icon from "../Icon.svelte";
	import Tick from "../Tick.svelte";
	import type { MeterTile } from "../types";

	let { tile }: { tile: MeterTile } = $props();

	const format = (n: number) => Math.round(n).toLocaleString("de-DE");
</script>

<div class="a card" aria-hidden="true">
	<span
		><small>{tile.label}</small><b
			><span class="n">{format(tile.value)}</span><i>{tile.unit}</i></b
		></span
	><em><small>{tile.dateLabel}</small>{tile.date}</em>
</div>
<span class="ck" aria-hidden="true"><Tick /></span>
<div class="b card" aria-hidden="true">
	<span class="ic"><Icon name="meter" /></span><b>{tile.device}</b><em
		class="sig"><i></i>{tile.signal}</em
	>
</div>

<style>
	.a,
	.b {
		width: min(460px, 90%);
		box-sizing: border-box;
		display: flex;
		align-items: center;
		min-width: 0;
		padding: clamp(14px, 5cqw, 24px) clamp(16px, 5.5cqw, 26px);
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 0.6s,
			transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.4s;
	}
	.a > span {
		min-width: 0;
		flex: 1;
	}
	.a small {
		display: block;
		font-size: clamp(13px, 3.6cqw, 16px);
		color: var(--muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.a b {
		display: flex;
		align-items: baseline;
		gap: 8px;
		font-size: clamp(26px, 8cqw, 36px);
		font-weight: 500;
		letter-spacing: -0.03em;
		margin-top: 2px;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.a b i {
		font-style: normal;
		font-size: clamp(12px, 3.4cqw, 15px);
		color: var(--muted);
		letter-spacing: 0;
		font-weight: 400;
	}
	.a em {
		margin-left: 16px;
		padding-left: clamp(12px, 4cqw, 20px);
		border-left: 1px solid var(--hair);
		font-style: normal;
		color: var(--muted);
		align-self: stretch;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: none;
		font-size: clamp(14px, 3.8cqw, 17px);
		font-variant-numeric: tabular-nums;
	}
	.a em small {
		font-size: clamp(10.5px, 2.8cqw, 12px);
		color: var(--faint);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	.b {
		gap: clamp(12px, 4cqw, 18px);
		margin-top: 8px;
	}
	.b .ic {
		width: clamp(44px, 13cqw, 60px);
		height: clamp(44px, 13cqw, 60px);
		transition:
			background 0.3s,
			transform 0.4s cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	.b .ic :global(svg) {
		width: clamp(20px, 6cqw, 26px);
		height: clamp(20px, 6cqw, 26px);
	}
	.b b {
		font-size: clamp(15px, 4.6cqw, 20px);
		font-weight: 500;
		min-width: 0;
		line-height: 1.2;
		hyphens: manual;
	}
	.sig {
		white-space: nowrap;
		margin-left: auto;
		flex: none;
		font-style: normal;
		font-size: clamp(11.5px, 3.2cqw, 13px);
		font-weight: 600;
		background: #eef1ef;
		color: var(--ink);
		border-radius: 999px;
		padding: 5px 10px 5px 8px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.sig i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #3e9a57;
		position: relative;
	}
	.sig i::after {
		content: "";
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		border: 1.5px solid #3e9a57;
		opacity: 0;
	}
	.ck {
		position: relative;
		z-index: 2;
		width: clamp(40px, 12cqw, 52px);
		height: clamp(40px, 12cqw, 52px);
		margin: calc(clamp(40px, 12cqw, 52px) / -2) 0
			calc(clamp(40px, 12cqw, 52px) / -2 - 8px);
		border-radius: 50%;
		background: #d9eedb;
		box-shadow: 0 0 0 5px #e4efe6;
		display: grid;
		place-items: center;
		transform: scale(0);
		transition:
			transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) 0.5s,
			background 0.3s;
	}
	.ck :global(svg) {
		width: 16px;
	}
	.ck :global(path) {
		stroke: #2f7a3c;
	}
	:global(.in) > :global(.vis) > .a {
		opacity: 1;
		transform: none;
	}
	:global(.in) > :global(.vis) > .ck {
		transform: scale(1);
	}
	:global(.in) > :global(.vis) > .b {
		opacity: 1;
		transform: none;
		transition-delay: 0.8s, 0s, 0s;
	}
	/* Hover */
	:global(.vis:hover) > .a {
		transform: translateY(-8px);
		box-shadow: 0 18px 34px -24px rgba(30, 50, 45, 0.35);
	}
	:global(.vis:hover) > .b {
		transform: translateY(8px);
		box-shadow: 0 18px 34px -24px rgba(30, 50, 45, 0.35);
		transition-delay: 0s;
	}
	:global(.vis:hover) > .ck {
		transform: scale(1.12) rotate(360deg);
		background: var(--accent);
		transition:
			transform 0.6s cubic-bezier(0.3, 1.4, 0.5, 1),
			background 0.3s;
	}
	:global(.vis:hover) > .ck :global(path) {
		stroke: var(--ink);
	}
	:global(.vis:hover) > .b .ic {
		background: var(--ink);
		color: var(--accent);
		transform: rotate(-6deg) scale(1.05);
	}
	:global(.vis:hover) > .b .sig i::after {
		animation: fr-sig 1.2s ease-out infinite;
	}
	@keyframes fr-sig {
		0% {
			opacity: 0.8;
			transform: scale(0.6);
		}
		100% {
			opacity: 0;
			transform: scale(1.6);
		}
	}
	@media (max-width: 480px) {
		.a b {
			font-size: 28px;
		}
		.a,
		.b {
			padding: 18px;
		}
		.b b {
			font-size: 18px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.a,
		.b,
		.ck,
		.b .ic {
			transition: none;
			opacity: 1;
			transform: none;
		}
		:global(.vis:hover) > .a,
		:global(.vis:hover) > .b,
		:global(.vis:hover) > .b .ic {
			transform: none;
		}
		:global(.vis:hover) > .ck {
			transform: scale(1);
		}
		:global(.vis:hover) > .b .sig i::after {
			animation: none;
		}
	}
</style>
