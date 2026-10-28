<script lang="ts">
	import { getQuestionnaire } from "$lib/fragebogen/questionnaire.svelte";
	import StepHeading from "../StepHeading.svelte";

	const q = getQuestionnaire();
</script>

<div data-step="4" class="questionare-step mb-10 max-w-xl">
	<StepHeading
		title="Standortschwerpunkt"
		question="In welcher Stadt befindet sich der Großteil Ihrer"
		questionEnd="Immobilien?"
	/>
	<div class="space-y-4">
		<label for="standort_schwerpunkt" class="block">
			<input
				class="w-full max-w-[509px] rounded-xl border border-dark_green/20 px-5 py-4 text-[16px] duration-300 outline-none focus:ring-4 focus:ring-green/40"
				placeholder="Ort oder Postleitzahl*"
				type="text"
				name="standort_schwerpunkt"
				id="standort_schwerpunkt"
				bind:value={q.data.standort_schwerpunkt}
			/>
			{#if q.errors.standort_schwerpunkt}
				<p class="mt-1 text-sm text-red-500">{q.errors.standort_schwerpunkt}</p>
			{/if}
		</label>
	</div>
</div>
