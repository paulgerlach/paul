<!--
  Pane "Vertrag" (calcV): start, term, renewal and notice give the last day
  to cancel, the next possible end and the timeline from today to that end.
  An empty or invalid start keeps the last result.
-->
<script lang="ts">
	import { untrack } from "svelte";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { calculator } from "../content";
	import {
		contract,
		daysBadge,
		defaults,
		formatDate,
		parseIso,
		timelineAnchor,
		todayOf,
	} from "../fristen";
	import Result from "./Result.svelte";

	const c = calculator.contract;
	const clock = getDeadlineClock();
	const today = $derived(todayOf(clock.today));
	const initial = defaults(untrack(() => today)).contractStart;

	let start = $state(parseIso(initial)!);
	let term = $state(c.term.default);
	let renewal = $state(c.renewal.default);
	let notice = $state(c.notice.default);

	const result = $derived(contract({ start, term, renewal, notice }, today));
	const anchor = $derived(timelineAnchor(result.progress));

	function onStart(event: Event & { currentTarget: HTMLInputElement }) {
		const value = parseIso(event.currentTarget.value);
		if (value !== null) start = value;
	}
</script>

<div class="f2">
	<label
		><span>{c.start}</span><input
			type="date"
			value={initial}
			oninput={onStart}
			onchange={onStart}
		/></label
	>
	<label
		><span>{c.term.label}</span><select bind:value={term}>
			{#each c.term.options as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</select></label
	>
	<label
		><span>{c.renewal.label}</span><select bind:value={renewal}>
			{#each c.renewal.options as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</select></label
	>
	<label
		><span>{c.notice.label}</span><select bind:value={notice}>
			{#each c.notice.options as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</select></label
	>
</div>
<div class="res" aria-live="polite">
	<Result
		label={c.result}
		value={formatDate(result.cancelBy)}
		badge={daysBadge(result.days, 60)}
	/>
	<div class="row"><span>{c.end}</span><b>{formatDate(result.end)}</b></div>
	<div class="tl" aria-hidden="true">
		<i class="bar"><i style:width="{result.progress * 100}%"></i></i><span
			class="a">{c.timeline.today}</span
		><span
			class="k"
			style:left="{result.progress * 100}%"
			style:transform="translateX(-{anchor}%)"
			style:--dx="{anchor}%">{c.timeline.cancel}</span
		><span class="e">{c.timeline.end}</span>
	</div>
</div>
<p class="hint">
	{c.hint}
	<a href={c.hintLink.href}>{c.hintLink.text} →</a>
</p>

<style>
	.tl {
		position: relative;
		display: block;
		margin-top: 14px;
		padding-top: 22px;
		height: 50px;
		font-size: 11px;
		color: var(--muted);
	}
	.bar {
		display: block;
		height: 6px;
		border-radius: 3px;
		background: #e3e7e5;
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		width: 0;
		background: var(--ok);
		border-radius: 3px;
		transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.tl span {
		position: absolute;
		top: 34px;
		white-space: nowrap;
	}
	.a {
		left: 0;
	}
	.e {
		right: 0;
	}
	.tl span.k {
		top: 0;
		transform: translateX(-50%);
		color: var(--ink);
		font-weight: 600;
		transition: left 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.k::before {
		content: "";
		position: absolute;
		left: var(--dx, 50%);
		top: 20px;
		width: 10px;
		height: 10px;
		margin-left: -5px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid var(--ink);
	}
</style>
