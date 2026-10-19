<!--
  "Anbindung anfragen" (the design's .spf, #spf-css / #spf-js): the small
  white form in the first audience card. Posts to the page's `connection`
  action and works without JS (the response renders the marks or the
  thank-you panel at #anbindung). With JS: client validation after the
  first submit (the first invalid field gets the focus), "Wird gesendet …",
  then the thank-you panel in place of the form, focused, with the design's
  confetti from its tick.
-->
<script lang="ts">
	import { onDestroy, onMount, tick, untrack } from "svelte";
	import { superForm, type SuperValidated } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import {
		SOFTWARE_TYPES,
		connectionInquirySchema,
		type ConnectionInquiry,
	} from "$lib/forms/connectionInquiry";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import { CONNECTION_ID, connection as texts } from "../content";

	let { form: initial }: { form: SuperValidated<ConnectionInquiry> } = $props();

	let done: HTMLElement | undefined = $state();
	let tickMark: HTMLElement | undefined = $state();
	let stopConfetti = () => {};

	const { form, errors, enhance, message, submitting } = superForm(
		// superForm takes the initial form once and tracks updates itself
		untrack(() => initial),
		{
			validators: zod4Client(connectionInquirySchema),
			validationMethod: "submit-only",
			// The design's first invalid field gets the focus.
			scrollToError: "off",
			autoFocusOnError: true,
			async onUpdated({ form: result }) {
				if (result.message?.type !== "success") return;
				await tick();
				done?.focus();
				if (tickMark) {
					stopConfetti();
					stopConfetti = confettiFrom(tickMark);
				}
			},
		},
	);

	// The server's render time can be minutes old when the CDN serves this
	// page, so time from hydration.
	onMount(() => {
		$form._t = Date.now();
	});
	onDestroy(() => stopConfetti());

	const MSG_ID = "ps-cf-msg";
	const sent = $derived($message?.type === "success");
	const sendError = $derived($message?.type === "error");
	const invalid = $derived(
		Object.entries($errors).some(([, value]) => value !== undefined),
	);

	type Field = keyof ConnectionInquiry;
	const bad = (field: Field) => Boolean($errors[field]);
	const marks = (field: Field) =>
		bad(field) ? { "aria-invalid": true, "aria-describedby": MSG_ID } : {};
</script>

<div class="w" id={CONNECTION_ID}>
	{#if sent}
		<div class="done" tabindex="-1" role="status" bind:this={done}>
			<span class="ic" bind:this={tickMark} aria-hidden="true"
				><svg viewBox="0 0 12 10" width="10"
					><path
						d="M1 5l3.5 3.5L11 1"
						stroke="#1E322D"
						stroke-width="2"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					/></svg
				></span
			>
			<b>{texts.done.title}</b>
			<p>{texts.done.text}</p>
		</div>
	{:else}
		<form
			method="POST"
			action="?/connection#{CONNECTION_ID}"
			class="f"
			novalidate
			aria-label={texts.label}
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

			<div class="h"><b>{texts.title}</b><small>{texts.sub}</small></div>
			<div class="two">
				<label class={[bad("company") && "err"]}
					>{texts.fields.company}<input
						name="company"
						autocomplete="organization"
						bind:value={$form.company}
						{...marks("company")}
					/></label
				>
				<label class={[bad("name") && "err"]}
					>{texts.fields.name}<input
						name="name"
						autocomplete="name"
						bind:value={$form.name}
						{...marks("name")}
					/></label
				>
			</div>
			<label class={[bad("email") && "err"]}
				>{texts.fields.email}<input
					name="email"
					type="email"
					autocomplete="email"
					bind:value={$form.email}
					{...marks("email")}
				/></label
			>
			<label class={[bad("software") && "err"]}
				>{texts.fields.software.label}<select
					name="software"
					bind:value={$form.software}
					{...marks("software")}
				>
					<option value="">{texts.fields.software.placeholder}</option>
					{#each SOFTWARE_TYPES as type (type)}
						<option value={type}>{type}</option>
					{/each}
				</select></label
			>
			<label class={[bad("message") && "err"]}
				>{texts.fields.message.label}<textarea
					name="message"
					rows="2"
					placeholder={texts.fields.message.placeholder}
					bind:value={$form.message}
					{...marks("message")}></textarea></label
			>
			<label class={["ok", bad("consent") && "err"]}
				><input
					type="checkbox"
					name="consent"
					bind:checked={$form.consent}
					{...marks("consent")}
				/>{texts.fields.consent}</label
			>
			<button type="submit" class="b" disabled={$submitting}
				>{texts.submit} <span class="ar" aria-hidden="true">→</span></button
			>
			<p class="msg" id={MSG_ID} role="alert">
				{#if invalid}
					{texts.missing}
				{:else if sendError}
					{texts.sendError.text}
					<a href={texts.sendError.phoneHref}>{texts.sendError.phone}</a>
				{:else if $submitting}
					<span class="wait">{texts.sending}</span>
				{/if}
			</p>
		</form>
	{/if}
</div>

<style>
	.w {
		position: relative;
		background: #fff;
		border-radius: 20px;
		padding: 22px;
		color: #1e322d;
		box-shadow: 0 30px 60px -36px rgba(0, 0, 0, 0.5);
		scroll-margin-top: 72px;
	}
	.f {
		display: grid;
		gap: 12px;
	}
	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.h b {
		display: block;
		font-size: 18px;
		font-weight: 600;
	}
	.h small {
		font-size: 13px;
		color: #5b6b66;
	}
	.two {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.f label {
		display: grid;
		gap: 5px;
		font-size: 13px;
		font-weight: 500;
		color: #1e322d;
	}
	.f input:not([type="checkbox"]),
	.f select,
	.f textarea {
		font: inherit;
		font-size: 14.5px;
		color: #1e322d;
		background: #f6f7f6;
		border: 1px solid #e1e6e3;
		border-radius: 10px;
		padding: 10px 12px;
		width: 100%;
		box-sizing: border-box;
		outline: none;
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.f input:focus,
	.f select:focus,
	.f textarea:focus {
		border-color: #1e322d;
		background: #fff;
	}
	.f textarea {
		resize: vertical;
		min-height: 60px;
	}
	.f .err input,
	.f .err select,
	.f .err textarea {
		border-color: #b4461e;
		background: #fdf3ef;
	}
	.f .ok {
		display: flex;
		gap: 9px;
		align-items: flex-start;
		font-weight: 400;
		font-size: 12.5px;
		color: #5b6b66;
		line-height: 1.4;
	}
	.f .ok input {
		/* The browser's checkbox margins (Tailwind's preflight zeroes them). */
		margin: 2px 3px 3px 4px;
		flex: none;
		accent-color: #1e322d;
	}
	.f .ok.err {
		color: #b4461e;
	}
	.b {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		border: 0;
		border-radius: 12px;
		background: #1e322d;
		color: #fff;
		font: inherit;
		font-size: 15px;
		font-weight: 600;
		padding: 13px 18px;
		cursor: pointer;
		transition:
			transform 0.15s,
			background 0.2s;
	}
	.b:hover {
		background: #2a443d;
	}
	.b:active {
		transform: scale(0.98);
	}
	.b[disabled] {
		opacity: 0.6;
		cursor: default;
	}
	/* The design's .uv-card p gives the line its margins (it beats .spf-msg);
	   its colour and size there would make the line hard to read on white,
	   so those stay .spf-msg's (plan README, Implementation notes). */
	.msg {
		margin: 22px 0 30px;
		font-size: 12.5px;
		color: #b4461e;
		min-height: 1px;
	}
	.msg .wait {
		color: #5b6b66;
	}
	.msg a {
		color: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.done {
		display: grid;
		justify-items: center;
		text-align: center;
		gap: 8px;
		padding: 40px 10px;
		outline: none;
	}
	.ic {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: #8ad68f;
		display: grid;
		place-items: center;
	}
	.ic svg {
		width: 22px;
		height: 22px;
	}
	.done b {
		font-size: 20px;
		font-weight: 600;
	}
	/* The card's line-height (the design's .uv-card p) stays. */
	.done p {
		margin: 0;
		color: #5b6b66;
		font-size: 15px;
		line-height: 1.5;
		max-width: 30ch;
	}
	@media (max-width: 560px) {
		.two {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.b {
			transition: none;
		}
	}
</style>
