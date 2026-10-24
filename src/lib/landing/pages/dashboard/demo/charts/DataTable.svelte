<!-- A tile's values as a table: the preview's "Datenansicht" (plan 03, 3A.8). -->
<script lang="ts">
	import { formatNumber } from "../../chart";

	let {
		caption,
		labels,
		values,
		previous,
		year,
		unit,
	}: {
		caption: string;
		labels: string[];
		values: number[];
		/** The year before, shown as a third column when given. */
		previous?: number[];
		year: number;
		unit: string;
	} = $props();
</script>

<div class="dt-wrap">
	<table class="dt">
		<caption class="sr-only">{caption}</caption>
		<thead>
			<tr>
				<th scope="col">Monat</th>
				<th scope="col">{year}</th>
				{#if previous}<th scope="col">Vorjahr</th>{/if}
			</tr>
		</thead>
		<tbody>
			{#each values as value, i (i)}
				<tr>
					<th scope="row">{labels[i]}</th>
					<td>{formatNumber(value)} {unit}</td>
					{#if previous}<td>{formatNumber(previous[i])}</td>{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.dt-wrap {
		overflow: auto;
		max-height: 190px;
	}
	.dt {
		width: 100%;
		border-collapse: collapse;
		font-size: 11.5px;
		font-variant-numeric: tabular-nums;
	}
	th,
	td {
		text-align: right;
		padding: 3px 4px;
		border-bottom: 1px solid #f0f1ef;
		font-weight: 400;
	}
	thead th {
		font-weight: 500;
		color: var(--muted);
		border-bottom-color: #e6e8e5;
		position: sticky;
		top: 0;
		background: #fafaf8;
	}
	th:first-child {
		text-align: left;
	}
</style>
