<!--
  "Lassen Sie uns über Zusammenarbeit reden." (the design's .ipf, #kontakt):
  the shared partner section with this page's form.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { PartnershipInquiry } from "$lib/forms/partnershipInquiry";
	import Apply from "$lib/landing/sections/partner/Apply.svelte";
	import { APPLY_ID, apply } from "../content";
	import PartnershipForm from "./PartnershipForm.svelte";

	let { form: initial }: { form: SuperValidated<PartnershipInquiry> } =
		$props();
</script>

<Apply id={APPLY_ID} headingId="ps-apply-h" content={apply}>
	{#snippet form()}<PartnershipForm form={initial} />{/snippet}
</Apply>
