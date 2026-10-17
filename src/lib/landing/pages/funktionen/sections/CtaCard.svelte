<!--
  The design's dark closing card with the page's signup form in place of its
  video button (plan README, Signup; open question 2). It's the page's only
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

<div class="closing">
	<CtaCard
		id="fk-closing-h"
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
	/* The design's card sits just under the FAQ band. */
	.closing {
		padding-top: 16px;
	}
	/* The form is styled for white backgrounds; here it sits on the dark card. */
	.closing :global(.signup-box.final) {
		margin: 0;
		flex: 1 1 380px;
		max-width: 480px;
	}
	.closing :global(.signup) {
		border-color: transparent;
	}
	/* The card's white text would carry into the field. */
	.closing :global(.signup input[type="email"]) {
		color: var(--ink);
	}
	.closing :global(.signup input[type="email"]::placeholder) {
		color: var(--muted);
	}
	.closing :global(.final .status),
	.closing :global(.final .error) {
		text-align: left;
	}
	.closing :global(.final .status) {
		color: var(--accent);
	}
	.closing :global(.final .error) {
		color: #f2b8a0;
	}
</style>
