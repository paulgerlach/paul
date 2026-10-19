<!--
  The design's glass closing card with its text and the video button "Demo
  buchen", which leads to the page's form (plan, open question 1). No signup
  form on this page.
-->
<script lang="ts">
	import DemoVideoButton from "$lib/landing/components/DemoVideoButton.svelte";
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { closing } from "../content";
</script>

<CtaCard
	id="ps-closing-h"
	title={closing.h2}
	text={closing.text}
	tone="glass"
	final
>
	{#snippet action()}
		<DemoVideoButton
			href={closing.button.href}
			label={closing.button.text}
			sub={closing.button.sub}
		/>
	{/snippet}
</CtaCard>
