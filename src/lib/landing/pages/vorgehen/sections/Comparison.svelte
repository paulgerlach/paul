<!--
  "Mit Heidi oder klassisch ablesen?" as a real table (the design draws a
  div grid). ✓ and – carry screen-reader texts; the Heidi column is dark with
  rounded head and foot.
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

<section class="sec" aria-labelledby="vg-cmp-h">
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
			</table>
		</div>
	</div>
</section>

<style>
	.sec {
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
	thead td,
	tbody th {
		width: 39%;
	}
	thead th {
		padding: 16px 12px;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
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
	tbody tr:last-child th {
		border-bottom: 0;
	}
	tbody tr:last-child td {
		border-bottom: 0;
		border-radius: 0 0 14px 14px;
		padding-bottom: 22px;
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
			width: 36%;
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
