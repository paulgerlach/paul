<!--
  "Jeder Werktag zählt": KPIs (working days, weeks, holidays left), the month
  calendars from the current month to December, and the steps. After the
  deadline only the steps remain.
-->
<script lang="ts">
	import { onMount } from "svelte";
	import { countUp } from "$lib/landing/attachments/countUp";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import SectionHead from "../components/SectionHead.svelte";
	import { timeWindow } from "../content";
	import { calendarMonths, DEADLINE_YEAR } from "../deadline";
	import { getDeadlineClock } from "../clock.svelte";
	import MonthCalendar from "./MonthCalendar.svelte";
	import Steps from "./Steps.svelte";

	const clock = getDeadlineClock();
	const cal = $derived(calendarMonths(clock.today));

	// The days pop in on first view, unless the calendars are already on
	// screen at mount (or reduced motion): then they just stay as rendered.
	let cals = $state<HTMLElement>();
	let pop = $state(false);
	let shown = $state(false);
	onMount(() => {
		if (prefersReducedMotion() || !cals) return;
		if (cals.getBoundingClientRect().top < window.innerHeight) return;
		pop = true;
	});
</script>

<section class="time" aria-labelledby="time-h">
	<div class="wrap">
		<div class="top">
			<div>
				<SectionHead
					id="time-h"
					eyebrow={timeWindow.eyebrow}
					heading={timeWindow.h2}
				>
					{#snippet icon()}
						<rect x="3" y="4" width="14" height="13" rx="2" /><path
							d="M3 8h14M7 2.5v3M13 2.5v3"
						/>
					{/snippet}
				</SectionHead>
			</div>
			{#if !clock.expired}
				<div class="kpis rv">
					<div>
						{#key cal.workdays}
							<b
								{@attach countUp({
									to: cal.workdays,
									duration: 1200,
									viewDelay: 0,
									threshold: 0.15,
								})}>{cal.workdays}</b
							>
						{/key}
						<span>{timeWindow.kpis.workdays}</span>
					</div>
					<div><b>{cal.weeks}</b><span>{timeWindow.kpis.weeks}</span></div>
					<div>
						<b>{cal.holidays}</b><span>{timeWindow.kpis.holidays}</span>
					</div>
				</div>
			{/if}
		</div>
		{#if !clock.expired}
			<div
				class={["cals", pop && "pop", shown && "in"]}
				style:--n={Math.min(3, cal.months.length)}
				bind:this={cals}
				{@attach inView({
					threshold: 0.15,
					once: true,
					onEnter: () => (shown = true),
				})}
			>
				{#each cal.months as month (month.month)}
					<MonthCalendar {month} year={DEADLINE_YEAR} />
				{/each}
			</div>
			<div class="leg rv">
				<span><i class="p"></i>{timeWindow.legend.past}</span>
				<span><i class="t"></i>{timeWindow.legend.today}</span>
				<span><i class="w"></i>{timeWindow.legend.workday}</span>
				<span><i class="h"></i>{timeWindow.legend.holiday}</span>
				<span><i class="x"></i>{timeWindow.legend.deadline}</span>
			</div>
		{/if}
		<Steps />
	</div>
</section>

<style>
	.time {
		background: var(--bg);
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 32px;
		flex-wrap: wrap;
	}
	.kpis {
		display: flex;
		gap: 12px;
	}
	.kpis div {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 16px 20px;
		min-width: 118px;
	}
	.kpis b {
		display: block;
		font-size: 40px;
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.kpis div:first-child {
		background: var(--ink);
		border-color: var(--ink);
		color: #fff;
	}
	.kpis div:first-child b {
		color: var(--accent);
	}
	.kpis span {
		display: block;
		font-size: 13px;
		color: var(--muted);
		margin-top: 8px;
	}
	.kpis div:first-child span {
		color: rgba(255, 255, 255, 0.6);
	}
	.cals {
		display: grid;
		grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr));
		gap: 16px;
		margin-top: 44px;
	}
	.leg {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 22px;
		margin-top: 18px;
		font-size: 13px;
		color: var(--muted);
	}
	.leg span {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.leg i {
		width: 14px;
		height: 14px;
		border-radius: 4px;
		background: #eef5ef;
	}
	.leg i.p {
		background: #e8ebea;
	}
	.leg i.t {
		background: var(--ink);
	}
	.leg i.h {
		background: #fbe3dc;
	}
	.leg i.x {
		background: var(--accent);
		box-shadow: 0 0 0 1.5px var(--ink);
	}
	@media (max-width: 760px) {
		.cals {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.kpis {
			width: 100%;
		}
		.kpis div {
			flex: 1;
			min-width: 0;
			padding: 14px;
		}
		.kpis b {
			font-size: 30px;
		}
	}
</style>
