<script lang="ts">
	import References from "$lib/landing/sections/region/References.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<References {content} />
