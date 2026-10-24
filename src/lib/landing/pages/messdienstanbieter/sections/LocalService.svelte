<script lang="ts">
	import LocalService from "$lib/landing/sections/region/LocalService.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<LocalService {content} />
