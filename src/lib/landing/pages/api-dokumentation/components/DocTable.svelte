<!-- The design's table (.ad-tbl): a frame that scrolls sideways (focusable, named), the head row and the rows. -->
<script lang="ts">
	import { copy, type Table } from "../content";
	import Rich from "./Rich.svelte";

	let { table, title }: { table: Table; title: string } = $props();
</script>

<!-- A scrolling region needs focus to scroll by keyboard. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="tbl" role="region" aria-label={copy.tableLabel(title)} tabindex="0">
	<table>
		<thead>
			<tr>
				{#each table.head as cell (cell)}
					<th>{cell}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each table.rows as row, r (r)}
				<tr>
					{#each row as cell, c (c)}
						<td><Rich text={cell} /></td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.tbl {
		margin-top: 20px;
		border: 1px solid var(--hair);
		border-radius: 14px;
		overflow: auto;
		background: #fff;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14.5px;
		min-width: 520px;
	}
	th {
		text-align: left;
		font-weight: 500;
		color: var(--muted);
		font-size: 13px;
		background: #f6f7f6;
		padding: 11px 16px;
		border-bottom: 1px solid var(--hair);
	}
	td {
		padding: 12px 16px;
		border-bottom: 1px solid var(--hair);
		vertical-align: top;
		line-height: 1.5;
	}
	tr:last-child td {
		border-bottom: 0;
	}
</style>
