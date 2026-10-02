<!-- Markup only. Phase 7 wires up validation and submission. -->
<script lang="ts">
	import { ROUTE_DATENSCHUTZHINWEISE } from "$lib/routes";
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
	<form onsubmit={(e) => e.preventDefault()} id="contactForm" class="space-y-4">
		<!-- Honeypot — hidden from real users, bots auto-fill this -->
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -left-[9999px] -z-10 h-0 w-0 overflow-hidden opacity-0"
		>
			<label>
				Website
				<input name="website" tabindex={-1} autocomplete="off" type="text" />
			</label>
		</div>

		<label class="block">
			<input
				name="name"
				class="w-full rounded-md border border-dark_green/20 px-7 py-5 duration-300 outline-none focus:ring-4 focus:ring-green/40"
				placeholder="Vor- und Nachname*"
				type="text"
			/>
		</label>
		<label class="block">
			<input
				name="email"
				class="w-full rounded-md border border-dark_green/20 px-7 py-5 duration-300 outline-none focus:ring-4 focus:ring-green/40"
				placeholder="E-Mail*"
				type="email"
			/>
		</label>
		<label class="block">
			<textarea
				name="message"
				class="w-full rounded-md border border-dark_green/20 px-7 py-5 duration-300 outline-none focus:ring-4 focus:ring-green/40"
				placeholder="Nachricht*"></textarea>
		</label>
		<div class="flex items-center justify-start gap-7">
			<input
				id="infoChecked"
				name="infoChecked"
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

		<button
			class="cursor-pointer rounded-md bg-green px-9 py-4 text-[15px] font-bold text-white duration-300 hover:opacity-80 disabled:opacity-50"
			type="submit"
		>
			Bestätigen
		</button>
	</form>
</div>
