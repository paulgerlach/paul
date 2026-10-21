<!--
  The design's dark closing card (.dm-end with #dcta-css) with the page's
  signup form in place of its video button "Demo buchen" (plan README, open
  question 1). It's the page's only form, so it carries the `start` anchor
  the nav's "Demo buchen", the floating CTA and the result card's button lead to.
  After the grey FAQ band the design gives it 110 px of top padding.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import SignupForm from "$lib/landing/components/SignupForm.svelte";
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { closing } from "../content";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();
</script>

<div class="pad">
	<CtaCard
		id="es-closing-h"
		title={closing.h2}
		text={closing.text}
		sectionId="start"
		final
	>
		{#snippet action()}
			<SignupForm
				{form}
				placement="final"
				inputId="email-bottom"
				submitLabel={closing.submitLabel}
			/>
		{/snippet}
	</CtaCard>
</div>

<style>
	.pad :global(section.end) {
		padding-top: 110px;
	}
</style>
