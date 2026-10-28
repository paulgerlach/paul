<script lang="ts">
	import People from "$lib/landing/sections/region/People.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<People {content} />
