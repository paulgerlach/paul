<!--
  The design's dark closing card (.dm-end / .dm-cta): "Jetzt Termin wählen ↑"
  leads back to the booking card (`#start`), which the card's click handler
  scrolls to and flashes.
-->
<script lang="ts">
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { closing } from "../content";
</script>

<CtaCard id="dm-closing-h" title={closing.h2}>
	{#snippet action()}
		<a class="bk-next inv" href={closing.cta.href}
			>{closing.cta.text} <span class="ar" aria-hidden="true">↑</span></a
		>
	{/snippet}
</CtaCard>
