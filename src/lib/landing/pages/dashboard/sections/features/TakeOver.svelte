<!--
  Bento "Bestandszähler übernehmen" (`.mt`): existing and Heidi meters side by
  side; the existing ones' badges swap while the card is hovered (CSS).
-->
<script lang="ts">
	import Icon from "../../components/Icon.svelte";
	import { takeOver } from "../../content";
</script>

<div class="wrap-mt" aria-hidden="true">
	<table class="mt">
		<tbody>
			{#each takeOver.rows as row, i (i)}
				<tr class={[row.source === "bestand" && "sw"]}>
					<td>{row.type}</td>
					<td class="id">{row.unit}</td>
					<td
						><span class={["badge", row.source === "funk" ? "f" : "b"]}
							>{takeOver.badges[row.source]}</span
						></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="note">
		<span class="okb"><Icon name="check" /></span>{takeOver.note}
	</div>
</div>

<style>
	.wrap-mt {
		width: 100%;
	}
	.mt {
		width: 100%;
		font-size: 13.5px;
		border-collapse: collapse;
	}
	td {
		padding: 10px 6px;
		border-bottom: 1px solid #f0f2f1;
		white-space: nowrap;
	}
	td:first-child {
		padding-left: 0;
	}
	td:last-child {
		text-align: right;
		padding-right: 0;
	}
	.id {
		color: var(--faint);
		font-variant-numeric: tabular-nums;
		font-size: 12.5px;
	}
	:global(.bc:hover) .sw .badge {
		animation: swap 2.4s ease-in-out infinite;
	}
	@keyframes swap {
		0%,
		40% {
			opacity: 1;
		}
		50% {
			opacity: 0;
			transform: translateY(-3px);
		}
		60%,
		100% {
			opacity: 1;
			transform: none;
		}
	}
	.note {
		margin-top: 14px;
		font-size: 12.5px;
		color: var(--muted);
		display: flex;
		gap: 8px;
		align-items: flex-start;
	}
	.note :global(.okb) {
		width: 16px;
		height: 16px;
		margin-top: 1px;
	}
	.note :global(.okb svg) {
		width: 10px;
		height: 10px;
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.bc:hover) .sw .badge {
			animation: none;
		}
	}
</style>
