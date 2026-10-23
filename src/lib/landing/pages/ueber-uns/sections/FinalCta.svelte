<!--
  The design's dark closing card (.dm-end with #dcta-css) with its text and
  the video button "Live Demo buchen", which leads to /demo.
-->
<script lang="ts">
	import DemoVideoButton from "$lib/landing/components/DemoVideoButton.svelte";
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { finalCta } from "../content";
</script>

<CtaCard id="uu-closing-h" title={finalCta.title} text={finalCta.text} final>
	{#snippet action()}
		<DemoVideoButton
			href={finalCta.button.href}
			label={finalCta.button.text}
			sub={finalCta.button.sub}
		/>
	{/snippet}
</CtaCard>
