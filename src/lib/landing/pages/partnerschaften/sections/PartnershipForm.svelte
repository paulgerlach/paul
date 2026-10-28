<!--
  The contact form's fields (the design's .ipf-f) in the shared frame. Posts
  to the page's form action and works without JS (the response renders the
  marks and the line at #kontakt). With JS: client validation after the first
  submit, "Wird gesendet …", and the form empties on success.
-->
<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { superForm, type SuperValidated } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import {
		PARTNERSHIP_KINDS,
		partnershipInquirySchema,
		type PartnershipInquiry,
	} from "$lib/forms/partnershipInquiry";
	import FormFrame from "$lib/landing/sections/partner/FormFrame.svelte";
	import { APPLY_ID, apply } from "../content";

	let { form: initial }: { form: SuperValidated<PartnershipInquiry> } =
		$props();

	const { form, errors, enhance, message, submitting } = superForm(
		// superForm takes the initial form once and tracks updates itself
		untrack(() => initial),
		{
			validators: zod4Client(partnershipInquirySchema),
			validationMethod: "submit-only",
			resetForm: true,
		},
	);

	// The server's render time can be minutes old when the CDN serves this
	// page, so time from hydration.
	onMount(() => {
		$form._t = Date.now();
	});

	const MSG_ID = "ps-form-msg";
	const sent = $derived($message?.type === "success");
	const sendError = $derived($message?.type === "error");
	const invalid = $derived(
		Object.entries($errors).some(([, value]) => value !== undefined),
	);

	type Field = keyof PartnershipInquiry;
	const bad = (field: Field) => Boolean($errors[field]);
	const marks = (field: Field) =>
		bad(field) ? { "aria-invalid": true, "aria-describedby": MSG_ID } : {};
</script>

<FormFrame
	action="?/partnership#{APPLY_ID}"
	{enhance}
	t={$form._t}
	msgId={MSG_ID}
	texts={apply}
	submitting={$submitting}
	{invalid}
	{sent}
	{sendError}
	message={$message?.text}
>
	<div class="r2">
		<label
			>{apply.fields.company}<input
				name="company"
				autocomplete="organization"
				class={[bad("company") && "bad"]}
				bind:value={$form.company}
				{...marks("company")}
			/></label
		>
		<label
			>{apply.fields.name}<input
				name="name"
				autocomplete="name"
				class={[bad("name") && "bad"]}
				bind:value={$form.name}
				{...marks("name")}
			/></label
		>
	</div>
	<div class="r2">
		<label
			>{apply.fields.email}<input
				name="email"
				type="email"
				autocomplete="email"
				class={[bad("email") && "bad"]}
				bind:value={$form.email}
				{...marks("email")}
			/></label
		>
		<label
			>{apply.fields.phone}<input
				name="phone"
				type="tel"
				autocomplete="tel"
				class={[bad("phone") && "bad"]}
				bind:value={$form.phone}
				{...marks("phone")}
			/></label
		>
	</div>
	<!-- As the design: the select alone in a two-column row (half the width). -->
	<div class="r2">
		<label
			>{apply.fields.kind.label}<select
				name="kind"
				class={[bad("kind") && "bad"]}
				bind:value={$form.kind}
				{...marks("kind")}
			>
				<option value="">{apply.fields.kind.placeholder}</option>
				{#each PARTNERSHIP_KINDS as kind (kind)}
					<option value={kind}>{kind}</option>
				{/each}
			</select></label
		>
	</div>
	<!-- As the design: the label's text and "(optional)" are rows of the grid. -->
	<label
		>{apply.fields.message.label}
		<small>{apply.fields.message.optional}</small><textarea
			name="message"
			rows="3"
			class={[bad("message") && "bad"]}
			bind:value={$form.message}
			{...marks("message")}></textarea></label
	>
	<label class={["consent", bad("consent") && "bad"]}
		><input
			type="checkbox"
			name="consent"
			bind:checked={$form.consent}
			{...marks("consent")}
		/>{apply.fields.consent}</label
	>
</FormFrame>
