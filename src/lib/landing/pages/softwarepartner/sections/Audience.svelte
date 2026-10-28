<script lang="ts">
	import facade from "$lib/assets/landing/cities/muenchen/hero.jpg?enhanced";
	import building from "$lib/assets/landing/mieterportal/building.webp?enhanced";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import { audience } from "../content";

	const images = { facade, building };
	const cards = audience.cards.map((card) => ({
		...card,
		image: images[card.image],
	}));
</script>

<Audience idPrefix="sp-who" label={audience.label} {cards} />
