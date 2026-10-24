<script lang="ts">
	import building from "$lib/assets/landing/mieterportal/building.webp?enhanced";
	import office from "$lib/assets/landing/vorgehen/office.webp?enhanced";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import { audience } from "../content";

	const images = { building, office };
	const cards = audience.cards.map((card) => ({
		...card,
		image: images[card.image],
	}));
</script>

<Audience idPrefix="mp-who" label={audience.label} {cards} />
