<!--
  "Demo buchen": the Fragebogen's wizard (same steps, same request to
  Make.com, `source: "demo"`); once it's sent, the booking page opens.
-->
<script lang="ts">
	import { goto } from "$app/navigation";
	import QuestionnaireWizard from "$lib/components/Fragebogen/QuestionnaireWizard.svelte";
	import { ROUTE_DEMO_TERMIN } from "$lib/routes";
</script>

<main id="content" class="px-5 pt-8 pb-24">
	<h1 class="sr-only">Demo buchen</h1>
	<QuestionnaireWizard source="demo" onsent={() => goto(ROUTE_DEMO_TERMIN)}>
		{#snippet done()}
			<div class="mx-auto max-w-6xl px-10 max-small:px-5" role="status">
				<p class="mb-4 text-[40px] text-dark_text max-small:text-2xl">
					Vielen Dank!
				</p>
				<p class="text-xl text-dark_text max-small:text-base">
					Sie werden zur Terminbuchung weitergeleitet.
					<a class="text-[#6083CC] underline" href={ROUTE_DEMO_TERMIN}
						>Termin wählen</a
					>
				</p>
			</div>
		{/snippet}
	</QuestionnaireWizard>
</main>
