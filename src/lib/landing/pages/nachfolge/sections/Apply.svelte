<!--
  "Lassen Sie uns vertraulich sprechen." (the design's .ipf, #kontakt): the
  shared partner section with this page's form.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SuccessionInquiry } from "$lib/forms/successionInquiry";
	import Apply from "$lib/landing/sections/partner/Apply.svelte";
	import { APPLY_ID, apply } from "../content";
	import SuccessionForm from "./SuccessionForm.svelte";

	let { form: initial }: { form: SuperValidated<SuccessionInquiry> } = $props();
</script>

<Apply id={APPLY_ID} headingId="nf-apply-h" content={apply}>
	{#snippet form()}<SuccessionForm form={initial} />{/snippet}
</Apply>
