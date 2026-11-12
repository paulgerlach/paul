<!-- "Berechnet statt geschätzt. Raum für Raum." (the template's photo section). -->
<script lang="ts">
	import photo from "$lib/assets/landing/hydraulischer-abgleich/manifold.webp?enhanced";
	import Split from "$lib/landing/sections/svc/Split.svelte";
	import { planning } from "../content";
</script>

<Split content={planning} {photo} width={720} height={434} position="50% 50%">
	{#snippet icon()}
		<path d="M10 3v14M5 7l5-4 5 4M5 13l5 4 5-4" />
	{/snippet}
</Split>
