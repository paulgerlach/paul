<!--
  "Mit Heidi oder klassisch ablesen?" as a real table (the design draws a
  div grid). ✓ and – carry screen-reader texts; the Heidi column is dark with
  rounded head and foot (the design's empty foot row, hidden from readers).
-->
<script lang="ts">
	import Head from "../components/Head.svelte";
	import { comparison, type CompareValue } from "../content";
</script>

{#snippet value(v: CompareValue)}
	{#if v === true}
		<span class="y"
			><svg viewBox="0 0 12 10" width="10" aria-hidden="true"
				><path
					d="M1 5l3.5 3.5L11 1"
					stroke="#1E322D"
					stroke-width="2"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/></svg
			><span class="vh">{comparison.yes}</span></span
		>
	{:else if v === false}
		<span class="x" aria-hidden="true">–</span><span class="vh"
			>{comparison.no}</span
		>
	{:else}
		<span class="v">{v}</span>
	{/if}
{/snippet}

<section class="blk" aria-labelledby="vg-cmp-h">
	<div class="wrap">
		<Head
			id="vg-cmp-h"
			eyebrow={comparison.eyebrow}
			title={comparison.h2}
			center
		/>
		<div class="cmp rv">
			<table>
				<caption class="vh">{comparison.caption}</caption>
				<thead>
					<tr>
						<td></td>
						<th scope="col" class="hi">{comparison.heads.heidi}</th>
						<th scope="col">{comparison.heads.classic}</th>
					</tr>
				</thead>
				<tbody>
					{#each comparison.rows as row (row.label)}
						<tr>
							<th scope="row">{row.label}</th>
							<td class="hi">{@render value(row.heidi)}</td>
							<td>{@render value(row.classic)}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot aria-hidden="true">
					<tr><td></td><td class="hi"></td><td></td></tr>
				</tfoot>
			</table>
		</div>
	</div>
</section>

<style>
	.blk {
		padding-top: clamp(72px, 9vw, 128px);
	}
	.wrap {
		max-width: 1280px;
	}
	.cmp {
		max-width: 960px;
		margin: 48px auto 0;
	}
	table {
		/* 12 px between the columns; the negative margin drops the outer ones */
		width: calc(100% + 24px);
		margin-inline: -12px;
		border-collapse: separate;
		border-spacing: 12px 0;
		table-layout: fixed;
	}
	/* The design's 1.3fr : 1fr : 1fr */
	thead td,
	tbody th {
		width: calc(1.3 / 3.3 * 100%);
	}
	thead td {
		border-bottom: 1px solid var(--hair);
	}
	thead th {
		padding: 16px 12px;
		text-align: center;
		vertical-align: top;
		font-size: 13px;
		font-weight: 600;
		border-radius: 14px 14px 0 0;
		background: var(--soft);
		color: var(--muted);
	}
	thead th.hi {
		background: var(--ink);
		color: #fff;
	}
	thead th.hi::before {
		content: "";
		display: block;
		width: 34px;
		height: 4px;
		border-radius: 2px;
		background: var(--accent);
		margin: 0 auto 10px;
	}
	tbody th {
		padding: 14px 0;
		font-size: 15px;
		font-weight: 400;
		text-align: left;
		border-bottom: 1px solid var(--hair);
		/* "Verbrauchsinformation" is wider than the column at 375 px */
		hyphens: auto;
		overflow-wrap: break-word;
	}
	tbody td {
		padding: 12px;
		text-align: center;
		vertical-align: middle;
		background: var(--soft);
		border-bottom: 1px solid #e6e9e7;
	}
	tbody td.hi {
		background: var(--ink);
		border-bottom-color: rgba(255, 255, 255, 0.08);
	}
	/* The design's empty foot row: rounded bottoms */
	tfoot td {
		padding: 10px;
	}
	tfoot td:first-child {
		padding: 14px 0;
	}
	tfoot td + td {
		background: var(--soft);
		border-radius: 0 0 14px 14px;
	}
	tfoot td.hi {
		background: var(--ink);
	}
	.y {
		width: 26px;
		height: 26px;
		border-radius: 7px;
		background: var(--accent);
		display: inline-grid;
		place-items: center;
		vertical-align: middle;
	}
	.y svg {
		width: 13px;
		height: 13px;
	}
	td:not(.hi) .y {
		background: #dde7de;
	}
	.x {
		color: var(--faint);
		font-size: 18px;
	}
	.v {
		font-size: 13.5px;
		color: var(--muted);
	}
	.hi .v {
		color: #fff;
	}
	.vh {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	@media (max-width: 560px) {
		thead td,
		tbody th {
			width: calc(1.2 / 3.2 * 100%);
		}
		thead th {
			padding: 14px 6px;
			font-size: 12px;
		}
		tbody th {
			font-size: 14px;
		}
		tbody td {
			padding: 12px 6px;
		}
	}
</style>
