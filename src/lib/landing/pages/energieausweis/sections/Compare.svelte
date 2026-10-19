<!--
  "Zwei Ausweise, zwei Grundlagen." (.pg-sec, .ea-vs): the design's grid of
  rows, read as a table (ARIA roles). At 640 px the label sits above its two
  cells.
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { compare } from "../content";
</script>

<section class="pg-sec cmp" aria-labelledby="ea-vb-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="ea-vb-h" eyebrow={compare.pill} heading={compare.h2}>
				{#snippet icon()}
					<path d="M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3" />
				{/snippet}
			</SectionHead>
		</div>
		<div class="vs rv" role="table" aria-label={compare.label}>
			<div class="vh" role="row">
				<span role="columnheader"></span>
				<b role="columnheader">{compare.columns.v}</b>
				<b role="columnheader" class="d">{compare.columns.b}</b>
			</div>
			{#each compare.rows as row (row.label)}
				<div class="vr" role="row">
					<span role="rowheader">{row.label}</span>
					<div class="c" role="cell">
						{#if row.strong}<b>{row.v}</b>{:else}{row.v}{/if}
					</div>
					<div class="c" role="cell">
						{#if row.strong}<b>{row.b}</b>{:else}{row.b}{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.head {
		max-width: 760px;
	}
	/* The landing heading reset takes SectionHead's 18 px top margin. */
	.cmp :global(h2) {
		margin-top: 18px;
	}
	.vs {
		margin-top: 40px;
		border: 1px solid var(--hair);
		border-radius: 20px;
		overflow: hidden;
	}
	.vh,
	.vr {
		display: grid;
		grid-template-columns: 220px minmax(0, 1fr) minmax(0, 1fr);
	}
	.vh {
		background: var(--bg);
		border-bottom: 1px solid var(--hair);
	}
	.vh b {
		padding: 16px 20px;
		font-size: 16px;
	}
	.vh b.d {
		background: var(--ink);
		color: #fff;
	}
	.vr {
		border-bottom: 1px solid var(--hair);
	}
	.vr:last-child {
		border-bottom: 0;
	}
	.vr > span {
		padding: 16px 20px;
		font-size: 13px;
		font-weight: 600;
		color: var(--muted);
		background: #fafbfa;
	}
	.vr .c {
		padding: 16px 20px;
		font-size: 14.5px;
		line-height: 1.5;
	}
	.vr .c + .c {
		background: #f7f9f8;
	}
	@media (max-width: 640px) {
		.vh,
		.vr {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}
		.vh span {
			display: none;
		}
		.vr > span {
			grid-column: 1 / -1;
			padding: 10px 14px 4px;
			background: none;
		}
		.vr .c {
			padding: 4px 14px 12px;
			font-size: 13.5px;
		}
		.vr .c + .c {
			background: none;
		}
		.vh b {
			padding: 12px 14px;
			font-size: 14px;
		}
	}
</style>
