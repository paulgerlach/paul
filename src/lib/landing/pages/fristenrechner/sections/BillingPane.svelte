<!--
  Pane "Abrechnung" (calcA): the end of the billing period gives the date the
  bill must reach the tenant by; the optional day it arrived gives the last
  day for objections. An empty or invalid period end keeps the last result.
-->
<script lang="ts">
	import { untrack } from "svelte";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { calculator } from "../content";
	import {
		billing,
		daysBadge,
		daysBetween,
		defaults,
		formatDate,
		parseIso,
		todayOf,
	} from "../fristen";
	import Result from "./Result.svelte";

	const c = calculator.billing;
	const clock = getDeadlineClock();
	const today = $derived(todayOf(clock.today));
	const initial = defaults(untrack(() => today)).periodEnd;

	let periodEnd = $state(parseIso(initial)!);
	let received = $state<number | null>(null);

	const result = $derived(billing(periodEnd, received));

	function onEnd(event: Event & { currentTarget: HTMLInputElement }) {
		const value = parseIso(event.currentTarget.value);
		if (value !== null) periodEnd = value;
	}
	function onReceived(event: Event & { currentTarget: HTMLInputElement }) {
		received = parseIso(event.currentTarget.value);
	}
</script>

<div class="f2">
	<label
		><span>{c.periodEnd}</span><input
			type="date"
			value={initial}
			oninput={onEnd}
			onchange={onEnd}
		/></label
	>
	<label
		><span>{c.received} <small>{c.optional}</small></span><input
			type="date"
			oninput={onReceived}
			onchange={onReceived}
		/></label
	>
</div>
<div class="res" aria-live="polite">
	<Result
		label={c.result}
		value={formatDate(result.deadline)}
		badge={daysBadge(daysBetween(today, result.deadline), 60)}
	/>
	<div class="row">
		<span>{c.objections}</span><b
			>{result.objections === null
				? c.objectionsUnknown
				: formatDate(result.objections)}</b
		>
	</div>
</div>
<p class="hint">{c.hint}</p>
