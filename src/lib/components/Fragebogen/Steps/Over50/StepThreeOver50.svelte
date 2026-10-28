<script lang="ts">
	import {
		teils_teils_scale,
		unzufrieden_x,
		zufrieden_check,
	} from "$lib/assets/icons";
	import StepChoices from "../StepChoices.svelte";
	import StepHeading from "../StepHeading.svelte";

	const options = [
		{ id: "zufrieden", value: "Sehr zufrieden", icon: zufrieden_check },
		{ id: "teils_teils", value: "Teils / teils", icon: teils_teils_scale },
		{ id: "unzufrieden", value: "Stark unzufrieden", icon: unzufrieden_x },
	] as const;
</script>

<div data-step="3" class="questionare-step mb-10 max-w-xl">
	<StepHeading
		title="Status der Zusammenarbeit"
		question="Wie zufrieden sind Sie insgesamt mit der Zusammenarbeit"
		questionEnd="mit den Messdienstleistern?"
	/>
	<StepChoices field="zusammenarbeit_status" {options} />
</div>
