<!--
  The design's dark closing card (.dm-end with #dcta-css) with the page's
  signup form in place of its video button "Demo buchen" (plan README, open
  question 2). It's the page's only form, so it carries the `start` anchor
  the nav's "Demo buchen" and the floating CTA lead to.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import SignupForm from "$lib/landing/components/SignupForm.svelte";
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { closing } from "../content";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();
</script>

<CtaCard
	id="lf-closing-h"
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
