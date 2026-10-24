<!-- The two audience cards; the first shows the Portfolio-Checker in place of a photo. -->
<script lang="ts">
	import savings from "$lib/assets/landing/cities/frankfurt/hero.jpg?enhanced";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import type { AudienceCard } from "$lib/landing/sections/uv/types";
	import { audience } from "../content";
	import PortfolioChecker from "./PortfolioChecker.svelte";

	const [contract, saving] = audience.cards;
</script>

{#snippet checker()}<PortfolioChecker />{/snippet}

<Audience
	idPrefix="mv-who"
	label={audience.label}
	cards={[
		{ ...contract, media: checker },
		{ ...saving, image: savings },
	] satisfies AudienceCard[]}
/>
