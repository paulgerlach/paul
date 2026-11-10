<!-- "Probe an der Zapfstelle. Analyse im Labor." (the template's photo section). -->
<script lang="ts">
	import photo from "$lib/assets/landing/bleimessung/lab-team.webp?enhanced";
	import Split from "$lib/landing/sections/svc/Split.svelte";
	import { analysis } from "../content";
</script>

<Split content={analysis} {photo} width={1400} height={948}>
	{#snippet icon()}
		<path d="M10 2.5s5 5.6 5 9.3a5 5 0 0 1-10 0c0-3.7 5-9.3 5-9.3z" />
	{/snippet}
</Split>
