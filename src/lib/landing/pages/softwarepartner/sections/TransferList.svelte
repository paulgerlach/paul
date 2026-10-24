<!--
  Row 4's phone screen (the design's .ip-ul in .uv-pv): the deliveries to
  the vendor's software, three done and the current one. Static, as in the
  design; the phone around it drops in on its own loop.
-->
<script lang="ts">
	import type { Transfer } from "../content";

	let {
		transfers,
		badges,
	}: { transfers: Transfer[]; badges: Record<Transfer["state"], string> } =
		$props();
</script>

<div class="list">
	{#each transfers as transfer (transfer.title)}
		<div class={["item", transfer.state]}>
			<span>{transfer.title}</span>
			<small>{transfer.sub}</small>
			<em>{badges[transfer.state]}</em>
		</div>
	{/each}
</div>

<style>
	.list {
		display: grid;
		gap: 6px;
		text-align: left;
	}
	.item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 2px 8px;
		align-items: center;
		background: #fff;
		border: 1px solid #e5e9e7;
		border-radius: 10px;
		padding: 8px 10px;
		color: var(--ink);
	}
	.item span {
		font-size: 12px;
		font-weight: 600;
	}
	.item small {
		grid-column: 1;
		font-size: 10.5px;
		color: #7a8783;
		line-height: 1.3;
	}
	.item em {
		grid-row: 1 / 3;
		grid-column: 2;
		font-style: normal;
		font-size: 11px;
		font-weight: 700;
		min-width: 26px;
		height: 22px;
		border-radius: 999px;
		display: grid;
		place-items: center;
		padding: 0 6px;
		background: #eef1ef;
		color: #5b6b66;
	}
	.ok em {
		background: #3e9a57;
		color: #fff;
	}
	.cur {
		border-color: #8ad68f;
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.3);
	}
	.cur em {
		background: #8ad68f;
		color: var(--ink);
	}
</style>
