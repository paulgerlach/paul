<!--
  "Welche Daten wo liegen" (.sc-tb): six kinds of data, each a disclosure row
  (name, purpose, location) that opens to a short explanation (plan README,
  Table rows: `<details>`, so it works without JS). The location checks pop
  in once when the table scrolls into view (plan 03 §3.5).
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import Icon from "../components/Icon.svelte";
	import { DATA_ID, table } from "../content";

	let shown = $state(true);
</script>

<section class="pg-sec data" id={DATA_ID} aria-labelledby="sc-dh">
	<div class="wrap">
		<h2 class="head rv" id="sc-dh">{table.h2}</h2>
		<p class="sub rv">{table.lead}</p>
		<div
			class={["tb rv", shown && "in"]}
			{@attach enterView({
				prepare: () => (shown = false),
				play: () => void (shown = true),
				threshold: 0.15,
			})}
		>
			<div class="row hd" aria-hidden="true">
				{#each table.columns as column (column)}<span>{column}</span>{/each}
			</div>
			{#each table.rows as row, i (row.name)}
				<details>
					<summary class="row">
						<span class="n">
							<span class="ic"><Icon name={row.icon} /></span>
							<b>{row.name}</b>
						</span>
						<span class="w">{row.purpose}</span>
						<span class="loc">
							<em style:transition-delay="{0.15 + i * 0.12}s" aria-hidden="true"
								><svg viewBox="0 0 12 10" width="11"
									><path
										d="M1 5.2l3.2 3L11 1.5"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								></em
							><span class="sr-only"
								>{table.locationLabel}
							</span>{table.location}
						</span>
						<span class="ch" aria-hidden="true"
							><svg width="12" viewBox="0 0 10 6"
								><path
									d="M1 1l4 4 4-4"
									stroke="currentColor"
									fill="none"
									stroke-width="1.5"
								/></svg
							></span
						>
					</summary>
					<p class="d">{row.detail}</p>
				</details>
			{/each}
		</div>
	</div>
</section>

<style>
	.data {
		scroll-margin-top: 64px;
	}
	.tb {
		max-width: 1060px;
		margin: 44px auto 0;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		overflow: hidden;
		interpolate-size: allow-keywords;
	}
	.row {
		display: grid;
		grid-template-columns: 1.2fr 1.3fr 150px 28px;
		gap: 14px;
		align-items: center;
		padding: 16px 24px;
	}
	.hd {
		font-size: 12.5px;
		color: var(--muted);
		padding-block: 14px;
		background: #fafaf9;
	}
	details {
		border-top: 1px solid #eff0ef;
		transition: background 0.2s;
	}
	details:hover {
		background: #fafbfa;
	}
	summary {
		list-style: none;
		cursor: pointer;
	}
	/* The design's closed detail still takes a grid row and its gap. */
	summary.row {
		padding-bottom: 30px;
	}
	details[open] summary.row {
		padding-bottom: 18px;
	}
	/* Inside the row: the card's overflow would clip it. */
	summary:focus-visible {
		outline-offset: -2px;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.n {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.n b {
		font-weight: 600;
		font-size: 15px;
	}
	.ic {
		width: 34px;
		height: 34px;
		border-radius: 9px;
		background: #f2f4f3;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ic :global(svg) {
		width: 16px;
		height: 16px;
	}
	.w {
		color: var(--muted);
		font-size: 14px;
	}
	.loc {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 13.5px;
		font-weight: 500;
		color: var(--ok);
	}
	.loc em {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #e3f3e4;
		display: grid;
		place-items: center;
		transform: scale(0);
		transition: transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.in .loc em {
		transform: scale(1);
	}
	.ch {
		color: var(--faint);
		transition: transform 0.25s;
		justify-self: end;
		display: flex;
	}
	details[open] .ch {
		transform: rotate(180deg);
	}
	.d {
		margin: 0;
		padding: 0 24px 16px 70px;
		max-width: calc(80ch + 94px);
		color: var(--muted);
		font-size: 14.5px;
		line-height: 1.55;
	}
	/* The design's height transition, where the browser can animate it. */
	details::details-content {
		block-size: 0;
		overflow: hidden;
		transition:
			block-size 0.35s ease,
			content-visibility 0.35s allow-discrete;
	}
	details[open]::details-content {
		block-size: auto;
	}
	@media (max-width: 900px) {
		.row {
			grid-template-columns: 1fr auto 20px;
			padding: 14px 16px;
		}
		summary.row {
			padding-bottom: 28px;
		}
		.w,
		.hd span:nth-child(2) {
			display: none;
		}
		.d {
			padding: 0 16px 16px;
		}
		.n {
			min-width: 0;
		}
		.n b {
			min-width: 0;
			hyphens: auto;
			overflow-wrap: anywhere;
			font-size: 14.5px;
		}
		.loc {
			font-size: 12.5px;
			gap: 5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.loc em,
		.ch,
		details::details-content {
			transition: none;
		}
	}
</style>
