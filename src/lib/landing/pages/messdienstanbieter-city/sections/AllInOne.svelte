<script lang="ts">
	import AllInOne from "$lib/landing/sections/region/AllInOne.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<AllInOne {content} />
