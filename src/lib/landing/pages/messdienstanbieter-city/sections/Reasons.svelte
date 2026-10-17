<script lang="ts">
	import Reasons from "$lib/landing/sections/region/Reasons.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<Reasons {content} />
