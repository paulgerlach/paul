<!--
  The design's dark closing card (.dm-end / .dm-cta) with its link "Jetzt
  prüfen ↑" back to the check card (`#checker`).
-->
<script lang="ts">
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { closing } from "../content";
</script>

<CtaCard id="mc-closing-h" title={closing.h2} final>
	{#snippet action()}
		<a class="bk-next inv" href={closing.back.href}
			>{closing.back.text} <span class="ar" aria-hidden="true">↑</span></a
		>
	{/snippet}
</CtaCard>
