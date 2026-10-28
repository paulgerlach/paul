<script lang="ts">
	import { no_icon, yes_icon } from "$lib/assets/icons";
	import StepChoices from "../StepChoices.svelte";
	import StepHeading from "../StepHeading.svelte";

	const options = [
		{ id: "funkzaehler_ja", value: "Ja", icon: yes_icon },
		{ id: "funkzaehler_nein", value: "Nein", icon: no_icon },
	] as const;
</script>

<div data-step="3" class="questionare-step mb-10 max-w-md">
	<StepHeading
		title="Funkzähler-Status"
		question="Haben Sie Ihren Bestand bereits vollständig auf"
		questionEnd="Funkzähler umgestellt?"
	/>
	<StepChoices field="funkzaehler_status" {options} iconSize="large" />
</div>
