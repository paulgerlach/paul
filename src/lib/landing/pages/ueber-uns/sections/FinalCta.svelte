<!--
  The page's only form, so it carries the `start` anchor every CTA leads to.
  The design's dark "Demo buchen" card becomes the shared final CTA with the
  signup form (plan README, open question 3).
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import FinalCta from "$lib/landing/sections/FinalCta.svelte";
	import { finalCta } from "../content";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();
</script>

<!-- Trust follows, so the section is compact. -->
<FinalCta
	id="start"
	title={finalCta.title}
	{form}
	submitLabel={finalCta.submitLabel}
	compact
/>
