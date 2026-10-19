<!--
  The partner form's fields (the design's .ipf-f) in the shared frame. Posts
  to the page's form action and works without JS (the response renders the
  marks and the line at #bewerben). With JS: client validation after the
  first submit, "Wird gesendet …", and the form empties on success.
-->
<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { superForm, type SuperValidated } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import {
		CREW_SIZES,
		EXPERIENCE,
		partnerInquirySchema,
		TRADES,
		type PartnerInquiry,
	} from "$lib/forms/partnerInquiry";
	import FormFrame from "$lib/landing/sections/partner/FormFrame.svelte";
	import { APPLY_ID, apply } from "../content";

	let { form: initial }: { form: SuperValidated<PartnerInquiry> } = $props();

	const { form, errors, enhance, message, submitting } = superForm(
		// superForm takes the initial form once and tracks updates itself
		untrack(() => initial),
		{
			validators: zod4Client(partnerInquirySchema),
			validationMethod: "submit-only",
			resetForm: true,
		},
	);

	// The server's render time can be minutes old when the CDN serves this
	// page, so time from hydration.
	onMount(() => {
		$form._t = Date.now();
	});

	const MSG_ID = "ip-form-msg";
	const sent = $derived($message?.type === "success");
	const sendError = $derived($message?.type === "error");
	const invalid = $derived(
		Object.entries($errors).some(([, value]) => value !== undefined),
	);

	type Field = keyof PartnerInquiry;
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
			>{apply.fields.region.label}<input
				name="region"
				placeholder={apply.fields.region.placeholder}
				class={[bad("region") && "bad"]}
				bind:value={$form.region}
				{...marks("region")}
			/></label
		>
		<label
			>{apply.fields.crew.label}<select
				name="crew"
				class={[bad("crew") && "bad"]}
				bind:value={$form.crew}
				{...marks("crew")}
			>
				<option value="">{apply.fields.crew.placeholder}</option>
				{#each CREW_SIZES as size (size)}
					<option value={size}>{size}</option>
				{/each}
			</select></label
		>
	</div>
	<fieldset>
		<legend>{apply.fields.trades}</legend>
		<div class="ch">
			{#each TRADES as trade (trade)}
				<label
					><input
						type="checkbox"
						name="trades"
						value={trade}
						bind:group={$form.trades}
					/>{trade}</label
				>
			{/each}
		</div>
	</fieldset>
	<fieldset>
		<legend>{apply.fields.experience}</legend>
		<div class="ch">
			{#each EXPERIENCE as option (option.value)}
				<label
					><input
						type="radio"
						name="experience"
						value={option.value}
						bind:group={$form.experience}
					/>{option.label}</label
				>
			{/each}
		</div>
	</fieldset>
	<!-- As the design: the label's text and "(optional)" are rows of the grid. -->
	<label
		>{apply.fields.message.label}
		<small>{apply.fields.message.optional}</small><textarea
			name="message"
			rows="3"
			placeholder={apply.fields.message.placeholder}
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
