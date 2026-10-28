<!-- Personal contact details. Also the last step of the Under50 flow. -->
<script lang="ts">
	import { getQuestionnaire } from "$lib/fragebogen/questionnaire.svelte";
	import { ROUTE_DATENSCHUTZHINWEISE } from "$lib/routes";
	import StepHeading from "../StepHeading.svelte";

	const q = getQuestionnaire();
	const input =
		"w-full rounded-xl border border-dark_green/20 px-5 py-4 text-[16px] duration-300 outline-none focus:ring-4 focus:ring-green/40";
</script>

<div id="questionareForm" data-step="6" class="questionare-step mb-10 max-w-xl">
	<StepHeading
		title="Ihre Kontaktdaten"
		question="Geben Sie Ihre Kontaktdaten ein, sodass wir Ihnen ein für"
		questionEnd="Sie passendes Angebot zukommen lassen können."
	/>
	<div class="space-y-4">
		<div class="flex max-w-[509px] gap-4">
			<label for="first_name" class="block flex-1">
				<input
					class={input}
					placeholder="Vorname*"
					type="text"
					name="first_name"
					id="first_name"
					bind:value={q.data.first_name}
				/>
				{#if q.errors.first_name}
					<p class="mt-1 text-sm text-dark_text/50">{q.errors.first_name}</p>
				{/if}
			</label>
			<label for="last_name" class="block flex-1">
				<input
					class={input}
					placeholder="Nachname*"
					type="text"
					name="last_name"
					id="last_name"
					bind:value={q.data.last_name}
				/>
				{#if q.errors.last_name}
					<p class="mt-1 text-sm text-dark_text/50">{q.errors.last_name}</p>
				{/if}
			</label>
		</div>
		<label class="block max-w-[509px]" for="phone">
			<input
				class={input}
				placeholder="Telefonnummer*"
				type="phone"
				name="phone"
				id="phone"
				bind:value={q.data.phone}
			/>
			{#if q.errors.phone}
				<p class="mt-1 text-sm text-dark_text/50">{q.errors.phone}</p>
			{/if}
		</label>
		<label class="block max-w-[509px]" for="email">
			<input
				class={input}
				placeholder="Email Adresse*"
				type="email"
				name="email"
				id="email"
				bind:value={q.data.email}
			/>
			{#if q.errors.email}
				<p class="mt-1 text-sm text-dark_text/50">{q.errors.email}</p>
			{/if}
		</label>
		<label
			for="form_confirm"
			class="flex max-w-[509px] items-start justify-start gap-3 pt-2"
		>
			<input
				id="form_confirm"
				name="form_confirm"
				class="mt-0.5 h-5 w-5 cursor-pointer accent-green"
				type="checkbox"
				bind:checked={q.data.form_confirm}
			/>
			<span class="text-[15px] leading-snug text-dark_text">
				Hiermit habe ich die
				<a class="text-[#6083CC] underline" href={ROUTE_DATENSCHUTZHINWEISE}
					>Datenschutzbestimmungen</a
				>
				gelesen und akzeptiert
			</span>
		</label>
		{#if q.errors.form_confirm}
			<p class="text-sm text-red-500">{q.errors.form_confirm}</p>
		{/if}
	</div>
</div>
