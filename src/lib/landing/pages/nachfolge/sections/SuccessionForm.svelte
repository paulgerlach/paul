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
		PROPERTY_COUNTS,
		TIMEFRAMES,
		successionInquirySchema,
		type SuccessionInquiry,
	} from "$lib/forms/successionInquiry";
	import FormFrame from "$lib/landing/sections/partner/FormFrame.svelte";
	import { APPLY_ID, apply } from "../content";

	let { form: initial }: { form: SuperValidated<SuccessionInquiry> } = $props();

	const { form, errors, enhance, message, submitting } = superForm(
		// superForm takes the initial form once and tracks updates itself
		untrack(() => initial),
		{
			validators: zod4Client(successionInquirySchema),
			validationMethod: "submit-only",
			resetForm: true,
		},
	);

	// The server's render time can be minutes old when the CDN serves this
	// page, so time from hydration.
	onMount(() => {
		$form._t = Date.now();
	});

	const MSG_ID = "nf-form-msg";
	const sent = $derived($message?.type === "success");
	const sendError = $derived($message?.type === "error");
	const invalid = $derived(
		Object.entries($errors).some(([, value]) => value !== undefined),
	);

	type Field = keyof SuccessionInquiry;
	const bad = (field: Field) => Boolean($errors[field]);
	const marks = (field: Field) =>
		bad(field) ? { "aria-invalid": true, "aria-describedby": MSG_ID } : {};
</script>

<FormFrame
	action="#{APPLY_ID}"
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
	<div class="r2">
		<label
			>{apply.fields.properties.label}<select
				name="properties"
				class={[bad("properties") && "bad"]}
				bind:value={$form.properties}
				{...marks("properties")}
			>
				<option value="">{apply.fields.properties.placeholder}</option>
				{#each PROPERTY_COUNTS as count (count)}
					<option value={count}>{count}</option>
				{/each}
			</select></label
		>
		<label
			>{apply.fields.timeframe.label}<select
				name="timeframe"
				class={[bad("timeframe") && "bad"]}
				bind:value={$form.timeframe}
				{...marks("timeframe")}
			>
				<option value="">{apply.fields.timeframe.placeholder}</option>
				{#each TIMEFRAMES as timeframe (timeframe)}
					<option value={timeframe}>{timeframe}</option>
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
