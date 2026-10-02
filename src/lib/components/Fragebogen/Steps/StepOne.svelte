<script lang="ts">
	import {
		immobilien_1_50,
		immobilien_51_800,
		immobilien_over_800,
	} from "$lib/assets/icons";
	import StepChoices from "./StepChoices.svelte";
	import StepHeading from "./StepHeading.svelte";

	const options = [
		{ id: "property_1_50", value: "1-50 Immobilien", icon: immobilien_1_50 },
		{
			id: "property_51_800",
			value: "51-800 Immobilien",
			icon: immobilien_51_800,
		},
		{
			id: "property_over_800",
			value: "über 800 Immobilien",
			icon: immobilien_over_800,
		},
	] as const;
</script>

<div data-step="1" class="questionare-step mb-10 max-w-xl">
	<StepHeading
		title="Immobilienbestand"
		question="Wie viele Wohn- und Gewerbeimmobilien verwalten Sie"
		questionEnd="aktuell insgesamt?"
	/>
	<StepChoices field="property_count_category" {options} />
</div>
