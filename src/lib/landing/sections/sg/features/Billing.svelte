<!--
  fr2 "Abrechnung ohne Handarbeit": the Abrechnung for every unit, rendered
  finished ("24 / 24"). Below the fold it starts at "0 / 24" and counts one
  per 90 ms, 500 ms after coming into view.
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import Icon from "../Icon.svelte";
	import type { BillingTile } from "../types";

	let { tile }: { tile: BillingTile } = $props();

	// svelte-ignore state_referenced_locally
	let count = $state(tile.total);
	const done = $derived(count >= tile.total);

	const counting = enterView({
		prepare: () => (count = 0),
		play: () => {
			let interval: ReturnType<typeof setInterval> | undefined;
			const start = setTimeout(() => {
				interval = setInterval(() => {
					count++;
					if (count >= tile.total) clearInterval(interval);
				}, 90);
			}, 500);
			return () => {
				clearTimeout(start);
				clearInterval(interval);
			};
		},
	});
</script>

<div class="card c" aria-hidden="true" {@attach counting}>
	<span class="ic dk"><Icon name="doc" /></span><span
		><b>{tile.title}</b><small class={[done && "done"]}
			>{done ? tile.done : tile.pending}</small
		></span
	><em>{count} / {tile.total}</em>
</div>

<style>
	.c {
		width: min(460px, 88%);
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 18px;
	}
	/* Lets the title wrap; the design's text never shrinks, so at 375 px its
	   count ran out of the card. */
	.c > span {
		min-width: 0;
	}
	em {
		flex: none;
	}
	b {
		display: block;
		font-size: 18px;
		font-weight: 500;
		white-space: nowrap;
	}
	small {
		display: block;
		font-size: 16px;
		color: #4b6fbf;
		margin-top: 2px;
	}
	small.done {
		color: #2f7a3c;
	}
	em {
		margin-left: auto;
		font-style: normal;
		font-size: 18px;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	@media (max-width: 480px) {
		b {
			white-space: normal;
			hyphens: auto;
			overflow-wrap: break-word;
		}
	}
</style>
