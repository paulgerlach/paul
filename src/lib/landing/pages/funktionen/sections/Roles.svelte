<!--
  "Für alle Beteiligten" (.fr): four WAI-ARIA tabs (Verwaltung, Mieter,
  Eigentümer, Monteure), each panel a line and its entries (links where the
  page exists). Every panel stays in the HTML; the inactive ones are hidden
  through `visibility` in one grid cell, so the block keeps the tallest
  panel's height. With motion the next role shows every 6.5 s while in view
  (`AutoTabs`, paused on hover and focus); a click stops it.
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { AutoTabs } from "$lib/landing/autoTabs.svelte";
	import Icon from "../components/Icon.svelte";
	import IconPaths from "../components/IconPaths.svelte";
	import Section from "../components/Section.svelte";
	import { roles } from "../content";

	const tabId = (i: number) => `fk-role-${i}`;
	const panelId = (i: number) => `fk-role-panel-${i}`;
	const tabs = new AutoTabs({
		count: roles.tabs.length,
		intervalMs: roles.intervalMs,
		tabId,
	});
</script>

<Section alt labelledby="fk-roles-h">
	<div class="head">
		<SectionHead
			id="fk-roles-h"
			eyebrow={roles.eyebrow}
			heading={roles.h2}
			center
		>
			{#snippet icon()}<IconPaths name={roles.eyebrowIcon} />{/snippet}
		</SectionHead>
	</div>
	<div class="fr rv" {@attach tabs.attach}>
		<div
			class="fr-t"
			role="tablist"
			aria-label={roles.label}
			tabindex="-1"
			onkeydown={tabs.onkeydown}
		>
			{#each roles.tabs as tab, i (tab.name)}
				<button
					type="button"
					class={["fr-b", tabs.active === i && "on"]}
					role="tab"
					id={tabId(i)}
					aria-selected={tabs.active === i}
					aria-controls={panelId(i)}
					tabindex={tabs.active === i ? 0 : -1}
					onclick={() => tabs.select(i)}
				>
					<Icon name={tab.icon} />{tab.name}
				</button>
			{/each}
		</div>
		<div class="fr-s">
			{#each roles.tabs as tab, i (tab.name)}
				<div
					class={["fr-p", tabs.active === i && "on"]}
					role="tabpanel"
					id={panelId(i)}
					aria-labelledby={tabId(i)}
					inert={tabs.active !== i}
				>
					<p class="fr-d">{tab.text}</p>
					<div class="fr-l">
						{#each tab.items as item, j (item.title)}
							<svelte:element
								this={item.href ? "a" : "div"}
								class="fr-i"
								href={item.href}
								style:--j={j}
							>
								<span class="fr-ck">
									<svg viewBox="0 0 12 10" width="10" aria-hidden="true"
										><path
											d="M1 5l3.5 3.5L11 1"
											stroke="#1E322D"
											stroke-width="2"
											fill="none"
											stroke-linecap="round"
											stroke-linejoin="round"
										/></svg
									>
								</span>
								<span><b>{item.title}</b><small>{item.text}</small></span>
								{#if item.href}<em aria-hidden="true">→</em>{/if}
							</svelte:element>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</Section>

<style>
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	.fr {
		margin-top: 48px;
	}
	.fr-t {
		display: flex;
		justify-content: center;
		gap: 8px;
		flex-wrap: wrap;
	}
	.fr-t:focus {
		outline: none;
	}
	/* `.fr .fr-b`: beats the landing reset of buttons' font and colour. */
	.fr .fr-b {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 12px;
		padding: 10px 16px;
		font: inherit;
		font-size: 15px;
		font-weight: 500;
		color: var(--muted);
		cursor: pointer;
		transition: all 0.25s;
	}
	.fr-b :global(svg) {
		width: 16px;
		height: 16px;
	}
	.fr .fr-b.on {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.fr-s {
		display: grid;
		margin-top: 24px;
	}
	.fr-p {
		grid-area: 1/1;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.35s,
			visibility 0s 0.35s;
	}
	.fr-p.on {
		opacity: 1;
		visibility: visible;
		transition: opacity 0.35s;
	}
	.fr-d {
		text-align: center;
		color: var(--muted);
		font-size: 17px;
		max-width: 56ch;
		margin: 0 auto;
	}
	.fr-l {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		gap: 12px;
		margin-top: 24px;
	}
	.fr-i {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 16px;
		color: var(--ink);
		opacity: 0;
		transform: translateY(8px);
	}
	.fr-p.on .fr-i {
		opacity: 1;
		transform: none;
		transition:
			opacity 0.35s calc(0.08s * var(--j)),
			transform 0.35s calc(0.08s * var(--j)),
			border-color 0.25s;
	}
	a.fr-i:hover {
		border-color: #bfe3c2;
	}
	.fr-ck svg {
		width: 22px;
		height: 22px;
		padding: 5px;
		border-radius: 50%;
		background: var(--accent);
	}
	.fr-i b {
		display: block;
		font-size: 15px;
		font-weight: 600;
	}
	.fr-i small {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
		margin-top: 2px;
	}
	.fr-i em {
		margin-left: auto;
		font-style: normal;
		color: var(--muted);
	}
	@media (prefers-reduced-motion: reduce) {
		.fr * {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
