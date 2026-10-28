<!--
  "Wann können Sie wechseln?" (the design's .awp#planer): the contract's end
  (month and year) and the notice period, then the three figures, the
  timeline and the summary, all from the pure `plan()` for the Berlin day of
  the page's `DeadlineClock` (never `Date.now()` here). The server renders the
  start values' result; without JS the inputs are hidden. The summary is a
  polite live region; the timeline is decorative.
-->
<script lang="ts">
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { MONTHS } from "$lib/landing/deadline/deadline";
	import { todayOf } from "$lib/landing/pages/fristenrechner/fristen";
	import { PLANNER_ID, planner as T } from "../content";
	import { plan, yearOptions } from "../planner";

	const clock = getDeadlineClock();
	const today = $derived(todayOf(clock.today));
	const years = $derived(yearOptions(today, T.years));

	let month = $state(T.start.month);
	// Two years on from the year the page was rendered in.
	let year = $state(
		new Date(todayOf(clock.today)).getUTCFullYear() + T.start.yearsAhead,
	);
	let notice = $state(T.start.notice);

	const result = $derived(plan({ month, year, notice }, today));
</script>

<section class="awp" id={PLANNER_ID} aria-labelledby="mw-plan-h">
	<div class="wrap">
		<div class="head">
			<span class="pill">{T.pill}</span>
			<h2 id="mw-plan-h">{T.h2.text}<br /><span>{T.h2.muted}</span></h2>
			<p>{T.lead}</p>
		</div>
		<div class="card">
			<div class="in">
				<div class="field" role="group" aria-labelledby="mw-plan-end">
					<span id="mw-plan-end">{T.endLabel}</span>
					<div class="row">
						<select bind:value={month} aria-label={T.monthLabel}>
							{#each MONTHS as name, i (i)}<option value={i}>{name}</option
								>{/each}
						</select>
						<select bind:value={year} aria-label={T.yearLabel}>
							{#each years as y (y)}<option value={y}>{y}</option>{/each}
						</select>
					</div>
				</div>
				<div class="field">
					<span>{T.noticeLabel}</span>
					<Segmented
						class="notice"
						options={T.notices}
						bind:value={notice}
						label={T.noticeLabel}
					/>
				</div>
			</div>
			<div class="out">
				<div class="k">
					<small>{T.by.label}</small>
					<b>{result.by}</b>
					<em class={[result.late && "late"]}
						>{result.late
							? T.by.late
							: T.by.left.replace("{n}", String(result.daysLeft))}</em
					>
				</div>
				<div class="k">
					<small>{T.heidi.label}</small>
					<b>{T.heidi.value}</b>
					<em>{T.heidi.note}</em>
				</div>
				<div class="k">
					<small>{T.mount.label}</small>
					<b>{result.mount}</b>
					<em>{T.mount.note}</em>
				</div>
			</div>
			<div class="tl" aria-hidden="true">
				<div class="bar old" style:width="{result.timeline.end}%">
					<span>{T.timeline.old}</span>
				</div>
				<div
					class="bar heidi"
					style:left="{result.timeline.now}%"
					style:width="{100 - result.timeline.now}%"
				>
					<span>{T.timeline.heidi}</span>
				</div>
				<i class="now" style:left="{result.timeline.now}%"
					><span>{T.timeline.now}</span></i
				><i class="by" style:left="{result.timeline.by}%"
					><span>{T.timeline.by}</span></i
				><i class="end" style:left="{result.timeline.end}%"
					><span>{T.timeline.end}</span></i
				>
			</div>
			<p class="msg" aria-live="polite">
				{T.message.start}<b>{T.message.today}</b>{T.message.middle}<b
					>{result.by}</b
				>{T.message.beforeEnd}<b>{result.mount}</b>{T.message.end}
			</p>
		</div>
	</div>
</section>

<style>
	.awp {
		padding: 110px 0;
		background: #f6f7f6;
		color: var(--ink);
		scroll-margin-top: 72px;
	}
	.head {
		max-width: 760px;
	}
	.pill {
		display: inline-flex;
		background: #fff;
		border: 1px solid #e1e5e3;
		border-radius: 999px;
		padding: 6px 14px;
		font-size: 14px;
	}
	.head h2 {
		font-size: clamp(34px, 4vw, 56px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1.05;
		margin-top: 20px;
	}
	.head h2 span {
		color: #7a8783;
	}
	.head p {
		color: #5b6b66;
		font-size: 17px;
		line-height: 1.55;
		margin-top: 16px;
		max-width: 56ch;
	}
	.card {
		margin-top: 44px;
		background: #fff;
		border: 1px solid #e1e5e3;
		border-radius: 22px;
		padding: clamp(20px, 3vw, 36px);
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.35);
	}
	.in {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}
	.field {
		display: grid;
		gap: 8px;
		font-size: 13.5px;
		font-weight: 600;
	}
	.row {
		display: flex;
		gap: 8px;
	}
	select {
		flex: 1;
		font: inherit;
		font-size: 15px;
		font-weight: 500;
		color: var(--ink);
		border: 1px solid #dce2df;
		border-radius: 10px;
		padding: 11px 12px;
		background: #fff;
	}
	/* .awp-seg */
	.field :global(.seg.notice) {
		display: flex;
		background: #eef1ef;
		border-radius: 12px;
		padding: 4px;
		gap: 4px;
	}
	.field :global(.seg.notice button) {
		flex: 1;
		font-size: 14.5px;
		font-weight: 500;
		color: #5b6b66;
		padding: 9px 10px;
		border-radius: 9px;
	}
	.field :global(.seg.notice button.on) {
		background: #fff;
		color: var(--ink);
		box-shadow: 0 1px 3px rgba(30, 50, 45, 0.15);
	}
	.out {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin-top: 24px;
	}
	.k {
		background: #f6f7f6;
		border-radius: 16px;
		padding: 18px;
	}
	.k:first-child {
		background: var(--ink);
		color: #fff;
	}
	.k small {
		display: block;
		font-size: 12.5px;
		color: #7a8783;
	}
	.k:first-child small {
		color: rgba(255, 255, 255, 0.6);
	}
	.k b {
		display: block;
		font-size: clamp(24px, 2.4vw, 32px);
		font-weight: 500;
		letter-spacing: -0.03em;
		margin-top: 6px;
		font-variant-numeric: tabular-nums;
	}
	.k:first-child b {
		color: var(--accent);
	}
	.k em {
		display: block;
		font-style: normal;
		font-size: 13px;
		color: #5b6b66;
		margin-top: 4px;
	}
	.k:first-child em {
		color: rgba(255, 255, 255, 0.7);
	}
	.k em.late {
		color: #f4b37a;
	}
	.tl {
		position: relative;
		height: 120px;
		margin-top: 30px;
	}
	.bar {
		position: absolute;
		height: 34px;
		border-radius: 999px;
		display: flex;
		align-items: center;
		padding: 0 14px;
		font-size: 13px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		transition:
			left 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			width 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.bar.old {
		top: 28px;
		left: 0;
		background: repeating-linear-gradient(
			135deg,
			#eceeed 0 6px,
			#f4f5f4 6px 12px
		);
		border: 1px solid #e1e5e3;
		color: #7a8783;
	}
	.bar.heidi {
		top: 72px;
		background: var(--accent);
		color: var(--ink);
	}
	.tl i {
		position: absolute;
		top: 18px;
		bottom: 0;
		width: 0;
		border-left: 2px solid var(--ink);
		transition: left 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.tl i span {
		position: absolute;
		top: -22px;
		left: 0;
		transform: translateX(-50%);
		font-style: normal;
		font-size: 11px;
		font-weight: 600;
		border-radius: 999px;
		padding: 2px 9px;
		white-space: nowrap;
		background: var(--ink);
		color: #fff;
	}
	.tl .now {
		border-color: #c2410c;
	}
	.tl .now span {
		background: #c2410c;
	}
	.tl .by {
		border-left-style: dashed;
		border-color: #8a5410;
	}
	.tl .by span {
		background: #fbefdf;
		color: #8a5410;
		transform: translateX(calc(-100% - 6px));
	}
	.tl .end span {
		transform: translateX(6px);
	}
	.msg {
		margin-top: 16px;
		font-size: 14.5px;
		line-height: 1.5;
		color: #5b6b66;
	}
	.msg b {
		color: var(--ink);
	}
	@media (prefers-reduced-motion: reduce) {
		.bar,
		.tl i {
			transition: none;
		}
	}
	/* Without JS the inputs can't change anything: the start values' plan. */
	@media (scripting: none) {
		.in {
			display: none;
		}
		.out {
			margin-top: 0;
		}
	}
	@media (max-width: 760px) {
		.in,
		.out {
			grid-template-columns: 1fr;
		}
		.tl {
			display: none;
		}
	}
</style>
