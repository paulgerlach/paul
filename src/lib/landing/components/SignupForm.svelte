<!--
  Email signup of the landing page, used in the hero and the final CTA. Posts
  to the page's form action and works without JS.
-->
<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { superForm, type SuperValidated } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import {
		switchInquirySchema,
		type SwitchInquiry,
		type SwitchPlacement,
	} from "$lib/forms/switchInquiry";

	let {
		form: initial,
		placement,
		id,
		inputId,
	}: {
		form: SuperValidated<SwitchInquiry>;
		placement: SwitchPlacement;
		/** Anchor of the form element (the hero's is `start`). */
		id?: string;
		inputId: string;
	} = $props();

	const { form, errors, enhance, message, submitting, formId } = superForm(
		// superForm takes the initial form once and tracks updates itself
		untrack(() => initial),
		{ validators: zod4Client(switchInquirySchema), resetForm: false },
	);

	// The server's render time can be minutes old when the CDN serves this
	// page, so time from hydration.
	onMount(() => {
		$form._t = Date.now();
	});

	const sent = $derived($message?.type === "success");
	const error = $derived(
		$errors.email?.[0] ?? ($message?.type === "error" ? $message.text : ""),
	);
</script>

<div class={["signup-box", placement]}>
	<form method="POST" class="signup" {id} use:enhance>
		<input type="hidden" name="__superform_id" bind:value={$formId} />
		<input type="hidden" name="placement" value={$form.placement} />
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

		<label class="sr-only" for={inputId}>Geschäftliche E-Mail</label>
		<input
			id={inputId}
			name="email"
			type="email"
			autocomplete="email"
			placeholder="Ihre geschäftliche E-Mail?"
			bind:value={$form.email}
			disabled={sent}
			aria-invalid={error ? true : undefined}
			aria-describedby={error ? `${inputId}-error` : undefined}
		/>
		<button class="btn btn-accent" type="submit" disabled={$submitting || sent}>
			{#if $submitting}<span class="spinner" aria-hidden="true"></span>{/if}
			{sent ? "Wir melden uns" : "Wechsel kostenlos prüfen"}
		</button>
	</form>
	<p class="status" aria-live="polite">
		{#if sent}{$message?.text}{/if}
	</p>
	{#if error}
		<p class="error" id="{inputId}-error" role="alert">{error}</p>
	{/if}
</div>

<style>
	.signup-box {
		width: 100%;
		max-width: 480px;
		margin-top: 32px;
	}
	.signup-box.final {
		max-width: 560px;
		margin: 36px auto 0;
	}
	.signup {
		display: flex;
		align-items: center;
		gap: 8px;
		border: 1px solid var(--line);
		background: #f8f9f8;
		border-radius: 10px;
		padding: 6px 6px 6px 18px;
		scroll-margin-top: 120px;
	}
	.signup:focus-within {
		border-color: var(--accent-deep);
	}
	input[type="email"] {
		flex: 1;
		min-width: 0;
		border: 0;
		background: transparent;
		font-size: 16px;
		padding: 10px 0;
		outline: none;
	}
	.btn {
		padding: 14px 20px;
		font-size: 16px;
	}
	.btn:disabled {
		cursor: default;
	}
	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	.hp {
		position: absolute;
		left: -9999px;
		width: 0;
		height: 0;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}
	.status,
	.error {
		margin-top: 8px;
		font-size: 14px;
		text-align: left;
	}
	.status {
		color: var(--ok);
	}
	.status:empty {
		display: none;
	}
	.error {
		color: var(--bad);
	}
	.final .status,
	.final .error {
		text-align: center;
	}

	@media (max-width: 980px) {
		.signup-box {
			max-width: 560px;
		}
		.status,
		.error {
			text-align: center;
		}
	}
	@media (max-width: 520px) {
		.signup {
			flex-direction: column;
			align-items: stretch;
			padding: 8px;
		}
		input[type="email"] {
			padding: 10px;
		}
	}
</style>
