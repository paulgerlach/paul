<script lang="ts">
	import { SliceSimulator } from "@slicemachine/adapter-sveltekit/simulator";
	import type { SliceZone as SliceZoneData } from "@prismicio/client";
	import { SliceZone } from "@prismicio/svelte";
	import { components } from "$lib/slices";
</script>

<SliceSimulator>
	{#snippet children({ slices }: { slices: SliceZoneData })}
		<SliceZone {slices} {components} />
	{/snippet}
</SliceSimulator>
