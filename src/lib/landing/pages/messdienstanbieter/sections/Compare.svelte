<script lang="ts">
	import Compare from "$lib/landing/sections/region/Compare.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<Compare {content} />
