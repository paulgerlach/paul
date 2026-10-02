<script lang="ts">
	import { getQuestionnaire } from "$lib/fragebogen/questionnaire.svelte";
	import StepHeading from "../StepHeading.svelte";

	const q = getQuestionnaire();
	const input =
		"w-full rounded-xl border border-dark_green/20 px-5 py-4 text-[16px] duration-300 outline-none focus:ring-4 focus:ring-green/40";
</script>

<div data-step="5" class="questionare-step mb-10 max-w-xl">
	<StepHeading
		title="Ihre Kontaktdaten"
		question="In welcher Region befindet sich das Hauptgeschäftsfeld"
		questionEnd="Ihrer Verwaltung?"
	/>
	<div class="space-y-4">
		<label for="verwaltung_name" class="block">
			<input
				class={[input, "max-w-[509px]"]}
				placeholder="Name der Verwaltung*"
				type="text"
				name="verwaltung_name"
				id="verwaltung_name"
				bind:value={q.data.verwaltung_name}
			/>
			{#if q.errors.verwaltung_name}
				<p class="mt-1 text-sm text-red-500">{q.errors.verwaltung_name}</p>
			{/if}
		</label>
		<div class="flex max-w-[509px] gap-4">
			<label for="postleitzahl" class="block flex-1">
				<input
					class={input}
					placeholder="Postleitzahl*"
					type="text"
					name="postleitzahl"
					id="postleitzahl"
					bind:value={q.data.postleitzahl}
				/>
				{#if q.errors.postleitzahl}
					<p class="mt-1 text-sm text-red-500">{q.errors.postleitzahl}</p>
				{/if}
			</label>
			<label for="ort" class="block flex-1">
				<input
					class={input}
					placeholder="Ort*"
					type="text"
					name="ort"
					id="ort"
					bind:value={q.data.ort}
				/>
				{#if q.errors.ort}
					<p class="mt-1 text-sm text-red-500">{q.errors.ort}</p>
				{/if}
			</label>
		</div>
	</div>
</div>
