<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import FinalCta from "$lib/landing/sections/FinalCta.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let {
		content,
		form,
	}: { content: RegionContent; form: SuperValidated<SwitchInquiry> } = $props();
</script>

<!-- Trust follows, so the section is compact. -->
<FinalCta
	title={content.final.title}
	sub={content.final.sub}
	{form}
	submitLabel="Bestand kostenlos prüfen"
	compact
/>
