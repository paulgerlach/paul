<script lang="ts">
	import { getQuestionnaire } from "$lib/fragebogen/questionnaire.svelte";
	import StepHeading from "../StepHeading.svelte";

	const q = getQuestionnaire();
</script>

<div data-step="2" class="questionare-step mb-10 max-w-xl">
	<StepHeading
		title="Anzahl der Messdienstleister"
		question="Bitte geben Sie an, mit wie vielen Messdienstleistern Sie derzeit"
		questionEnd="zusammenarbeiten."
	/>
	<div class="flex items-start justify-start gap-4">
		<button
			onclick={() => q.adjust("messdienstleister_count", -1)}
			class="mt-1 flex size-12 cursor-pointer items-center justify-center rounded-full bg-dark_green/5 text-lg text-dark_text"
			type="button"
		>
			-
		</button>
		<div class="flex flex-col items-center justify-center gap-1.5">
			<input
				class="w-full max-w-[160px] rounded-xl border border-dark_green/20 py-4 text-center text-lg text-dark_text duration-300 outline-none focus:ring-4 focus:ring-green/40"
				type="number"
				min="1"
				id="messdienstleister_count"
				name="messdienstleister_count"
				bind:value={q.data.messdienstleister_count}
			/>
			<label class="text-base text-dark_text/60" for="messdienstleister_count">
				Messdienstleister
			</label>
		</div>
		<button
			onclick={() => q.adjust("messdienstleister_count", 1)}
			class="mt-1 flex size-12 cursor-pointer items-center justify-center rounded-full bg-dark_green/5 text-lg text-dark_text"
			type="button"
		>
			+
		</button>
	</div>
</div>
