<!--
  "Werden Sie Heidi-Installationspartner." (the design's .ipf, #bewerben):
  the shared partner section with this page's form.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { PartnerInquiry } from "$lib/forms/partnerInquiry";
	import Apply from "$lib/landing/sections/partner/Apply.svelte";
	import { APPLY_ID, apply } from "../content";
	import PartnerForm from "./PartnerForm.svelte";

	let { form: initial }: { form: SuperValidated<PartnerInquiry> } = $props();
</script>

<Apply id={APPLY_ID} headingId="ip-apply-h" content={apply}>
	{#snippet form()}<PartnerForm form={initial} />{/snippet}
</Apply>
