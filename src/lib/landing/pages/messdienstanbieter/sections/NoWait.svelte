<script lang="ts">
	import NoWait from "$lib/landing/sections/region/NoWait.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<NoWait {content} />
