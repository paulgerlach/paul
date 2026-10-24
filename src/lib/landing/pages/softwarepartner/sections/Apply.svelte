<!--
  "Werden Sie Heidi-Softwarepartner." (the design's .ipf, #bewerben): the
  shared partner section with this page's form.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SoftwarePartnerInquiry } from "$lib/forms/softwarePartnerInquiry";
	import Apply from "$lib/landing/sections/partner/Apply.svelte";
	import { APPLY_ID, apply } from "../content";
	import SoftwarePartnerForm from "./SoftwarePartnerForm.svelte";

	let { form: initial }: { form: SuperValidated<SoftwarePartnerInquiry> } =
		$props();
</script>

<Apply id={APPLY_ID} headingId="sp-apply-h" content={apply}>
	{#snippet form()}<SoftwarePartnerForm form={initial} />{/snippet}
</Apply>
