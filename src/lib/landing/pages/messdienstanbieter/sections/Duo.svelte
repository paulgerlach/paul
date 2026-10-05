<script lang="ts">
	import Duo from "$lib/landing/sections/region/Duo.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<Duo {content} />
