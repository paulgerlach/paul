<!--
  The application form. Posts to the page's form action and works without
  JS (the response renders this section with errors or the success overlay).
  With JS: client validation after the first submit, the role chosen by any
  "bewerben" link, confetti and focus on success, and "Weitere Bewerbung"
  resets in place.
-->
<script lang="ts">
	import { onDestroy, onMount, tick, untrack } from "svelte";
	import { superForm, type SuperValidated } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import {
		applicationSchema,
		ROLE_IDS,
		type Application,
	} from "$lib/forms/application";
	import { burst } from "$lib/landing/confetti";
	import { ROUTE_KARRIERE } from "$lib/routes";
	import {
		APPLY_ID,
		getApplication,
		NAME_FIELD_ID,
	} from "../application.svelte";
	import { apply, roles } from "../content";

	let { form: initial }: { form: SuperValidated<Application> } = $props();

	const application = getApplication();

	let host: HTMLElement;
	let canvas: HTMLCanvasElement | undefined = $state();
	let check: HTMLElement | undefined = $state();
	let heading: HTMLElement | undefined = $state();
	let stopConfetti = () => {};

	const { form, errors, enhance, message, submitting, reset } = superForm(
		// superForm takes the initial form once and tracks updates itself
		untrack(() => initial),
		{
			validators: zod4Client(applicationSchema),
			validationMethod: "submit-only",
			resetForm: false,
			async onUpdated({ form: result }) {
				if (result.message?.type !== "success") return;
				await tick();
				heading?.focus();
				celebrate();
			},
		},
	);

	// The server's render time can be minutes old when the CDN serves this
	// page, so time from hydration.
	onMount(() => {
		$form._t = Date.now();
	});
	onDestroy(() => stopConfetti());

	const sent = $derived($message?.type === "success");
	const sendError = $derived($message?.type === "error");

	/** The design's one sentence for the missing name/email, then the others. */
	const errorText = $derived.by(() => {
		const missing = [
			$errors.name && apply.missing.name,
			$errors.email && apply.missing.email,
		].filter(Boolean);
		return [
			missing.length &&
				`${apply.missing.prefix}${missing.join(apply.missing.join)}.`,
			$errors.link?.[0],
			$errors.message?.[0],
		]
			.filter(Boolean)
			.join(" ");
	});

	const invalid = (field: "name" | "email" | "link" | "message") =>
		$errors[field]
			? { "aria-invalid": true, "aria-describedby": "kr-err" }
			: {};

	function celebrate() {
		if (!canvas || !check) return;
		stopConfetti();
		const box = host.getBoundingClientRect();
		const o = check.getBoundingClientRect();
		stopConfetti = burst(
			canvas,
			{ width: box.width, height: box.height },
			{
				x: o.left - box.left + o.width / 2,
				y: o.top - box.top + o.height / 2,
				width: 0,
			},
			{
				count: 120,
				speed: [2.6, 4.2],
				angle: 1.2,
				gravity: 0.06,
				maxFall: 1.2,
				fadeAfter: 3400,
				fadeMs: 1000,
				maxTime: 4600,
				wobble: [420, 0.5],
				spin: 0.14,
			},
		);
	}

	async function again(event: MouseEvent) {
		event.preventDefault();
		stopConfetti();
		reset();
		application.role = ROLE_IDS[0];
		$form._t = Date.now();
		await tick();
		document.getElementById(NAME_FIELD_ID)?.focus();
	}
</script>

<form
	bind:this={host}
	method="POST"
	action="#{APPLY_ID}"
	class={["form", "rv", sent && "sent"]}
	novalidate
	use:enhance
>
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

	<div class="fields" inert={sent}>
		<label>
			<span>{apply.fields.role}</span>
			<select name="role" bind:value={application.role}>
				{#each roles as role (role.id)}
					<option value={role.id}>{role.formLabel}</option>
				{/each}
			</select>
		</label>
		<div class="two">
			<label>
				<span>{apply.fields.name.label}</span>
				<input
					id={NAME_FIELD_ID}
					name="name"
					type="text"
					autocomplete="name"
					placeholder={apply.fields.name.placeholder}
					class={[$errors.name && "bad"]}
					bind:value={$form.name}
					{...invalid("name")}
				/>
			</label>
			<label>
				<span>{apply.fields.email.label}</span>
				<input
					name="email"
					type="email"
					autocomplete="email"
					placeholder={apply.fields.email.placeholder}
					class={[$errors.email && "bad"]}
					bind:value={$form.email}
					{...invalid("email")}
				/>
			</label>
		</div>
		<label>
			<span
				>{apply.fields.link.label}
				<small>{apply.fields.link.optional}</small></span
			>
			<input
				name="link"
				type="url"
				autocomplete="url"
				placeholder={apply.fields.link.placeholder}
				class={[$errors.link && "bad"]}
				bind:value={$form.link}
				{...invalid("link")}
			/>
		</label>
		<label>
			<span>{apply.fields.message.label}</span>
			<textarea
				name="message"
				rows="4"
				placeholder={apply.fields.message.placeholder}
				class={[$errors.message && "bad"]}
				bind:value={$form.message}
				{...invalid("message")}></textarea>
		</label>
		<p class="err" id="kr-err" role="alert">
			{#if errorText}
				{errorText}
			{:else if sendError}
				{apply.sendError.before}<a
					href="mailto:{apply.fallbackEmail}"
					data-placeholder="">{apply.fallbackEmail}</a
				>{apply.sendError.after}
			{/if}
		</p>
		<button type="submit" class="submit" disabled={$submitting}>
			{#if $submitting}
				{apply.sending}
			{:else}
				{apply.submit} <span class="ar" aria-hidden="true">→</span>
			{/if}
		</button>
		<p class="privacy" data-placeholder="">
			{apply.privacy.before}<a href={apply.privacy.href}>{apply.privacy.link}</a
			>{apply.privacy.after}
		</p>
	</div>

	{#if sent}
		<div class="ok" role="status">
			<span class="okc" bind:this={check}>
				<svg viewBox="0 0 12 10" aria-hidden="true">
					<path
						d="M1 5l3.5 3.5L11 1"
						stroke="#1E322D"
						stroke-width="2"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
			<b tabindex="-1" bind:this={heading}>{apply.successTitle}</b>
			<small>{$message?.text}</small>
			<a class="again" href="{ROUTE_KARRIERE}#{APPLY_ID}" onclick={again}
				>{apply.again}</a
			>
		</div>
		<canvas class="cf" bind:this={canvas} aria-hidden="true"></canvas>
	{/if}
</form>

<style>
	.form {
		position: relative;
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 28px;
		overflow: hidden;
	}
	.fields {
		display: grid;
		gap: 16px;
	}
	label {
		display: grid;
		gap: 7px;
	}
	label > span {
		font-size: 13.5px;
		font-weight: 600;
	}
	label small {
		font-weight: 400;
		color: var(--faint);
	}
	input,
	select,
	textarea {
		font: inherit;
		font-size: 15px;
		color: var(--ink);
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 11px;
		padding: 12px 14px;
		width: 100%;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	textarea {
		resize: vertical;
		min-height: 110px;
	}
	input:focus,
	select:focus,
	textarea:focus {
		outline: 0;
		border-color: var(--ink);
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.35);
	}
	.bad {
		border-color: #d9622b;
	}
	.two {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.err {
		font-size: 13.5px;
		color: #b5471a;
	}
	.err:empty {
		display: none;
	}
	.err a {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	/* .bk-next */
	.submit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		margin-top: 4px;
		border: 0;
		background: var(--ink);
		color: #fff;
		font: inherit;
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
	.submit:hover:not(:disabled) {
		background: #2a443d;
	}
	.submit:active:not(:disabled) {
		transform: scale(0.98);
	}
	.submit:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.submit .ar {
		transition: transform 0.25s;
	}
	.submit:hover .ar {
		transform: translateX(4px);
	}
	.privacy {
		font-size: 13px;
		color: var(--faint);
	}
	.privacy a {
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 3px;
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
	.ok {
		position: absolute;
		inset: 0;
		background: var(--ink);
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 8px;
		padding: 28px;
		animation: fade 0.4s both;
	}
	.okc {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--accent);
		display: grid;
		place-items: center;
		margin-bottom: 8px;
		animation: pop 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both;
	}
	.okc svg {
		width: 22px;
		height: 18px;
	}
	.ok b {
		font-size: 22px;
		font-weight: 600;
		outline: none;
	}
	.ok small {
		font-size: 15px;
		color: rgba(255, 255, 255, 0.72);
		max-width: 36ch;
	}
	.again {
		display: inline-flex;
		align-items: center;
		margin-top: 16px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background: transparent;
		color: #fff;
		border-radius: 11px;
		padding: 13px 18px;
		font-size: 15.5px;
		font-weight: 600;
		transition: border-color 0.2s;
	}
	.again:hover {
		border-color: rgba(255, 255, 255, 0.6);
	}
	.cf {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 5;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
	@keyframes pop {
		from {
			transform: scale(0.5);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ok,
		.okc {
			animation: none;
		}
	}
	@media (max-width: 640px) {
		.form {
			padding: 20px;
		}
		.two {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
