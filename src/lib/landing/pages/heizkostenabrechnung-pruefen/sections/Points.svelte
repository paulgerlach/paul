<!-- The checked points (.mc-lines): mark, title, text with its law, the amount; `full` drops the height limit (the paywall's .pw-lines). -->
<script lang="ts">
	import { MARKS, pointFigure, type Point } from "../rules";

	let {
		points,
		hasHeating,
		full = false,
	}: { points: Point[]; hasHeating: boolean; full?: boolean } = $props();
</script>

<ul class={["lines", full && "full"]}>
	{#each points as point, i (i)}
		{@const figure = pointFigure(point, hasHeating)}
		<li class={point.status} style:animation-delay="{i * 60}ms">
			<i aria-hidden="true">{MARKS[point.status]}</i>
			<span
				><b>{point.title}</b><small>{point.text} <em>{point.law}</em></small
				></span
			>
			{#if figure}<span class="amt">{figure}</span>{/if}
		</li>
	{/each}
</ul>

<style>
	.lines {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
		max-height: 330px;
		overflow: auto;
	}
	.full {
		max-height: none;
	}
	li {
		display: grid;
		grid-template-columns: 24px minmax(0, 1fr) auto;
		gap: 10px;
		align-items: start;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 11px 12px;
		animation: mc-in 0.4s both;
	}
	@keyframes mc-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	li > i {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-style: normal;
		font-size: 13px;
		font-weight: 700;
	}
	.fail > i {
		background: #fbe4da;
		color: #b5471a;
	}
	.warn > i {
		background: #fff4e5;
		color: #9a5b00;
	}
	.ok > i {
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.info > i {
		background: #eef1f6;
		color: #3f5fae;
	}
	b {
		display: block;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.3;
	}
	small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		margin-top: 2px;
		line-height: 1.4;
	}
	em {
		font-style: normal;
		color: var(--faint);
	}
	.amt {
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
		color: #2f7a3c;
	}
</style>
