<!--
  The partner form (the design's .ipf-f). Posts to the page's form action
  and works without JS (the response renders the marks and the line at
  #bewerben). With JS: client validation after the first submit, "Wird
  gesendet …", and the form empties on success.
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

<form method="POST" action="#{APPLY_ID}" class="ipf-f" novalidate use:enhance>
	<input type="hidden" name="_t" value={$form._t} />
	<!-- Honeypot — hidden from real users, bots auto-fill this -->
	<div aria-hidden="true" class="hp">
		<label>
			Website
			<input
				name="website"
				bind:value={$form.website}
				tabindex={-1}
				autocomplete="off"
				type="text"
			/>
		</label>
	</div>

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
	<button type="submit" class="submit" disabled={$submitting}
		>{apply.submit} <span class="ar" aria-hidden="true">→</span></button
	>
	{#if sent}
		<p class="msg ok" role="status">{$message?.text}</p>
	{:else}
		<p
			class={["msg", (invalid || sendError) && "err"]}
			id={MSG_ID}
			role="alert"
		>
			{#if invalid}
				{apply.missing}
			{:else if sendError}
				{apply.sendError.text}
				<a href={apply.sendError.phoneHref}>{apply.sendError.phone}</a>
			{:else if $submitting}
				{apply.sending}
			{/if}
		</p>
	{/if}
</form>

<style>
	.ipf-f {
		background: #fff;
		color: var(--ink);
		border-radius: 22px;
		padding: clamp(20px, 3vw, 34px);
		display: grid;
		gap: 16px;
	}
	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.r2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	label {
		display: grid;
		gap: 6px;
		font-size: 13.5px;
		font-weight: 600;
	}
	/* The browser's "smaller" (Tailwind's preflight sets 80 %). */
	label small {
		font-size: smaller;
		font-weight: 400;
		color: #7a8783;
	}
	input:not([type="checkbox"]):not([type="radio"]),
	select,
	textarea {
		font: inherit;
		font-size: 15px;
		font-weight: 400;
		color: var(--ink);
		border: 1px solid #dce2df;
		border-radius: 10px;
		padding: 11px 12px;
		background: #fff;
		width: 100%;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	input:focus,
	select:focus,
	textarea:focus {
		outline: 0;
		border-color: #3e9a57;
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.35);
	}
	/* The design's .bad (!important there): it beats the focus colour too. */
	input.bad:not([type="checkbox"]),
	select.bad,
	textarea.bad {
		border-color: #c2410c;
	}
	fieldset {
		border: 0;
		margin: 0;
		padding: 0;
		min-width: 0;
	}
	legend {
		font-size: 13.5px;
		font-weight: 600;
		margin-bottom: 8px;
		/* The browser's legend padding (Tailwind's preflight zeroes it). */
		padding: 0 2px;
	}
	.ch {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.ch label {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid #dce2df;
		border-radius: 999px;
		padding: 8px 14px;
		font-weight: 500;
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.ch label:has(input:checked) {
		border-color: #3e9a57;
		background: #eef8ef;
	}
	.ch label:has(input:focus-visible) {
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.35);
	}
	.ch input {
		accent-color: #3e9a57;
		margin: 0;
	}
	.consent {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-weight: 400;
		color: #5b6b66;
		line-height: 1.45;
	}
	/* The browser's checkbox margins (Tailwind's preflight zeroes them). */
	.consent input {
		accent-color: #3e9a57;
		margin: 3px 3px 3px 4px;
		flex: none;
	}
	/* The design marks the box; its label text keeps its colour. */
	.consent.bad input {
		outline: 2px solid #c2410c;
		outline-offset: 1px;
	}
	.submit {
		justify-self: start;
		border: 0;
		background: var(--ink);
		color: #fff;
		font: inherit;
		font-weight: 600;
		font-size: 16px;
		border-radius: 12px;
		padding: 15px 22px;
		cursor: pointer;
		display: inline-flex;
		gap: 10px;
		transition: background 0.2s;
	}
	.submit:hover {
		background: #2c4640;
	}
	.submit[disabled] {
		opacity: 0.6;
		cursor: default;
	}
	.msg {
		font-size: 14.5px;
		line-height: 1.5;
		color: #5b6b66;
		min-height: 1em;
		margin: 0;
	}
	.msg.ok {
		color: #245f33;
		background: #e6f5e7;
		border-radius: 12px;
		padding: 12px 14px;
	}
	.msg.err {
		color: #8a3a10;
	}
	.msg a {
		color: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	@media (max-width: 900px) {
		.r2 {
			grid-template-columns: 1fr;
		}
	}
</style>
