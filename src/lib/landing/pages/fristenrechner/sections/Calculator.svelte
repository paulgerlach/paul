<!--
  The calculator card (.fr-card#rechner): WAI-ARIA tabs with the `.pg-seg`
  look over the three panes, and the note. Every pane stays in the HTML
  (inactive ones `display: none` through `.off`, not the `hidden` attribute,
  which Tailwind's preflight hides with `!important`), so the inputs keep
  their values across tabs; without JS the tabs are hidden and the panes
  stack.
-->
<script lang="ts">
	import { calculator, RECHNER_ID, type Tab } from "../content";
	import BillingPane from "./BillingPane.svelte";
	import CalibrationPane from "./CalibrationPane.svelte";
	import ContractPane from "./ContractPane.svelte";

	let tab = $state<Tab>("vertrag");
	const tabs = calculator.tabs;
	let buttons: HTMLButtonElement[] = $state([]);

	const KEYS: Record<string, (i: number, n: number) => number> = {
		ArrowRight: (i, n) => (i + 1) % n,
		ArrowLeft: (i, n) => (i - 1 + n) % n,
		Home: () => 0,
		End: (_, n) => n - 1,
	};

	function onkeydown(event: KeyboardEvent, index: number) {
		const move = KEYS[event.key];
		if (!move) return;
		event.preventDefault();
		const next = move(index, tabs.length);
		tab = tabs[next].value;
		buttons[next]?.focus();
	}
</script>

<div class="card rv" id={RECHNER_ID} role="group" aria-label={calculator.label}>
	<div class="tabs" role="tablist" aria-label={calculator.label}>
		{#each tabs as t, i (t.value)}
			<button
				bind:this={buttons[i]}
				type="button"
				role="tab"
				id="fr-tab-{t.value}"
				aria-controls="fr-pane-{t.value}"
				aria-selected={tab === t.value}
				tabindex={tab === t.value ? 0 : -1}
				class={[tab === t.value && "on"]}
				onclick={() => (tab = t.value)}
				onkeydown={(event) => onkeydown(event, i)}>{t.label}</button
			>
		{/each}
	</div>

	{#snippet pane(value: Tab)}
		<div
			class={["pane", tab !== value && "off"]}
			role="tabpanel"
			id="fr-pane-{value}"
			aria-labelledby="fr-tab-{value}"
		>
			{#if value === "vertrag"}
				<ContractPane />
			{:else if value === "eich"}
				<CalibrationPane />
			{:else}
				<BillingPane />
			{/if}
		</div>
	{/snippet}
	{#each tabs as t (t.value)}
		{@render pane(t.value)}
	{/each}
	<span class="src">{calculator.note}</span>
</div>

<style>
	.card {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 22px;
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.35);
		position: relative;
		scroll-margin-top: 72px;
	}
	/* .pg-seg.fr-tabs */
	.tabs {
		display: flex;
		width: 100%;
		background: #eef1ef;
		border-radius: 10px;
		padding: 3px;
		gap: 2px;
	}
	.tabs button {
		flex: 1;
		border: 0;
		background: none;
		font: inherit;
		font-size: 13.5px;
		font-weight: 500;
		color: var(--muted);
		padding: 7px 12px;
		border-radius: 8px;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.tabs button:hover {
		color: var(--ink);
	}
	.tabs button.on {
		background: #fff;
		color: var(--ink);
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.12);
	}
	.pane {
		margin-top: 18px;
		animation: frin 0.3s ease;
	}
	.pane.off {
		display: none;
	}
	@keyframes frin {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	/* The panes' fields, result box, rows and hints (.fr-f2, .fr-res, .fr-row, .fr-hint) */
	.card :global(.f2) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	.card :global(.f2 label) {
		display: grid;
		gap: 6px;
		min-width: 0;
	}
	.card :global(.f2 label > span) {
		font-size: 12.5px;
		font-weight: 600;
	}
	.card :global(.f2 small) {
		font-weight: 400;
		color: var(--faint);
	}
	.card :global(:is(.f2 input, .f2 select)) {
		width: 100%;
		font: inherit;
		font-size: 14.5px;
		border: 1px solid var(--hair);
		border-radius: 10px;
		padding: 10px 11px;
		background: #fff;
		color: var(--ink);
		min-width: 0;
		height: 44px;
	}
	.card :global(:is(.f2 input, .f2 select):focus) {
		outline: 0;
		border-color: var(--ok);
		box-shadow: 0 0 0 3px rgba(47, 158, 68, 0.14);
	}
	.card :global(.res) {
		margin-top: 16px;
		background: #f6f7f6;
		border-radius: 14px;
		padding: 16px;
	}
	.card :global(.row) {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-size: 14px;
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid #e7eae8;
	}
	.card :global(.row span) {
		color: var(--muted);
	}
	.card :global(.hint) {
		font-size: 13px;
		color: var(--muted);
		line-height: 1.5;
		margin-top: 14px;
	}
	.card :global(.hint a) {
		color: var(--ok);
		font-weight: 600;
	}
	.src {
		display: block;
		font-size: 11.5px;
		color: var(--faint);
		margin-top: 12px;
	}
	/* Without JS the tabs can't switch: show every pane. */
	@media (scripting: none) {
		.tabs {
			display: none;
		}
		.pane.off {
			display: block;
		}
		.pane + .pane {
			margin-top: 28px;
			padding-top: 22px;
			border-top: 1px solid var(--hair);
		}
	}
	@media (max-width: 560px) {
		.card :global(.f2) {
			grid-template-columns: minmax(0, 1fr);
		}
		.tabs button {
			font-size: 12.5px;
			padding: 7px 6px;
		}
		.card {
			padding: 16px;
		}
	}
</style>
