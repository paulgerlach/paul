<!--
  The design's closing card: the shared dark CtaCard with the page's signup
  form (the design's own e-mail form) and, below, the animated chart. It's
  the page's only form, so it carries the `start` anchor.
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
	id="db-closing-h"
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
