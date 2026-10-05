<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import Hero from "$lib/landing/sections/region/Hero.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let {
		content,
		form,
	}: { content: RegionContent; form: SuperValidated<SwitchInquiry> } = $props();
</script>

<Hero {content} {form} />
