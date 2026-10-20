<!--
  The design's glass closing card with the page's signup form in place of its
  video button (plan README, Signup; open question 1). It's the page's only
  form, so it carries the `start` anchor every "Demo buchen" leads to.
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
	id="it-closing-h"
	title={closing.h2}
	text={closing.text}
	sectionId="start"
	tone="glass"
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
