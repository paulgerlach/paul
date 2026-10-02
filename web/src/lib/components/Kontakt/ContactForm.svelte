<!-- Posts to the /kontakt form action; works without JS. -->
<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { superForm, type SuperValidated } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import { contactFormSchema } from "$lib/forms/contact";
	import { ROUTE_DATENSCHUTZHINWEISE } from "$lib/routes";
	import type { z } from "zod";

	type Props = {
		data: SuperValidated<z.infer<typeof contactFormSchema>>;
	};

	let { data }: Props = $props();

	const { form, errors, enhance, message, submitting } = superForm(
		// superForm takes the initial form once and tracks updates itself
		untrack(() => data),
		{
			validators: zod4Client(contactFormSchema),
		},
	);

	// The server's render time can be minutes old when the CDN serves this
	// page, so time from hydration, as Next did.
	onMount(() => {
		$form._t = Date.now();
	});
</script>

<div
	class="px-[100px] pt-20 max-large:px-20 max-medium:px-10 max-small:px-5 max-small:pt-8"
>
	<h1
		class="mb-6 text-[45px] leading-[54px] text-dark_text max-medium:text-2xl"
	>
		Kontaktieren Sie uns
	</h1>
	<p class="mb-5 text-lg text-dark_text">
		Unser Service Team bearbeitet Anfragen überlich innerhalb von 24 Stunden per
		Email.
	</p>
	{#if $message}
		<p
			role="alert"
			class={[
				"mb-4 text-sm font-semibold",
				$message.type === "success" ? "text-green-500" : "text-red-500",
			]}
		>
			{$message.text}
		</p>
	{/if}
	<form method="POST" use:enhance id="contactForm" class="space-y-4">
		<input type="hidden" name="_t" value={$form._t} />
		<!-- Honeypot — hidden from real users, bots auto-fill this -->
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -left-[9999px] -z-10 h-0 w-0 overflow-hidden opacity-0"
		>
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

		<label class="block">
			<input
				name="name"
				bind:value={$form.name}
				class="w-full rounded-md border border-dark_green/20 px-7 py-5 duration-300 outline-none focus:ring-4 focus:ring-green/40"
				placeholder="Vor- und Nachname*"
				type="text"
			/>
			{#if $errors.name}
				<p class="text-sm text-red-500">{$errors.name[0]}</p>
			{/if}
		</label>
		<label class="block">
			<input
				name="email"
				bind:value={$form.email}
				class="w-full rounded-md border border-dark_green/20 px-7 py-5 duration-300 outline-none focus:ring-4 focus:ring-green/40"
				placeholder="E-Mail*"
				type="email"
			/>
			{#if $errors.email}
				<p class="text-sm text-red-500">{$errors.email[0]}</p>
			{/if}
		</label>
		<label class="block">
			<textarea
				name="message"
				bind:value={$form.message}
				class="w-full rounded-md border border-dark_green/20 px-7 py-5 duration-300 outline-none focus:ring-4 focus:ring-green/40"
				placeholder="Nachricht*"></textarea>
			{#if $errors.message}
				<p class="text-sm text-red-500">{$errors.message[0]}</p>
			{/if}
		</label>
		<div class="flex items-center justify-start gap-7">
			<input
				id="infoChecked"
				name="infoChecked"
				bind:checked={$form.infoChecked}
				type="checkbox"
				class="size-[18px] accent-green"
			/>
			<label for="infoChecked">
				Hiermit habe ich die
				<a href={ROUTE_DATENSCHUTZHINWEISE} class="text-green-600 underline"
					>Datenschutzbestimmungen</a
				>
				gelesen und akzeptiert.
			</label>
		</div>
		{#if $errors.infoChecked}
			<p class="text-sm text-red-500">{$errors.infoChecked[0]}</p>
		{/if}

		<button
			class="cursor-pointer rounded-md bg-green px-9 py-4 text-[15px] font-bold text-white duration-300 hover:opacity-80 disabled:opacity-50"
			type="submit"
			disabled={$submitting}
		>
			{$submitting ? "Senden..." : "Bestätigen"}
		</button>
	</form>
</div>
