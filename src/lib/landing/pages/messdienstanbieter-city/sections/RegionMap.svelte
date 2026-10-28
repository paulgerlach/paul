<script lang="ts">
	import RegionMap from "$lib/landing/sections/region/RegionMap.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<RegionMap {content} />
