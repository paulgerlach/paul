<!--
  "Alle Verbräuche einer Wohnung als Übersicht": WAI-ARIA tabs (vertical
  tablist, automatic activation) on the left, the example view of the chosen
  tab on the right. The server renders tab 1.

  Auto-advance through the shared `AutoTabs` (plan 03 §3.2): every 6 s while
  the block is in view, the browser tab is visible and the pointer and focus
  are outside it; choosing a tab stops it for good and leaves the active
  tab's bar full, as in the design. Each panel's entry (bars, ticks, chip)
  plays when it becomes active (CSS on `.on`).
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { AutoTabs } from "$lib/landing/autoTabs.svelte";
	import IconPaths from "../components/IconPaths.svelte";
	import Section from "../components/Section.svelte";
	import { dashboard } from "../content";

	const tabs = new AutoTabs({
		count: dashboard.tabs.length,
		intervalMs: dashboard.intervalMs,
		threshold: 0.15,
		tabId: (i) => `fk-tab-${i}`,
	});
	const panels = [
		dashboard.usage.title,
		dashboard.analysis.title,
		dashboard.billing.title,
	];
</script>

<Section alt labelledby="fk-dashboard-h">
	<div class="head">
		<SectionHead
			id="fk-dashboard-h"
			eyebrow={dashboard.eyebrow}
			heading={dashboard.h2}
		>
			{#snippet icon()}<IconPaths name={dashboard.eyebrowIcon} />{/snippet}
		</SectionHead>
	</div>
	<div class="tabs" {@attach tabs.attach}>
		<div
			class="tl"
			role="tablist"
			aria-orientation="vertical"
			aria-label={dashboard.label}
			tabindex="-1"
			onkeydown={tabs.onkeydown}
		>
			{#each dashboard.tabs as tab, i (tab.title)}
				{@const on = i === tabs.active}
				<button
					type="button"
					role="tab"
					id="fk-tab-{i}"
					aria-controls="fk-panel-{i}"
					aria-selected={on}
					tabindex={on ? 0 : -1}
					class={[on && "on"]}
					onclick={() => tabs.select(i)}
				>
					<b>{tab.title}</b>
					<span>{tab.text}</span>
					{#if on && tabs.running}
						{#key tabs.active}
							<i
								class="bar run"
								aria-hidden="true"
								style:--interval="{dashboard.intervalMs}ms"
							></i>
						{/key}
					{:else if on && !tabs.auto}
						<i class="bar full" aria-hidden="true"></i>
					{/if}
				</button>
			{/each}
		</div>

		<div class="tv rv">
			{#each panels as title, i (title)}
				<div
					class={["p", i === tabs.active && "on"]}
					role="tabpanel"
					id="fk-panel-{i}"
					aria-labelledby="fk-tab-{i}"
					inert={i !== tabs.active}
				>
					<div class="pt">
						<b>{title}</b>
						<span class="tag">{dashboard.tag}</span>
					</div>
					{#if i === 0}
						<ul class="rows">
							{#each dashboard.usage.rows as row (row.label)}
								<li>
									<span>{row.label}</span>
									<i style:--w="{row.share}%" aria-hidden="true"></i>
									<b>{row.value}</b>
								</li>
							{/each}
						</ul>
					{:else if i === 1}
						<ul class="an">
							{#each dashboard.analysis.rows as row (row.name)}
								<li class={[row.up && "hot"]}>
									<span>{row.name}</span>
									<em class={row.up ? "up" : "dn"}>{row.delta}</em>
									{#if row.note}<small>{row.note}</small>{/if}
								</li>
							{/each}
						</ul>
					{:else}
						<ol class="bk">
							{#each dashboard.billing.steps as step (step)}
								<li><span class="tick"><Check /></span>{step}</li>
							{/each}
						</ol>
						<p class="go">
							<span class="tick"><Check /></span>{dashboard.billing.result}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</Section>

<style>
	.head {
		max-width: 760px;
	}
	.tabs {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: 40px;
		margin-top: 52px;
		align-items: center;
	}
	.tl {
		display: grid;
		gap: 10px;
	}
	.tl:focus {
		outline: none;
	}
	.tl button {
		position: relative;
		text-align: left;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 16px;
		padding: 20px 22px;
		font: inherit;
		color: var(--ink);
		cursor: pointer;
		overflow: hidden;
		transition:
			border-color 0.3s,
			box-shadow 0.3s;
	}
	.tl button b {
		display: block;
		font-size: 17px;
		font-weight: 600;
	}
	.tl button span {
		display: block;
		font-size: 14.5px;
		color: var(--muted);
		margin-top: 6px;
		line-height: 1.45;
	}
	.tl button.on {
		border-color: #bfe3c2;
		box-shadow: 0 18px 34px -26px rgba(30, 50, 45, 0.45);
	}
	.bar {
		position: absolute;
		left: 0;
		bottom: 0;
		height: 3px;
		width: 0;
		background: var(--accent);
	}
	.bar.run {
		animation: fk-bar var(--interval) linear forwards;
	}
	.bar.full {
		width: 100%;
	}
	@keyframes fk-bar {
		to {
			width: 100%;
		}
	}

	/* The view: panels in one grid cell, so it's as tall as the tallest. */
	.tv {
		display: grid;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 24px;
		min-height: 330px;
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.35);
	}
	.p {
		grid-area: 1 / 1;
		opacity: 0;
		visibility: hidden;
		transform: translateY(8px);
		transition:
			opacity 0.45s,
			transform 0.45s,
			visibility 0s 0.45s;
	}
	.p.on {
		opacity: 1;
		visibility: visible;
		transform: none;
		transition:
			opacity 0.45s,
			transform 0.45s;
	}
	.pt {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		margin-bottom: 20px;
	}
	.pt b {
		font-size: 15.5px;
	}
	.tag {
		display: inline-flex;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	ul,
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.rows {
		display: grid;
		gap: 16px;
	}
	.rows li {
		display: grid;
		grid-template-columns: 110px minmax(0, 1fr) 72px;
		gap: 14px;
		align-items: center;
		font-size: 14.5px;
	}
	.rows span {
		color: var(--muted);
	}
	.rows b {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.rows i {
		display: block;
		height: 12px;
		border-radius: 6px;
		background: #eef1ef;
		position: relative;
		overflow: hidden;
	}
	.rows i::after {
		content: "";
		position: absolute;
		inset: 0 auto 0 0;
		width: 0;
		background: #1e322d;
		border-radius: 6px;
		transition: width 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.rows li:first-child i::after {
		background: var(--accent);
	}
	.p.on .rows i::after {
		width: var(--w);
	}

	.an {
		display: grid;
		gap: 8px;
	}
	.an li {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 4px 10px;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 12px 14px;
		font-size: 14.5px;
	}
	.an em {
		font-style: normal;
		font-weight: 600;
		font-size: 13px;
		border-radius: 999px;
		padding: 2px 9px;
	}
	.an .dn {
		background: #e6f5e7;
		color: #245f33;
	}
	.an .up {
		background: #fbefdf;
		color: #8a5410;
	}
	.an .hot {
		border-color: #f0d3a8;
		background: #fffaf2;
	}
	.an small {
		grid-column: 1 / -1;
		font-size: 12.5px;
		color: #8a5410;
	}

	.bk {
		display: grid;
		gap: 10px;
	}
	.bk li {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 15px;
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.tick {
		display: grid;
		place-items: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #e3f3e4;
		flex: none;
	}
	.tick :global(svg) {
		width: 10px;
	}
	.p.on .bk li {
		opacity: 1;
		transform: none;
	}
	.p.on .bk li:nth-child(2) {
		transition-delay: 0.25s;
	}
	.p.on .bk li:nth-child(3) {
		transition-delay: 0.5s;
	}
	.p.on .bk li:nth-child(4) {
		transition-delay: 0.75s;
	}
	.go {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 22px;
		background: var(--accent);
		font-weight: 600;
		border-radius: 10px;
		padding: 11px 16px;
		font-size: 14.5px;
		opacity: 0;
		transform: scale(0.9);
		transition:
			opacity 0.4s 1s,
			transform 0.5s 1s cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	.go .tick {
		width: auto;
		height: auto;
		background: none;
	}
	.go .tick :global(svg) {
		width: 12px;
	}
	.p.on .go {
		opacity: 1;
		transform: none;
	}

	@media (max-width: 1040px) {
		.tabs {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 720px) {
		.rows li {
			grid-template-columns: 90px minmax(0, 1fr) 64px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.p,
		.p.on,
		.bk li,
		.go,
		.rows i::after {
			transition: none;
		}
	}
</style>
