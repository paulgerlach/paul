<!-- One month grid of the time window: past days, today, weekends, holidays, the deadline. -->
<script lang="ts">
	import { timeWindow } from "../content";
	import type { CalendarMonth } from "../deadline";

	let { month, year }: { month: CalendarMonth; year: number } = $props();
	const headingId = $derived(`cal-${month.month}`);
</script>

<div class="cal" role="group" aria-labelledby={headingId}>
	<h3 id={headingId}>
		{month.name}
		{year}<small>{timeWindow.workdaysLeft(month.workdays)}</small>
	</h3>
	<div class="w" aria-hidden="true">
		{#each timeWindow.weekdays as day (day)}<span>{day}</span>{/each}
	</div>
	<div class="g">
		{#each { length: month.offset }, i (i)}<span class="d e"></span>{/each}
		{#each month.days as d (d.day)}
			<span
				class={[
					"d",
					d.weekend && "we",
					d.holiday && "h",
					d.past && "p",
					d.today && "t",
					d.deadline && "x",
				]}
				style:--i={d.index}
				title={d.title}
				aria-label={d.label}>{d.day}</span
			>
		{/each}
	</div>
</div>

<style>
	.cal {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 20px 20px 22px;
	}
	h3 {
		font-size: 16px;
		font-weight: 600;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	small {
		font-size: 13px;
		font-weight: 500;
		color: var(--muted);
	}
	.w,
	.g {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: 5px;
	}
	.w {
		margin-top: 14px;
		font-size: 11px;
		color: var(--faint);
		text-align: center;
		font-weight: 500;
	}
	.g {
		margin-top: 6px;
	}
	.d {
		aspect-ratio: 1;
		border-radius: 7px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
		background: #eef5ef;
	}
	/* Pop in when the calendars come into view (the parent sets .pop). */
	:global(.pop) .d {
		opacity: 0;
		transform: scale(0.6);
	}
	:global(.pop.in) .d {
		animation: pop 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
		animation-delay: calc(var(--i, 0) * 8ms);
	}
	@keyframes pop {
		to {
			opacity: 1;
			transform: none;
		}
	}
	.d.e {
		background: none;
	}
	.d.we {
		background: none;
		color: #b4bdb9;
	}
	.d.p {
		background: #e8ebea;
		color: #a9b2ae;
		text-decoration: line-through;
		text-decoration-color: #c2c9c6;
	}
	.d.p.we {
		background: none;
	}
	.d.h {
		background: #fbe3dc;
		color: #c2563d;
		font-weight: 600;
	}
	.d.t {
		background: var(--ink);
		color: var(--accent);
		font-weight: 700;
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.45);
	}
	.d.x {
		background: var(--accent);
		color: var(--ink);
		font-weight: 700;
		box-shadow: 0 0 0 2px var(--ink);
	}
</style>
