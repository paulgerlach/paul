<!-- "Menschen statt Hotline.": the shared people block with the region pages' copy and the page's own photo. -->
<script lang="ts">
	import People from "$lib/landing/sections/People.svelte";
	import type { RegionContent } from "./types";

	let { content }: { content: RegionContent } = $props();
</script>

<People
	title={["Menschen statt Hotline."]}
	text="Bei Heidi sprechen Sie mit Menschen, die Ihre Liegenschaften kennen. Wir planen den Wechsel mit Ihnen, stimmen Termine ab und sind da, wenn Fragen kommen."
	checks={[
		"Ein fester Ansprechpartner",
		"Alles aus einer Hand",
		"Erreichbar, wenn Fragen kommen",
	]}
	photo={content.peoplePhoto}
/>
