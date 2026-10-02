<script lang="ts">
	import {
		fund_icon,
		group_icon,
		private_person_icon,
	} from "$lib/assets/icons";
	import StepChoices from "./StepChoices.svelte";
	import StepHeading from "./StepHeading.svelte";

	const options = [
		{ id: "is_private", value: "Privatperson", icon: private_person_icon },
		{ id: "is_management", value: "Hausverwaltung", icon: group_icon },
		{
			id: "is_asset_manager",
			value: "Assetmanager, Fonds & Bestandshalter",
			icon: fund_icon,
		},
	] as const;
</script>

<div data-step="1" class="questionare-step mb-10 max-w-xl">
	<StepHeading
		title="Kundentyp"
		question="In welcher Funktion verwalten oder betreuen Sie"
		questionEnd="Immobilien?"
	/>
	<StepChoices field="customer_type" {options} />
</div>
