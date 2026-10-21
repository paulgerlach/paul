<script lang="ts">
	import LogoStrip from "$lib/landing/sections/LogoStrip.svelte";
	import type { RegionContent } from "$lib/landing/sections/region/types";

	let { content }: { content: RegionContent } = $props();
</script>

<!-- The logos are unconfirmed: see the go-live gate, plan §6.4. -->
<!-- id: the landing footer's "Kunden" links here. -->
<LogoStrip
	id="kunden"
	text={content.logoStrip.text}
	logos={content.logoStrip.logos}
/>
