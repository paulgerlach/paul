<script lang="ts">
	import { no_icon, yes_icon } from "$lib/assets/icons";
	import StepChoices from "../StepChoices.svelte";
	import StepHeading from "../StepHeading.svelte";

	const options = [
		{ id: "handlungsbedarf_ja", value: "Ja", icon: yes_icon },
		{ id: "handlungsbedarf_nein", value: "Nein", icon: no_icon },
	] as const;
</script>

<div data-step="4" class="questionare-step mb-10 max-w-xl">
	<StepHeading
		title="Akuter Handlungsbedarf"
		question="Gibt es aktuell eine Immobilie mit akutem"
		questionEnd="Handlungsbedarf?"
	/>
	<StepChoices field="akuter_handlungsbedarf" {options} iconSize="large" />
</div>
