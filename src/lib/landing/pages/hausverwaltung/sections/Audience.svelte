<script lang="ts">
	import savings from "$lib/assets/landing/cities/berlin/references.jpg?enhanced";
	import contract from "$lib/assets/landing/mieterportal/facade-white.webp?enhanced";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import { audience } from "../content";

	const images = { contract, savings };
	const cards = audience.cards.map((card) => ({
		...card,
		image: images[card.image],
	}));
</script>

<Audience idPrefix="hv-who" label={audience.label} {cards} />
