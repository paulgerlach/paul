<!-- Picks the step for the current index and flow (Under50 or Over50). -->
<script lang="ts">
	import { getQuestionnaire } from "$lib/fragebogen/questionnaire.svelte";
	import StepZero from "./Steps/StepZero.svelte";
	import StepOne from "./Steps/StepOne.svelte";
	// Over50 Flow (51-800 & über 800 Immobilien)
	import StepTwoOver50 from "./Steps/Over50/StepTwoOver50.svelte";
	import StepThreeOver50 from "./Steps/Over50/StepThreeOver50.svelte";
	import StepFourOver50 from "./Steps/Over50/StepFourOver50.svelte";
	import StepFiveOver50 from "./Steps/Over50/StepFiveOver50.svelte";
	import StepSixOver50 from "./Steps/Over50/StepSixOver50.svelte";
	// Under50 Flow (1-50 Immobilien)
	import StepTwoUnder50 from "./Steps/Under50/StepTwoUnder50.svelte";
	import StepThreeUnder50 from "./Steps/Under50/StepThreeUnder50.svelte";
	import StepFourUnder50 from "./Steps/Under50/StepFourUnder50.svelte";

	const q = getQuestionnaire();

	const over50Steps = [
		StepTwoOver50,
		StepThreeOver50,
		StepFourOver50,
		StepFiveOver50,
		StepSixOver50,
	];
	// The Under50 flow reuses StepSixOver50 for the personal contact form
	const under50Steps = [
		StepTwoUnder50,
		StepThreeUnder50,
		StepFourUnder50,
		StepSixOver50,
	];

	// Steps 0 and 1 are the same in both flows. Skipping step 1 leaves no flow,
	// so nothing renders after it (as in Next).
	const Step = $derived.by(() => {
		if (q.step === 0) return StepZero;
		if (q.step === 1) return StepOne;
		if (q.isOver50) return over50Steps[q.step - 2];
		if (q.isUnder50) return under50Steps[q.step - 2];
		return undefined;
	});
</script>

{#key q.step}
	<Step />
{/key}
