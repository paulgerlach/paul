<!--
  The check card (.mc-card): the tabs "Hochladen" / "Werte eingeben" and
  the three panes (upload with the guided flow, values, result), state in
  the page's `BillCheck`. The server renders the empty upload pane; without
  JS the card is hidden, since nothing in it works then (plan README, open
  question 4).
-->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { getBillCheck, type Pane } from "../check.svelte";
	import { card } from "../content";
	import Result from "./Result.svelte";
	import Upload from "./Upload.svelte";
	import Values from "./Values.svelte";

	const check = getBillCheck();

	const tabs = [
		{ pane: "up", label: card.tabs.upload, icon: "doc" },
		{ pane: "man", label: card.tabs.values, icon: "list" },
	] as const satisfies { pane: Pane; label: string; icon: string }[];
</script>

<div class="card rv">
	<div class="tabs" role="tablist" aria-label={card.tabs.label}>
		{#each tabs as tab (tab.pane)}
			<button
				type="button"
				role="tab"
				id="mc-tab-{tab.pane}"
				aria-controls="mc-pane"
				aria-selected={check.pane === tab.pane}
				class={[check.pane === tab.pane && "on"]}
				onclick={() => check.showPane(tab.pane)}
				><Icon name={tab.icon} />{tab.label}</button
			>
		{/each}
	</div>
	<div
		class="pane"
		id="mc-pane"
		role={check.pane === "res" ? undefined : "tabpanel"}
		aria-labelledby={check.pane === "res" ? undefined : `mc-tab-${check.pane}`}
	>
		{#if check.pane === "up"}
			<Upload />
		{:else if check.pane === "man"}
			<Values />
		{:else}
			<Result />
		{/if}
	</div>
	{#if check.pane === "res" && check.demo}
		<span class="tag">{card.result.example}</span>
	{/if}
</div>

<style>
	.card {
		position: relative;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.35);
		padding: 18px;
		overflow: hidden;
	}
	.tabs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px;
		background: #eef1ef;
		border-radius: 12px;
		padding: 4px;
	}
	.tabs button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 0;
		background: none;
		font: inherit;
		font-size: 14px;
		font-weight: 500;
		color: var(--muted);
		padding: 9px;
		border-radius: 9px;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.tabs button :global(svg) {
		width: 15px;
		height: 15px;
	}
	.tabs button.on {
		background: #fff;
		color: var(--ink);
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.12);
	}
	.pane {
		padding-top: 16px;
	}
	/* The card's fields (.mc-card input, select) */
	.card :global(:is(input[type="date"], input[type="text"], select)) {
		font: inherit;
		font-size: 14.5px;
		color: var(--ink);
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 10px;
		padding: 10px 12px;
		width: 100%;
		min-width: 0;
	}
	/* The browser's 1 px around a date's fields (Tailwind's preflight
	   zeroes it). */
	.card :global(input[type="date"]::-webkit-datetime-edit-fields-wrapper) {
		padding-block: 1px;
	}
	.card :global(:is(input, select):focus) {
		outline: 0;
		border-color: var(--ink);
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.35);
	}
	/* .mc-btag (.dbm-demo) */
	.tag {
		position: absolute;
		right: 32px;
		top: 98px;
		z-index: 3;
		display: inline-flex;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	@media (max-width: 640px) {
		.card {
			padding: 14px;
		}
	}
	@media (scripting: none) {
		.card {
			display: none;
		}
	}
</style>
