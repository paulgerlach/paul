<script lang="ts">
	import { getQuestionnaire } from "$lib/fragebogen/questionnaire.svelte";
	import StepHeading from "../StepHeading.svelte";

	const q = getQuestionnaire();
</script>

<div data-step="2" class="questionare-step mb-10 max-w-xl">
	<StepHeading
		title="Anzahl der Wohnungen"
		question="Wählen Sie aus, wie viele Wohnungen Sie aktuell"
		questionEnd="betreuen und bei denen die Umrüstung auf Int. Systeme"
	/>
	<div class="flex items-start justify-start gap-4">
		<button
			onclick={() => q.adjust("wohnungen_count", -1)}
			class="mt-2 flex size-12 cursor-pointer items-center justify-center rounded-full bg-dark_green/5 text-lg text-dark_text"
			type="button"
		>
			-
		</button>
		<div class="flex flex-col items-center justify-center gap-1.5">
			<input
				class="w-full max-w-[200px] rounded-xl border border-dark_green/20 py-6 text-center text-lg text-dark_text duration-300 outline-none focus:ring-4 focus:ring-green/40"
				type="number"
				min="1"
				id="wohnungen_count"
				name="wohnungen_count"
				bind:value={q.data.wohnungen_count}
			/>
			<label class="text-lg text-dark_text" for="wohnungen_count">
				Wohnungen
			</label>
		</div>
		<button
			onclick={() => q.adjust("wohnungen_count", 1)}
			class="mt-2 flex size-12 cursor-pointer items-center justify-center rounded-full bg-dark_green/5 text-lg text-dark_text"
			type="button"
		>
			+
		</button>
	</div>
</div>
