<!--
  A pane's big result (.fr-big): the label, the date and the days badge. A
  new date re-enters with the design's pop; the date rendered first (the
  server's, kept through hydration) doesn't pop.
-->
<script lang="ts">
	import type { BadgeTone } from "../fristen";

	let {
		label,
		value,
		badge,
	}: {
		label: string;
		value: string;
		badge: { text: string; tone: BadgeTone };
	} = $props();

	// Not reactive: only the first date rendered skips the pop.
	let first = true;
	function pop(el: HTMLElement) {
		if (first) first = false;
		else el.classList.add("pop");
	}
</script>

<div class="big">
	<small>{label}</small>
	{#key value}<b {@attach pop}>{value}</b>{/key}<span
		class={["days", badge.tone]}>{badge.text}</span
	>
</div>

<style>
	small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
	}
	b {
		display: inline-block;
		font-size: clamp(28px, 3.2vw, 38px);
		font-weight: 500;
		letter-spacing: -0.03em;
		margin-top: 2px;
		font-variant-numeric: tabular-nums;
	}
	b:global(.pop) {
		animation: frpop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	@keyframes frpop {
		0% {
			opacity: 0.3;
			transform: translateY(4px);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}
	.days {
		display: inline-block;
		margin-left: 10px;
		vertical-align: 8px;
		font-size: 12px;
		font-weight: 600;
		border-radius: 999px;
		padding: 3px 9px;
		background: #e3f3e4;
		color: #2f7a3c;
	}
	.days.warn {
		background: #fbefd9;
		color: #8a5a10;
	}
	.days.late {
		background: #f9e1d8;
		color: #a8431a;
	}
</style>
