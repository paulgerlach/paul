<!--
  Pane "Eichfrist" (calcE): the meter type and the year of calibration give
  the expiry and the date to plan the swap by. An empty year or one before
  1900 keeps the last result.
-->
<script lang="ts">
	import { untrack } from "svelte";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { calculator } from "../content";
	import {
		calibration,
		daysBadge,
		daysBetween,
		defaults,
		formatDate,
		todayOf,
	} from "../fristen";
	import Result from "./Result.svelte";

	const c = calculator.calibration;
	const clock = getDeadlineClock();
	const today = $derived(todayOf(clock.today));
	const initial = defaults(untrack(() => today)).calibrationYear;

	let type = $state(c.type.options[0].key);
	let year = $state(initial);

	const years = $derived(
		c.type.options.find((o) => o.key === type)?.years ?? 6,
	);
	const result = $derived(calibration(year, years)!);

	function onYear(event: Event & { currentTarget: HTMLInputElement }) {
		const value = event.currentTarget.valueAsNumber;
		if (calibration(value, years)) year = value;
	}
</script>

<div class="f2">
	<label
		><span>{c.type.label}</span><select bind:value={type}>
			{#each c.type.options as o (o.key)}
				<option value={o.key}>{o.label}</option>
			{/each}
		</select></label
	>
	<label
		><span>{c.year}</span><input
			type="number"
			min="1990"
			max="2100"
			inputmode="numeric"
			value={initial}
			oninput={onYear}
			onchange={onYear}
		/></label
	>
</div>
<div class="res" aria-live="polite">
	<Result
		label={c.result}
		value={formatDate(result.end)}
		badge={daysBadge(daysBetween(today, result.end), 180)}
	/>
	<div class="row"><span>{c.plan}</span><b>{formatDate(result.plan)}</b></div>
</div>
<p class="hint">{c.hint}</p>
