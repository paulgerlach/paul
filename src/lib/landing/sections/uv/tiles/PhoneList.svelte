<!--
  A list as a phone's screen (the design's .ip-ul in .uv-pv, in `Phone`'s
  `screen`): done rows, the current one and open ones, each with its state's
  badge (an open row has none). Static, as in the designs; the phone around it
  drops in on its own loop. /partner/softwarepartner's transfers,
  /messdienst-wechseln's notice periods.
-->
<script lang="ts">
	import type { PhoneListItem } from "../types";

	let {
		items,
		badges,
	}: {
		items: PhoneListItem[];
		badges: Partial<Record<PhoneListItem["state"], string>>;
	} = $props();
</script>

<div class="list">
	{#each items as item (item.title)}
		<div class={["item", item.state]}>
			<span>{item.title}</span>
			<small>{item.sub}</small>
			{#if badges[item.state]}<em>{badges[item.state]}</em>{/if}
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
