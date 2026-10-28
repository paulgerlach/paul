<!--
  The contact card (the design's .bk with #kt-js): the head with the team
  avatar and the progress line, then the form or, once sent, the done panel.
  Posts to the page's form action and works without JS (the topics are
  radios; the response renders the marks and the line, or the done panel).
  With JS: client validation after the first submit, "Wird gesendet …", and
  "Weitere Nachricht schreiben" brings back the emptied form.
-->
<script lang="ts">
	import { onMount, tick, untrack } from "svelte";
	import { superForm, type SuperValidated } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import avatar from "$lib/assets/landing/region/avatar-2.webp?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import {
		CONTACT_TOPICS,
		contactInquirySchema,
		type ContactInquiry,
		type ContactMessage,
	} from "$lib/forms/contactInquiry";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import Icon from "../components/Icon.svelte";
	import { FORM_ID, form as texts, write } from "../content";

	let { form: initial }: { form: SuperValidated<ContactInquiry> } = $props();

	let doneHeading: HTMLElement | undefined = $state();

	const { form, errors, enhance, message, submitting } = superForm<
		ContactInquiry,
		ContactMessage
	>(
		// superForm takes the initial form once and tracks updates itself
		untrack(() => initial),
		{
			validators: zod4Client(contactInquirySchema),
			validationMethod: "submit-only",
			resetForm: true,
			// The done panel replaces the form (and its focused button), so its
			// heading takes the focus once it's rendered, to be announced.
			async onUpdated({ form: result }) {
				if (result.message?.type !== "success") return;
				await tick();
				doneHeading?.focus();
			},
		},
	);

	// The server's render time can be minutes old when the CDN serves this
	// page, so time from hydration.
	onMount(() => {
		$form._t = Date.now();
	});

	const ERR_ID = "kt-f-err";
	const done = $derived($message?.type === "success" ? $message : null);
	const failed = $derived($message?.type === "error" ? $message : null);

	type Field = keyof ContactInquiry;
	const bad = (field: Field) => Boolean($errors[field]);
	const marks = (field: Field) =>
		bad(field) ? { "aria-invalid": true, "aria-describedby": ERR_ID } : {};
	const FIELDS: Field[] = [
		"firstName",
		"lastName",
		"email",
		"phone",
		"company",
		"units",
		"message",
	];
	const missing = $derived(FIELDS.some(bad));

	async function again() {
		$message = undefined;
		await tick();
		document
			.querySelector<HTMLInputElement>(`#${FORM_ID} input[name="firstName"]`)
			?.focus();
	}
</script>

<div class="bk">
	<div class="head">
		<div class="team">
			<span class="av"
				><Image
					src={avatar}
					alt={write.avatarAlt}
					width={160}
					height={160}
					sizes="42px"
				/></span
			><span
				><b id="kt-form-h">{texts.title}</b><small
					><Icon name="mail" />{texts.sub}</small
				></span
			>
		</div>
		<div class="prog"><i class={[done && "full"]}></i></div>
	</div>

	{#if done}
		<div class="step done">
			<div class="done-ic">
				<svg viewBox="0 0 52 52" aria-hidden="true"
					><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg
				>
			</div>
			<h3 class="done-h" tabindex="-1" bind:this={doneHeading}>
				{texts.done.h}
			</h3>
			<p class="done-p">
				{texts.done.text(done.firstName)}<b>{done.email}</b>{done.phone
					? texts.done.phone
					: ""}.
			</p>
			<div class="act">
				<button type="button" class="ghost js" onclick={again}
					>{texts.done.again}</button
				>
				<a class="ghost" href={done.mailto}
					><Icon name="mail" />{texts.done.mail}</a
				>
			</div>
		</div>
	{:else}
		<form
			method="POST"
			action="#{FORM_ID}"
			class="step"
			aria-labelledby="kt-form-h"
			novalidate
			use:enhance
		>
			<input type="hidden" name="_t" value={$form._t} />
			<!-- Honeypot — hidden from real users, bots auto-fill this -->
			<div aria-hidden="true" class="hp">
				<label>
					Website
					<input name="website" tabindex={-1} autocomplete="off" type="text" />
				</label>
			</div>

			<fieldset class="fd">
				<legend>{texts.topic}</legend>
				<div class="chips">
					{#each CONTACT_TOPICS as topic (topic.label)}
						<label
							><input
								type="radio"
								name="topic"
								value={topic.label}
								bind:group={$form.topic}
							/>{topic.label}</label
						>
					{/each}
				</div>
			</fieldset>
			<div class="f2">
				<label class={["fd", bad("firstName") && "err"]}
					><span>{texts.fields.firstName.label}</span><input
						name="firstName"
						autocomplete="given-name"
						required
						bind:value={$form.firstName}
						{...marks("firstName")}
					/></label
				>
				<label class={["fd", bad("lastName") && "err"]}
					><span>{texts.fields.lastName.label}</span><input
						name="lastName"
						autocomplete="family-name"
						required
						bind:value={$form.lastName}
						{...marks("lastName")}
					/></label
				>
			</div>
			<div class="f2">
				<label class={["fd", bad("email") && "err"]}
					><span>{texts.fields.email.label}</span><input
						name="email"
						type="email"
						autocomplete="email"
						required
						placeholder={texts.fields.email.placeholder}
						bind:value={$form.email}
						{...marks("email")}
					/></label
				>
				<label class={["fd", bad("phone") && "err"]}
					><span>{texts.fields.phone.label} <em>{texts.optional}</em></span
					><input
						name="phone"
						type="tel"
						autocomplete="tel"
						placeholder={texts.fields.phone.placeholder}
						bind:value={$form.phone}
						{...marks("phone")}
					/></label
				>
			</div>
			<div class="f2">
				<label class={["fd", bad("company") && "err"]}
					><span>{texts.fields.company.label} <em>{texts.optional}</em></span
					><input
						name="company"
						autocomplete="organization"
						placeholder={texts.fields.company.placeholder}
						bind:value={$form.company}
						{...marks("company")}
					/></label
				>
				<label class={["fd", bad("units") && "err"]}
					><span>{texts.fields.units.label} <em>{texts.optional}</em></span
					><input
						name="units"
						inputmode="numeric"
						placeholder={texts.fields.units.placeholder}
						bind:value={$form.units}
						{...marks("units")}
					/></label
				>
			</div>
			<label class={["fd", bad("message") && "err"]}
				><span>{texts.fields.message.label}</span><textarea
					name="message"
					rows="4"
					required
					placeholder={texts.fields.message.placeholder}
					bind:value={$form.message}
					{...marks("message")}></textarea></label
			>
			<label class={["cb", bad("consent") && "err"]}
				><input
					type="checkbox"
					name="consent"
					required
					bind:checked={$form.consent}
					{...marks("consent")}
				/><i><Check /></i><span
					>{texts.consent.before}<a href={texts.consent.link.href}
						>{texts.consent.link.text}</a
					>{texts.consent.after}</span
				></label
			>
			<p class="f-err" id={ERR_ID} role="alert">
				{#if $submitting}
					<span class="sending">{texts.sending}</span>
				{:else if failed}
					{texts.sendError}
					<a href={failed.mailto}>{failed.mailbox}</a>.
				{:else if missing}
					{texts.missing}
				{:else if bad("consent")}
					{texts.noConsent}
				{/if}
			</p>
			<button type="submit" class="next" disabled={$submitting}
				>{texts.submit} <span class="ar" aria-hidden="true">→</span></button
			>
		</form>
	{/if}
</div>

<style>
	.bk {
		position: relative;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		box-shadow: 0 40px 80px -40px rgba(30, 50, 45, 0.35);
		overflow: hidden;
	}
	.head {
		padding: 20px 22px 0;
	}
	.team {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.team b {
		display: block;
		font-size: 16px;
		font-weight: 600;
	}
	.team small {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--muted);
		font-size: 13px;
	}
	.team small :global(svg) {
		width: 14px;
		height: 14px;
		flex: none;
	}
	/* .bk-av.bk-avp: the round photo with the green dot */
	.av {
		width: 42px;
		height: 42px;
		position: relative;
		flex: none;
	}
	.av :global(img) {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
		display: block;
	}
	.av::after {
		content: "";
		position: absolute;
		right: -1px;
		bottom: -1px;
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: #3e9a57;
		border: 2px solid #fff;
	}
	.prog {
		height: 3px;
		background: #eef1ef;
		margin: 16px -22px 0;
	}
	.prog i {
		display: block;
		height: 100%;
		width: 33%;
		background: var(--accent-deep);
		transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.prog i.full {
		width: 100%;
	}
	.step {
		display: block;
		padding: 20px 22px 22px;
		animation: kt-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	@keyframes kt-in {
		from {
			opacity: 0;
			transform: translateX(14px);
		}
	}
	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	/* Fields (.fd, .f2) */
	.f2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.fd {
		display: grid;
		gap: 6px;
		margin-top: 12px;
		font-size: 13px;
		color: var(--muted);
		font-weight: 500;
	}
	fieldset.fd {
		margin: 0;
		padding: 0;
		border: 0;
		min-width: 0;
	}
	legend {
		padding: 0;
		margin-bottom: 6px;
	}
	.fd em {
		font-style: normal;
		color: #8a9792;
		font-weight: 400;
	}
	.fd input,
	.fd textarea {
		border: 1px solid var(--hair);
		border-radius: 9px;
		padding: 10px 12px;
		font: inherit;
		font-size: 14.5px;
		font-weight: 400;
		color: var(--ink);
		background: #fff;
		outline: 0;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
		width: 100%;
		box-sizing: border-box;
		resize: vertical;
	}
	.fd input:focus,
	.fd textarea:focus {
		border-color: var(--accent-deep);
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.25);
	}
	.fd.err input,
	.fd.err textarea {
		border-color: var(--orange);
		box-shadow: 0 0 0 3px rgba(217, 98, 43, 0.12);
	}

	/* The topic chips (.chips-s), radios here */
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.chips label {
		position: relative;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 999px;
		padding: 6px 12px;
		font-size: 13px;
		font-weight: 400;
		color: var(--ink);
		cursor: pointer;
		transition: all 0.18s;
	}
	.chips label:hover {
		border-color: #c9d3ce;
	}
	.chips input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
	.chips label:has(input:checked) {
		background: var(--ink);
		border-color: var(--ink);
		color: #fff;
	}
	.chips label:has(input:focus-visible) {
		outline: 2px solid var(--accent-deep);
		outline-offset: 2px;
	}

	/* The consent (.cb) */
	.cb {
		position: relative;
		display: flex;
		gap: 10px;
		align-items: flex-start;
		margin-top: 16px;
		font-size: 12.5px;
		color: var(--muted);
		line-height: 1.45;
		cursor: pointer;
	}
	.cb input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
	.cb i {
		width: 20px;
		height: 20px;
		border-radius: 6px;
		border: 1.5px solid #c9d3ce;
		display: grid;
		place-items: center;
		flex: none;
		transition: all 0.18s;
		margin-top: 1px;
	}
	.cb i :global(svg) {
		width: 10px;
		opacity: 0;
		transition: opacity 0.15s;
	}
	.cb input:checked + i {
		background: var(--accent);
		border-color: var(--accent);
	}
	.cb input:checked + i :global(svg) {
		opacity: 1;
	}
	.cb input:focus-visible + i {
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.4);
	}
	.cb.err i {
		border-color: var(--orange);
	}
	.cb a {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.f-err {
		color: var(--orange);
		font-size: 13px;
		font-weight: 500;
		margin: 10px 0 0;
	}
	.f-err:empty {
		margin: 0;
	}
	.f-err a {
		color: inherit;
		text-decoration: underline;
	}
	.sending {
		color: var(--muted);
	}
	/* .bk-next */
	.next {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		margin-top: 18px;
		border: 0;
		background: var(--ink);
		color: #fff;
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 18px;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.15s,
			opacity 0.2s;
	}
	.next:hover:not(:disabled) {
		background: #2a443d;
	}
	.next:active:not(:disabled) {
		transform: scale(0.98);
	}
	.next:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.next .ar {
		transition: transform 0.25s;
	}
	.next:hover .ar {
		transform: translateX(4px);
	}

	/* The done panel */
	.done {
		text-align: center;
	}
	.done-ic {
		width: 72px;
		height: 72px;
		margin: 0 auto;
	}
	.done-ic svg {
		width: 100%;
		height: 100%;
	}
	.done-ic circle {
		fill: #e6f5e7;
		stroke: var(--accent-deep);
		stroke-width: 2.5;
		stroke-dasharray: 151;
		stroke-dashoffset: 151;
		animation: kt-draw 0.6s 0.1s forwards;
	}
	.done-ic path {
		fill: none;
		stroke: var(--accent-deep);
		stroke-width: 3.5;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 40;
		stroke-dashoffset: 40;
		animation: kt-draw 0.4s 0.55s forwards;
	}
	@keyframes kt-draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	/* `.done .done-h`: beats the landing reset of heading margins. */
	.done .done-h {
		font-size: 24px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 16px;
		outline: 0;
	}
	.done-p {
		color: var(--muted);
		font-size: 15px;
		margin: 8px auto 0;
		max-width: 38ch;
	}
	.act {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 14px;
	}
	/* .bk-ghost; the design's has no vertical padding, so its buttons are
	   barely taller than their text here (it sits beside a full button in the
	   booking card it comes from). */
	.ghost {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px solid var(--hair);
		border-radius: 11px;
		padding: 11px 16px;
		font-size: 14px;
		font-weight: 500;
		color: var(--ink);
		background: #fff;
		cursor: pointer;
	}
	.ghost:hover {
		border-color: #c9d3ce;
	}
	.ghost :global(svg) {
		width: 16px;
		height: 16px;
	}
	/* "Weitere Nachricht schreiben" needs JS. */
	@media (scripting: none) {
		.js {
			display: none;
		}
	}

	@media (max-width: 640px) {
		.head {
			padding: 16px 16px 0;
		}
		.step {
			padding: 16px;
		}
		.prog {
			margin: 14px -16px 0;
		}
		.f2 {
			grid-template-columns: 1fr;
		}
		.ghost {
			padding: 12px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.step,
		.done-ic circle,
		.done-ic path {
			animation: none;
		}
		.done-ic circle,
		.done-ic path {
			stroke-dashoffset: 0;
		}
		.prog i {
			transition: none;
		}
	}
</style>
