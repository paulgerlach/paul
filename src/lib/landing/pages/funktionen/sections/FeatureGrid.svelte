<!-- "Alle Funktionen": six cards (.fk-gr), links once their pages exist (plan README, open question 1). -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import CardGrid from "../components/CardGrid.svelte";
	import IconPaths from "../components/IconPaths.svelte";
	import Section from "../components/Section.svelte";
	import { features } from "../content";
</script>

<Section labelledby="fk-features-h">
	<div class="head">
		<SectionHead
			id="fk-features-h"
			eyebrow={features.eyebrow}
			heading={features.h2}
			center
		>
			{#snippet icon()}<IconPaths name={features.eyebrowIcon} />{/snippet}
		</SectionHead>
	</div>
	<CardGrid items={features.items} />
</Section>

<style>
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
</style>
