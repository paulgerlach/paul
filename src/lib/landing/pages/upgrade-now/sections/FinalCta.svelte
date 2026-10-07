<!--
  The page's only form, so it carries the `start` anchor every CTA leads to.
  The design's dark CTA block becomes the shared final CTA with the signup
  form (plan §4.3); its kicker shows the live day count.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import FinalCta from "$lib/landing/sections/FinalCta.svelte";
	import { finalCta } from "../content";
	import { daysLeftText } from "../deadline";
	import { getDeadlineClock } from "../clock.svelte";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();

	const clock = getDeadlineClock();
	const kickerText = $derived(daysLeftText(clock.today));
</script>

<!-- Trust follows, so the section is compact. -->
<FinalCta
	id="start"
	title={clock.expired ? finalCta.titleExpired : finalCta.title}
	{form}
	submitLabel={finalCta.submitLabel}
	compact
>
	{#snippet kicker()}
		<span class="k">{kickerText}</span>
	{/snippet}
</FinalCta>

<style>
	.k {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: rgba(138, 214, 143, 0.22);
		color: var(--ink);
		border-radius: 999px;
		padding: 6px 12px;
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 14px;
		font-variant-numeric: tabular-nums;
	}
</style>
