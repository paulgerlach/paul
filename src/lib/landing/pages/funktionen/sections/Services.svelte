<!-- "Was Heidi übernimmt": three service cards (.fk-le). -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import CardGrid from "../components/CardGrid.svelte";
	import IconPaths from "../components/IconPaths.svelte";
	import Section from "../components/Section.svelte";
	import { services } from "../content";
</script>

<Section labelledby="fk-services-h">
	<div class="head">
		<SectionHead
			id="fk-services-h"
			eyebrow={services.eyebrow}
			heading={services.h2}
			center
		>
			{#snippet icon()}<IconPaths name={services.eyebrowIcon} />{/snippet}
		</SectionHead>
	</div>
	<CardGrid items={services.items} />
</Section>

<style>
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
</style>
