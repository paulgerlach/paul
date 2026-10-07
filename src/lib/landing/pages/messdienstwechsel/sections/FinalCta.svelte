<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import FinalCta from "$lib/landing/sections/FinalCta.svelte";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();
</script>

<FinalCta
	title="Wechseln war nie einfacher."
	sub="Ein Gespräch, ein Vertrag, fertig. Den Rest übernimmt Heidi."
	{form}
/>
